<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { Plus, Lightbulb } from "lucide-svelte";
	import OpportunityCard from "$lib/components/dept-opts/OpportunityCard.svelte";
	import { fade } from "svelte/transition";

	interface Opportunity {
		id?: number;
		opt_statement: string;
		planned_actions: string;
		kpi: string;
		key_persons: string;
		target_output: string;
		budget: number;
		profile_id: string;
		department_id: string;
	}

	let opportunities: Opportunity[] = [];
	let formData: Opportunity[] = [];
	let profile: { id: string; department_id: string } | null = null;
	let departmentName: string = "";
	let isLoading = false;
	let isSaving = false;
	let showAlert = false;
	let alertMessage = "";
	let alertType: "success" | "error" = "success";

	/** Display Alert */
	const displayAlert = (message: string, type: "success" | "error") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	/** Fetch User Profile */
	const fetchUserProfile = async () => {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;

			const userId = sessionData?.session?.user?.id;
			if (!userId) throw new Error("No logged-in user found.");

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, department_id")
				.eq("id", userId)
				.single();

			if (profileError) throw profileError;

			profile = profileData;

			const { data: departmentData, error: departmentError } = await supabase
				.from("departments")
				.select("name")
				.eq("id", profile.department_id)
				.single();

			if (departmentError) throw departmentError;

			departmentName = departmentData.name;

			// Pre-fill department_id and profile_id in new opportunity form data
			formData.forEach((row) => {
				row.department_id = profile.department_id;
				row.profile_id = profile.id;
			});
		} catch (error) {
			console.error("Error fetching user profile:", error);
			displayAlert("Failed to fetch profile details.", "error");
		}
	};

	/** Fetch Opportunities */
	const fetchOpportunities = async () => {
		isLoading = true;
		try {
			const { data, error } = await supabase
				.from("opportunities")
				.select("*")
				.eq("department_id", profile?.department_id);

			if (error) throw error;

			opportunities = data || [];
		} catch (error) {
			console.error("Error fetching opportunities:", error);
			displayAlert("Error fetching opportunities.", "error");
		} finally {
			isLoading = false;
		}
	};

	/** Save Edited Opportunity */
	const saveOpportunity = async (opportunity: Opportunity) => {
		isSaving = true;
		try {
			const { error } = opportunity.id
				? await supabase.from("opportunities").update(opportunity).eq("id", opportunity.id) // Update existing opportunity
				: await supabase.from("opportunities").insert(opportunity); // Save new opportunity

			if (error) throw error;

			displayAlert("Opportunity saved successfully.", "success");
			await fetchOpportunities(); // Refresh list
		} catch (error) {
			console.error("Error saving opportunity:", error);
			displayAlert("Error saving opportunity.", "error");
		} finally {
			isSaving = false;
		}
	};

	/** Delete Opportunity */
	const deleteOpportunity = async (opportunityId: number) => {
		isSaving = true;
		try {
			const { error } = await supabase.from("opportunities").delete().eq("id", opportunityId);

			if (error) throw error;

			displayAlert("Opportunity deleted successfully.", "success");
			await fetchOpportunities(); // Refresh list
		} catch (error) {
			console.error("Error deleting opportunity:", error);
			displayAlert("Error deleting opportunity.", "error");
		} finally {
			isSaving = false;
		}
	};

	/** Add New Opportunity Form */
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
				profile_id: profile?.id || "",
				department_id: profile?.department_id || "",
			},
		];
	};

	/** Delete New Opportunity Form */
	const deleteCard = (index: number) => {
		formData.splice(index, 1);
		formData = [...formData];
	};

	/** Initialize Data */
	onMount(async () => {
		await fetchUserProfile();
		await fetchOpportunities();
	});
</script>

<!-- Template -->
<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div transition:fade class="flex items-center p-4 rounded-lg {alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<Lightbulb class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">{departmentName} Opportunities Register</h1>
		</div>
	</div>

	<div class="bg-card rounded-lg shadow border border-border p-6">
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<!-- Existing Opportunities -->
			<div class="grid grid-cols-1 gap-6 mb-6">
				{#each opportunities as opportunity, index}
					<OpportunityCard
						data={opportunity}
						index={index}
						isNew={false}
						onSave={saveOpportunity}
						onDelete={() => deleteOpportunity(opportunity.id!)}
					/>
				{/each}

				<!-- New Opportunities -->
				{#each formData as data, index}
					<OpportunityCard
						data={data}
						index={index}
						isNew={true}
						onSave={saveOpportunity}
						onDelete={() => deleteCard(index)}
					/>
				{/each}
			</div>

			<div class="flex gap-4">
				<button onclick={addCard} class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
					<Plus class="w-4 h-4 mr-2" />
					Add New Opportunity
				</button>
			</div>
		{/if}
	</div>
</div>
