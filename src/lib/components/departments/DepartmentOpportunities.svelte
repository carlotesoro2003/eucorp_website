<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { Plus, Trash2, Save, Target, PlusCircle, Lightbulb } from "lucide-svelte";
	import OpportunityCard from "$lib/components/dept-opts/OpportunityCard.svelte";
	import { fade } from "svelte/transition";

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
	let showAlert: boolean = $state(false);
	let alertMessage: string = $state("");
	let alertType: "success" | "error" = $state("success");

	/** Display Alert */
	const displayAlert = (message: string, type: "success" | "error") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	// Functions
	const fetchUserProfile = async (): Promise<void> => {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (session) {
			const { data, error } = await supabase.from("profiles").select("id, department_id").eq("id", session.user.id).single();

			if (error) {
				displayAlert("Error fetching profile", "error");
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
				displayAlert("Error creating opportunities", "error");
				return;
			}

			if (data && data.length > 0) {
				const events = await Promise.all(
					data.map(async (opportunity) => {
						const { data: departmentData, error: departmentError } = await supabase.from("departments").select("name").eq("id", opportunity.department_id).single();

						if (departmentError) {
							displayAlert(`Error fetching department name`, "error");
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

			displayAlert("Opportunities created successfully", "success");
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
			displayAlert("Unexpected error occurred", "error");
		} finally {
			isSaving = false;
		}
	};

	const fetchOpportunities = async (): Promise<void> => {
		isLoading = true;
		const { data, error } = await supabase.from("opportunities").select("*").eq("profile_id", profileId);

		if (error) {
			displayAlert("Error fetching opportunities", "error");
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

<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div transition:fade class="flex items-center p-4 rounded-lg {alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<Lightbulb class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Opportunities Register</h1>
		</div>
	</div>

	<div class="bg-card rounded-lg shadow border border-border p-6">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold">
				{selectedOpportunity ? "Edit Opportunity" : "Create Opportunity"}
			</h2>
			<button class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={isSaving} onclick={() => console.log("Save Progress")}>
				<Save class="w-4 h-4 mr-2" />
				Save Progress
			</button>
		</div>

		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		{:else}
			<!-- Cards Container -->
			<div class="grid grid-cols-1 gap-6 mb-6">
				{#each formData as data, index}
					<OpportunityCard {data} {index} onDelete={() => deleteCard(index)} />
				{/each}
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-4">
				<button onclick={addCard} class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
					<Plus class="w-4 h-4 mr-2" />
					Add New Opportunity
				</button>

				<button onclick={createOpportunity} class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={isLoading || isSaving}>
					<PlusCircle class="w-4 h-4 mr-2" />
					{#if isSaving}
						<div class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
					{:else}
						{selectedOpportunity ? "Save Changes" : "Submit Opportunities"}
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>
