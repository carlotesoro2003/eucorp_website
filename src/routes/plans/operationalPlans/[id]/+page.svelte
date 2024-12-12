<script lang="ts">
	import { Trash2, Plus, Save, Loader2, X } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import Alert from "$lib/components/operational-plans/add-action-plans/Alert.svelte";
	import Modal from "$lib/components/operational-plans/add-action-plans/Modal.svelte";
	import type { ActionPlan } from "$lib/types/ActionPlan";
	import { fade } from "svelte/transition";

	/** Interface for strategic objective */
	interface StrategicObjective {
		name: string;
		strategic_goal_id: number;
	}

	/** Interface for strategic goal */
	interface StrategicGoal {
		name: string;
		goal_no: number;
	}

	/** State variables */
	let actionPlans: ActionPlan[] = $state([]);
	let currentPlan: ActionPlan = $state({
		actions_taken: "",
		kpi: "",
		target_output: "",
		key_person_responsible: "",
		objective_id: 0,
		profile_id: "",
		department_id: "",
	});

	let strategicObjective: StrategicObjective | null = $state(null);
	let strategicGoal: StrategicGoal | null = $state(null);
	let alertMessage: string = $state("");
	let alertType: string = $state("info");
	let objective_id: number | null = $state(null);
	let isSubmitting: boolean = $state(false);
	let profile_id: string = $state("");
	let showModal: boolean = $state(false);
	let editIndex: number = $state(-1);
	let showAlert: boolean = $state(false);

	/** On component mount */
	onMount(() => {
		const { params } = $page;
		objective_id = parseInt(params.id);

		if (objective_id) {
			currentPlan.objective_id = objective_id;
			fetchStrategicObjectiveAndGoal(objective_id);
			fetchUserProfileId();
		} else {
			displayAlert("Objective ID is missing.", "error");
		}
	});

	/** Fetch user profile ID and department */
	const fetchUserProfileId = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			const { data: profileData, error } = await supabase.from("profiles").select("id, department_id").eq("id", user.id).single();

			if (error || !profileData) {
				displayAlert("Failed to fetch user profile details.", "error");
				return;
			}

			profile_id = profileData.id;
			currentPlan.profile_id = profile_id;
			currentPlan.department_id = profileData.department_id;
		} else {
			displayAlert("User not logged in.", "error");
		}
	};

	/** Fetch strategic objective and goal */
	const fetchStrategicObjectiveAndGoal = async (objective_id: number) => {
		try {
			const { data: objectiveData, error: objectiveError } = await supabase.from("strategic_objectives").select("name, strategic_goal_id").eq("id", objective_id).single();

			if (objectiveError || !objectiveData) {
				displayAlert("Failed to fetch strategic objective.", "error");
				return;
			}

			strategicObjective = objectiveData;

			const { data: goalData, error: goalError } = await supabase.from("strategic_goals").select("name, goal_no").eq("id", objectiveData.strategic_goal_id).single();

			if (goalError || !goalData) {
				displayAlert("Failed to fetch strategic goal.", "error");
				return;
			}

			strategicGoal = goalData;
		} catch (err) {
			displayAlert("An error occurred while fetching strategic data.", "error");
		}
	};

	/** Open modal to add/edit plan */
	const openModal = (index: number = -1) => {
		if (index >= 0) {
			currentPlan = { ...actionPlans[index] };
			editIndex = index;
		} else {
			currentPlan = {
				actions_taken: "",
				kpi: "",
				target_output: "",
				key_person_responsible: "",
				objective_id: objective_id || 0,
				profile_id,
				department_id: currentPlan.department_id,
			};
			editIndex = -1;
		}
		showModal = true;
	};

	/** Save current plan */
	const savePlan = () => {
		if (editIndex >= 0) {
			actionPlans[editIndex] = { ...currentPlan };
		} else {
			actionPlans = [...actionPlans, { ...currentPlan }];
		}
		showModal = false;
	};

	/** Delete plan */
	const deletePlan = (index: number) => {
		if (confirm("Are you sure you want to delete this plan?")) {
			actionPlans = actionPlans.filter((_, i) => i !== index);
		}
	};

	/** Submit action plans */
	const submitActionPlans = async () => {
		if (actionPlans.length === 0) {
			displayAlert("Please add at least one action plan.", "warning");
			return;
		}

		try {
			isSubmitting = true;
			const { error } = await supabase.from("action_plans").insert(actionPlans);

			if (error) {
				displayAlert("Failed to submit action plans.", "error");
			} else {
				displayAlert("Action plans submitted successfully.", "success");
				actionPlans = [];
			}
		} catch (err) {
			displayAlert("An error occurred while submitting action plans.", "error");
		} finally {
			isSubmitting = false;
		}
	};

	/** Display Alert */
	const displayAlert = (message: string, type: "success" | "error" | "warning") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div transition:fade class="flex items-center p-4 rounded-lg {alertType === 'success' ? 'bg-green-100 text-green-800' : alertType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<!-- Header -->
	<div class="bg-card border border-border rounded-lg shadow p-6">
		<h1 class="text-2xl font-bold">Action Plans</h1>
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
		{/if}
	</div>

	<!-- Action Plans List -->
	<div class="bg-card rounded-lg shadow border border-border p-6">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold">Action Plans List</h2>
			<button onclick={() => openModal()} class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
				<Plus size={20} />
				Add Plan
			</button>
		</div>

		<div class="space-y-4">
			{#each actionPlans as plan, index}
				<div class="border border-border rounded-lg p-4 relative hover:bg-muted/50 transition-colors">
					<div class="grid md:grid-cols-2 gap-4">
						<div>
							<h4 class="font-medium">Actions Taken</h4>
							<p class="text-muted-foreground mt-1">{plan.actions_taken}</p>
						</div>
						<div>
							<h4 class="font-medium">KPI</h4>
							<p class="text-muted-foreground mt-1">{plan.kpi}</p>
						</div>
						<div>
							<h4 class="font-medium">Target Output</h4>
							<p class="text-muted-foreground mt-1">{plan.target_output}</p>
						</div>
						<div>
							<h4 class="font-medium">Key Person Responsible</h4>
							<p class="text-muted-foreground mt-1">{plan.key_person_responsible}</p>
						</div>
					</div>
					<div class="absolute top-4 right-4 flex gap-2">
						<button onclick={() => openModal(index)} class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
							<Save size={18} />
						</button>
						<button onclick={() => deletePlan(index)} class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
							<Trash2 size={18} />
						</button>
					</div>
				</div>
			{/each}
		</div>

		{#if actionPlans.length === 0}
			<div class="text-center py-8 text-muted-foreground">No action plans added yet. Click "Add Plan" to create one.</div>
		{/if}
	</div>

	<!-- Submit Button -->
	<div class="flex justify-end">
		<button onclick={submitActionPlans} disabled={isSubmitting} class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
			{#if isSubmitting}
				<Loader2 class="animate-spin" size={20} />
				Submitting...
			{:else}
				<Save size={20} />
				Submit All
			{/if}
		</button>
	</div>
</div>

<!-- Modal -->
<Modal bind:show={showModal}>
	<div class="p-6">
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-xl font-semibold">
				{editIndex >= 0 ? "Edit" : "Add"} Action Plan
			</h3>
			<button onclick={() => (showModal = false)} class="text-muted-foreground hover:text-foreground transition-colors">
				<X size={24} />
			</button>
		</div>

		<div class="space-y-4">
			{#each ["actions_taken", "kpi", "target_output", "key_person_responsible"] as field}
				<div class="space-y-2">
					<label class="block text-sm font-medium">
						{field
							.split("_")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")}
					</label>
					<textarea class="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-ring" value={currentPlan[field]} oninput={(e) => (currentPlan[field] = e.target.value)}></textarea>
				</div>
			{/each}
		</div>

		<div class="mt-6 flex justify-end gap-4">
			<button onclick={() => (showModal = false)} class="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
			<button onclick={savePlan} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
				{editIndex >= 0 ? "Update" : "Add"} Plan
			</button>
		</div>
	</div>
</Modal>
