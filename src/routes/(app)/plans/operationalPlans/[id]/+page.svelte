<script lang="ts">
	import { Trash2, Plus, Save, ChevronLeft } from "lucide-svelte";
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import PlanCard from "$lib/components/monitoring/departments/PlanComponent/PlanCard.svelte";

	interface ActionPlan {
		id?: number;
		actions_taken: string;
		kpi: string;
		target_output: string;
		key_person_responsible: string;
		objective_id: number;
		profile_id: string;
		department_id: string;
		budget: number;
		isNew?: boolean;
		isEdited?: boolean;
	}

	let actionPlans: ActionPlan[] = [];
	let newPlans: ActionPlan[] = [];
	let profile: { id: string; department_id: string } | null = null;
	let objective_id: number | null = null;
	let isLoading = false;
	let isSaving = false;
	let successMessage: string | null = null;
	let errorMessage: string | null = null;

	/** Fetch existing action plans */
	const fetchActionPlans = async () => {
		if (!objective_id || !profile?.department_id) {
			errorMessage = "Objective ID or Department ID is missing.";
			console.error("Missing IDs: ", { objective_id, department_id: profile?.department_id });
			return;
		}

		isLoading = true;
		try {
			const { data, error } = await supabase
				.from("action_plans")
				.select("*")
				.eq("objective_id", objective_id)
				.eq("department_id", profile.department_id)
				.order("id", { ascending: true }); // Sort by `id` or another timestamp field if available

			if (error) throw error;

			actionPlans = data || [];
		} catch (error) {
			console.error("Error fetching action plans:", error);
			errorMessage = "Failed to fetch action plans.";
		} finally {
			isLoading = false;
		}
	};


	/** Add a new plan to the list */
	const addNewPlan = () => {
		if (!profile?.id || !profile.department_id || !objective_id) {
			errorMessage = "Missing required profile or objective information.";
			return;
		}

		newPlans = [
			...newPlans,
			{
				actions_taken: "",
				kpi: "",
				target_output: "",
				key_person_responsible: "",
				objective_id: objective_id,
				profile_id: profile.id,
				department_id: profile.department_id,
				budget: 0,
				isNew: true,
			},
		];
	};

	/** Mark Edited Plan */
	const markPlanAsEdited = (index: number, isNew = false) => {
		if (isNew) {
			newPlans[index].isEdited = true;
		} else {
			actionPlans[index].isEdited = true;
		}
	};


	/** Delete a new plan */
	const deleteNewPlan = (index: number) => {
		newPlans = newPlans.filter((_, i) => i !== index);
	};

	/** Delete an existing plan */
	const deletePlan = async (planId: number) => {
		try {
			const { error } = await supabase
				.from("action_plans")
				.delete()
				.eq("id", planId);

			if (error) throw error;

			// Refresh the action plans list
			await fetchActionPlans();
			successMessage = "Plan deleted successfully.";
		} catch (error) {
			console.error("Error deleting plan:", error);
			errorMessage = "Failed to delete plan.";
		} finally {
			setTimeout(() => {
				successMessage = null;
				errorMessage = null;
			}, 3000);
		}
	};

	/** Save All Action Plans */
	const submitAllPlans = async () => {
		isSaving = true;
		try {
			// Filter new or edited action plans
			const newOrEditedPlans = [
				...newPlans,
				...actionPlans.filter((plan) => plan.isNew || plan.isEdited),
			];

			// Remove `isNew` and `isEdited` fields before saving
			const sanitizedPlans = newOrEditedPlans.map(({ isNew, isEdited, ...rest }) => rest);

			if (sanitizedPlans.length > 0) {
				// Upsert the sanitized plans
				const { error } = await supabase
					.from("action_plans")
					.upsert(sanitizedPlans, { onConflict: "id" }); // Adjust the conflict keys as per your schema

				if (error) throw error;

				// Refresh action plans
				await fetchActionPlans();
				newPlans = []; // Clear new plans after submission
				successMessage = "All action plans submitted successfully.";
			} else {
				successMessage = "No changes to save.";
			}
		} catch (error) {
			console.error("Error submitting all action plans:", error);
			errorMessage = "Failed to submit all action plans.";
		} finally {
			isSaving = false;
			setTimeout(() => {
				successMessage = null;
				errorMessage = null;
			}, 3000);
		}
	};



	/** Fetch data on mount */
	onMount(async () => {
		try {
			// Example: Objective ID is retrieved from a parameter
			const { params } = $page;
			objective_id = parseInt(params.id);

			if (!objective_id) {
				errorMessage = "Objective ID is missing.";
				console.error("Objective ID is null or invalid:", params.id);
				return; // Exit early
			}

			const user = await supabase.auth.getUser();
			if (!user?.data?.user) {
				errorMessage = "User not logged in.";
				return;
			}

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, department_id")
				.eq("id", user.data.user.id)
				.single();

			if (profileError || !profileData) {
				errorMessage = "Failed to fetch user profile details.";
				return;
			}

			profile = profileData;
			await fetchActionPlans();
		} catch (error) {
			console.error("Error during initialization:", error);
			errorMessage = "Initialization failed.";
		}
	});

</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- Alerts -->
	{#if successMessage}
		<div class="p-4 rounded-lg bg-green-100 text-green-800">
			<span>{successMessage}</span>
		</div>
	{/if}
	{#if errorMessage}
		<div class="p-4 rounded-lg bg-red-100 text-red-800">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Action Plans -->
	<div class="bg-card rounded-lg shadow border border-border p-6">
		<h2 class="text-xl font-semibold mb-4">Action Plans</h2>
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each actionPlans as plan, index (plan.id)}
					<PlanCard
						data={plan}
						planNumber={index + 1}
						onSave={(updatedPlan) => markPlanAsEdited(index)}
						onDelete={() => deletePlan(plan.id!)}
					/>
				{/each}

				{#each newPlans as newPlan, index (index)}
					<PlanCard
						data={newPlan}
						planNumber={actionPlans.length + index + 1}
						onSave={() => markPlanAsEdited(index, true)}
						onDelete={() => deleteNewPlan(index)}
					/>
				{/each}
			</div>

			<div class="flex justify-end mt-4 gap-4">
				<button onclick={addNewPlan} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
					<Plus class="w-4 h-4 mr-2" />
					Add New Plan
				</button>
				<button onclick={submitAllPlans} disabled={isSaving} class="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
					{#if isSaving}
						<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
					{:else}
						<Save class="w-4 h-4 mr-2" />
					{/if}
					Submit All Plans
				</button>
			</div>
		{/if}
	</div>
</div>
