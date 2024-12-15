<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { Plus } from "lucide-svelte";
	import OpportunityCard from "$lib/components/dept-opts/OpportunityCard.svelte";

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
		isNew?: boolean;
		isEdited?: boolean;
	}

	let opportunities: Opportunity[] = [];
	let profile: { id: string; department_id: string } | null = null;
	let isLoading = false;
	let isSaving = false;
	let successMessage: string | null = null;
	let errorMessage: string | null = null;

	/** Display Alerts */
	const displayAlert = (message: string, type: "success" | "error") => {
		successMessage = type === "success" ? message : null;
		errorMessage = type === "error" ? message : null;
		setTimeout(() => {
			successMessage = null;
			errorMessage = null;
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
				.eq("department_id", profile?.department_id)
				.order("id", { ascending: true });

			if (error) throw error;

			opportunities = data || [];
		} catch (error) {
			console.error("Error fetching opportunities:", error);
			displayAlert("Error fetching opportunities.", "error");
		} finally {
			isLoading = false;
		}
	};

	/** Add New Opportunity */
	const addOpportunity = () => {
		if (!profile?.id || !profile.department_id) {
			displayAlert("Missing profile or department information.", "error");
			return;
		}

		opportunities = [
			...opportunities,
			{
				opt_statement: "",
				planned_actions: "",
				kpi: "",
				key_persons: "",
				target_output: "",
				budget: 0,
				profile_id: profile.id,
				department_id: profile.department_id,
				isNew: true,
			},
		];
	};

	/** Mark Opportunity as Edited */
	const markOpportunityAsEdited = (index: number) => {
		if (opportunities[index]) {
			opportunities[index].isEdited = true;
		}
	};

	/** Save Opportunities */
	const saveOpportunities = async () => {
		isSaving = true;
		try {
			const newOrEditedOpportunities = opportunities.filter((opportunity) => opportunity.isNew || opportunity.isEdited);

			const sanitizedOpportunities = newOrEditedOpportunities.map(({ isNew, isEdited, ...rest }) => rest);

			if (sanitizedOpportunities.length > 0) {
				const { error } = await supabase.from("opportunities").upsert(sanitizedOpportunities, { onConflict: "id" });
				if (error) throw error;

				await fetchOpportunities();
				displayAlert("Opportunities saved successfully!", "success");
			} else {
				displayAlert("No changes to save.", "success");
			}
		} catch (error) {
			console.error("Error saving opportunities:", error);
			displayAlert("Failed to save opportunities.", "error");
		} finally {
			isSaving = false;
		}
	};

	/** Delete Opportunity */
	const deleteOpportunity = async (index: number) => {
		const opportunityToDelete = opportunities[index];

		if (opportunityToDelete.isNew) {
			opportunities = opportunities.filter((_, i) => i !== index);
			return;
		}

		try {
			const { error } = await supabase.from("opportunities").delete().eq("id", opportunityToDelete.id);

			if (error) throw error;

			opportunities = opportunities.filter((_, i) => i !== index);
			displayAlert("Opportunity deleted successfully.", "success");
		} catch (error) {
			console.error("Error deleting opportunity:", error);
			displayAlert("Failed to delete opportunity.", "error");
		}
	};

	/** Handle field edit */
	const handleEditOpportunity = (index: number, field: string, value: any) => {
		opportunities[index] = { ...opportunities[index], [field]: value, isEdited: true };
	};

	/** Save individual opportunity */
	const saveIndividualOpportunity = async (index: number) => {
		try {
			const { isEdited, isNew, ...data } = opportunities[index];

			// Save to the database
			const { error } = await supabase.from("opportunities").upsert(data, { onConflict: "id" });
			if (error) throw error;

			// Refresh opportunities
			await fetchOpportunities();
			displayAlert("Opportunity saved successfully.", "success");
		} catch (error) {
			console.error("Error saving opportunity:", error);
			displayAlert("Failed to save opportunity.", "error");
		}
	};

	/** Initialize Component */
	onMount(async () => {
		await fetchUserProfile();
		await fetchOpportunities();
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- Alerts -->
	{#if successMessage}
		<div class="p-4 rounded-lg bg-green-100 text-green-800">{successMessage}</div>
	{/if}
	{#if errorMessage}
		<div class="p-4 rounded-lg bg-red-100 text-red-800">{errorMessage}</div>
	{/if}

	<!-- Opportunities -->
	<div class="bg-card rounded-lg shadow border border-border p-6">
		<h2 class="text-xl font-semibold mb-4">Opportunities</h2>
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 mb-6">
				{#each opportunities as opportunity, index}
					<OpportunityCard
						data={opportunity}
						opportunityNumber={index + 1}
						onEdit={(field, value) => handleEditOpportunity(index, field, value)}
						onSave={() => saveIndividualOpportunity(index)}
						onDelete={() => deleteOpportunity(index)}
					/>
				{/each}
			</div>

			<div class="flex justify-end gap-4">
				<button onclick={addOpportunity} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
					<Plus class="w-4 h-4 mr-2" />
					Add Opportunity
				</button>
				<button onclick={saveOpportunities} disabled={isSaving} class="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
					Save All
				</button>
			</div>
		{/if}
	</div>
</div>
