<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { Plus, Trash2, Save, PlusCircle } from "lucide-svelte";
	import OpportunityCard from "$lib/components/dept-opts/OpportunityCard.svelte";

	interface Opportunity {
		id: number;
		opt_statement: string;
		planned_actions: string;
		kpi: string;
		key_persons: string;
		target_output: string;
		budget: number;
		profile_id: string;
	}

	// Reactive states
	let opportunities: Opportunity[] = $state([]);
	let selectedOpportunity: Opportunity | null = $state(null);
	let isLoading: boolean = $state(false);
	let isSaving: boolean = $state(false);
	let formData = $state([
		{
			opt_statement: "",
			planned_actions: "",
			kpi: "",
			key_persons: "",
			target_output: "",
			budget: 0,
			profile_id: "",
			department_id: "",
		},
	]);
	let profileId: string | null = $state(null);

	// Functions
	const fetchUserProfile = async (): Promise<void> => {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (session) {
			const { data, error } = await supabase.from("profiles").select("id, department_id").eq("id", session.user.id).single();

			if (error) {
				console.error("Error fetching profile:", error);
			} else {
				profileId = data.id;
				formData.forEach((row) => {
					row.department_id = data.department_id;
				});
			}
		}
	};

	const createOpportunity = async () => {
		if (!profileId) return;

		isSaving = true;
		try {
			const { data, error } = await supabase
				.from("opportunities")
				.insert(
					formData.map((row) => ({
						...row,
						profile_id: profileId,
						department_id: row.department_id,
					}))
				)
				.select();

			if (error) {
				console.error("Error creating opportunities:", error);
				return;
			}

			if (data && data.length > 0) {
				const events = await Promise.all(
					data.map(async (opportunity) => {
						const { data: departmentData, error: departmentError } = await supabase.from("departments").select("name").eq("id", opportunity.department_id).single();

						if (departmentError) {
							console.error(`Error fetching department name for ID ${opportunity.department_id}:`, departmentError);
							return null;
						}

						const departmentName = departmentData?.name || "Unknown Department";

						return {
							event_id: opportunity.id,
							event_type: "opportunity",
							description: `${departmentName} created a new opportunity`,
						};
					})
				);

				const validEvents = events.filter((event) => event !== null);

				if (validEvents.length > 0) {
					await supabase.from("recent_events").insert(validEvents);
				}
			}

			// Reset form and refresh
			await fetchOpportunities();
			formData = [
				{
					opt_statement: "",
					planned_actions: "",
					kpi: "",
					key_persons: "",
					target_output: "",
					budget: 0,
					profile_id: "",
					department_id: formData[0].department_id,
				},
			];
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			isSaving = false;
		}
	};

	const fetchOpportunities = async (): Promise<void> => {
		isLoading = true;
		const { data, error } = await supabase.from("opportunities").select("*").eq("profile_id", profileId);

		if (error) {
			console.error("Error fetching opportunities:", error);
		} else {
			opportunities = data;
		}
		isLoading = false;
	};

	const deleteCard = (index: number) => {
		formData.splice(index, 1);
		formData = [...formData];
	};

	const addCard = () => {
		formData = [
			...formData,
			{
				opt_statement: "",
				planned_actions: "",
				kpi: "",
				key_persons: "",
				target_output: "",
				budget: 0,
				profile_id: profileId || "",
				department_id: formData[0]?.department_id || "",
			},
		];
	};

	onMount(() => {
		fetchUserProfile();
		if (profileId) {
			fetchOpportunities();
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="bg-white rounded-xl shadow-lg p-6 mb-8">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold text-gray-800">
				{selectedOpportunity ? "Edit Opportunity" : "Create Opportunity"}
			</h1>
			<button class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50" disabled={isSaving} onclick={() => console.log("Save Progress")}>
				<Save class="w-4 h-4 mr-2" />
				Save Progress
			</button>
		</div>

		<!-- Cards Container -->
		<div class="grid grid-cols-1 gap-6 mb-6">
			{#each formData as data, index}
				<OpportunityCard {data} {index} onDelete={() => deleteCard(index)} />
			{/each}
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap gap-4">
			<button onclick={addCard} class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				<Plus class="w-4 h-4 mr-2" />
				Add New Opportunity
			</button>

			<button onclick={createOpportunity} class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50" disabled={isLoading || isSaving}>
				<PlusCircle class="w-4 h-4 mr-2" />
				{#if isSaving}
          <div class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
				{:else}
					{selectedOpportunity ? "Save Changes" : "Submit Opportunities"}
				{/if}
			</button>
		</div>
	</div>
</div>
