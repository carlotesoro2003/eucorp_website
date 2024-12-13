<script lang="ts">
	import { Trash2, Plus, Save, Loader2, ChevronLeft } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import PlanCard from "$lib/components/monitoring/departments/PlanComponent/PlanCard.svelte";

	interface StrategicObjective {
		name: string;
		strategic_goal_id: number;
	}

	interface StrategicGoal {
		name: string;
		goal_no: number;
	}

	interface ActionPlan {
		id?: number;
		actions_taken: string;
		kpi: string;
		target_output: string;
		key_person_responsible: string;
		objective_id: number;
		profile_id: string;
		department_id: string;
	}

	let strategicObjective: StrategicObjective | null = null;
	let strategicGoal: StrategicGoal | null = null;
	let actionPlans: ActionPlan[] = [];
	let newPlans: ActionPlan[] = [];
	let profile: { id: string; department_id: string } | null = null;
	let objective_id: number | null = null;
	let isLoading = false;
	let isSaving = false;
	let showAlert = false;
	let alertMessage = "";
	let alertType: "success" | "error" = "success";

	/** Display alert messages */
	const displayAlert = (message: string, type: "success" | "error") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	/** Fetch strategic objective and goal */
	const fetchStrategicObjectiveAndGoal = async (objective_id: number) => {
		try {
			const { data: objectiveData, error: objectiveError } = await supabase
				.from("strategic_objectives")
				.select("name, strategic_goal_id")
				.eq("id", objective_id)
				.single();

			if (objectiveError || !objectiveData) throw new Error("Failed to fetch strategic objective.");

			strategicObjective = objectiveData;

			const { data: goalData, error: goalError } = await supabase
				.from("strategic_goals")
				.select("name, goal_no")
				.eq("id", objectiveData.strategic_goal_id)
				.single();

			if (goalError || !goalData) throw new Error("Failed to fetch strategic goal.");

			strategicGoal = goalData;
		} catch (error) {
			console.error("Error fetching strategic data:", error);
			displayAlert("Failed to fetch strategic details.", "error");
		}
	};

	/** Fetch existing action plans */
	const fetchActionPlans = async () => {
		isLoading = true;
		try {
			const { data, error } = await supabase
				.from("action_plans")
				.select("*")
				.eq("objective_id", objective_id);

			if (error) throw error;

			actionPlans = data || [];
		} catch (error) {
			console.error("Error fetching action plans:", error);
			displayAlert("Failed to fetch action plans.", "error");
		} finally {
			isLoading = false;
		}
	};

	/** Save an action plan */
	const savePlan = async (plan: ActionPlan, isNew: boolean) => {
		if (!plan.profile_id || !plan.department_id || !plan.objective_id) {
			displayAlert("Plan is missing required fields.", "error");
			return;
		}

		isSaving = true;
		try {
			if (isNew) {
				const { data, error } = await supabase.from("action_plans").insert([plan]);
				if (error) throw error;
				if (data) actionPlans = [...actionPlans, ...data];
			} else {
				const { error } = await supabase.from("action_plans").update(plan).eq("id", plan.id);
				if (error) throw error;
				actionPlans = actionPlans.map((p) => (p.id === plan.id ? plan : p));
			}
			displayAlert(isNew ? "Plan added successfully." : "Plan updated successfully.", "success");
		} catch (error) {
			console.error("Error saving action plan:", error);
			displayAlert("Failed to save action plan.", "error");
		} finally {
			isSaving = false;
		}
	};

	/** Delete an action plan */
	const deletePlan = async (id: number) => {
		isSaving = true;
		try {
			const { error } = await supabase.from("action_plans").delete().eq("id", id);
			if (error) throw error;
			actionPlans = actionPlans.filter((p) => p.id !== id);
			displayAlert("Plan deleted successfully.", "success");
		} catch (error) {
			console.error("Error deleting action plan:", error);
			displayAlert("Failed to delete action plan.", "error");
		} finally {
			isSaving = false;
		}
	};

	/** Add a new plan to the list */
	const addNewPlan = () => {
		if (!profile?.id || !profile.department_id || !objective_id) {
			displayAlert("Missing required profile or objective information.", "error");
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
			},
		];
	};

	/** Remove a new plan from the list */
	const deleteNewPlan = (index: number) => {
		newPlans = newPlans.filter((_, i) => i !== index);
	};

	/** Fetch data on mount */
	onMount(async () => {
		try {
			const { params } = $page;
			objective_id = parseInt(params.id);

			if (!objective_id) {
				displayAlert("Objective ID is missing.", "error");
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				displayAlert("User not logged in.", "error");
				return;
			}

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, department_id")
				.eq("id", user.id)
				.single();

			if (profileError || !profileData) {
				displayAlert("Failed to fetch user profile details.", "error");
				return;
			}

			profile = profileData;

			await fetchStrategicObjectiveAndGoal(objective_id);
			await fetchActionPlans();
		} catch (error) {
			console.error("Error during initialization:", error);
			displayAlert("Initialization failed.", "error");
		}
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div class="p-4 rounded-lg {alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<a href="/plans/operationalPlans" class="flex items-center gap-2 text-muted-foreground mb-2 hover:text-foreground">
		<ChevronLeft size={20} />
		Back to Operational Plans
	</a>

	<!-- Strategic Details -->
	<div class="bg-card border border-border rounded-lg shadow p-6">
		<h1 class="text-2xl font-bold">Strategic Details</h1>
		{#if strategicGoal && strategicObjective}
			<div class="mt-4 space-y-2">
				<h5 class="text-md font-medium">
					Strategic Goal:
					<span class="ml-2 text-muted-foreground">{strategicGoal.goal_no} - {strategicGoal.name}</span>
				</h5>
				<h5 class="text-md font-medium">
					Strategic Objective:
					<span class="ml-2 text-muted-foreground">{strategicObjective.name}</span>
				</h5>
			</div>
		{:else}
			<p class="text-muted-foreground">Loading strategic details...</p>
		{/if}
	</div>

	<!-- Action Plans -->
	<div class="bg-card rounded-lg shadow border border-border p-6">
		<h2 class="text-xl font-semibold mb-4">Action Plans</h2>
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each actionPlans as plan, index}
					<PlanCard
						data={plan}
						index={index}
						onSave={(updatedPlan) => savePlan(updatedPlan, false)}
						onDelete={() => deletePlan(plan.id!)}
					/>
				{/each}

				{#each newPlans as newPlan, index}
					<PlanCard
						data={newPlan}
						index={index}
						onSave={(addedPlan) => savePlan(addedPlan, true)}
						onDelete={() => deleteNewPlan(index)}
					/>
				{/each}
			</div>




			<div class="flex justify-end mt-4">
				<button onclick={addNewPlan} class=" bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80">
					<Plus class="w-4 h-4 mr-2" />
					Add New Plan
				</button>
			</div>
		{/if}
	</div>
</div>
