<script lang="ts">
	import { Trash2, Plus, Save, Loader2, X } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import Alert from "$lib/components/operational-plans/add-action-plans/Alert.svelte";
	import Modal from "$lib/components/operational-plans/add-action-plans/Modal.svelte";
	import type { ActionPlan } from "$lib/types/ActionPlan";

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

	/** On component mount */
	onMount(() => {
		const { params } = $page;
		objective_id = parseInt(params.id);

		if (objective_id) {
			currentPlan.objective_id = objective_id;
			fetchStrategicObjectiveAndGoal(objective_id);
			fetchUserProfileId();
		} else {
			showAlert("Objective ID is missing.", "error");
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
				showAlert("Failed to fetch user profile details.", "error");
				return;
			}

			profile_id = profileData.id;
			currentPlan.profile_id = profile_id;
			currentPlan.department_id = profileData.department_id;
		} else {
			showAlert("User not logged in.", "error");
		}
	};

	/** Fetch strategic objective and goal */
	const fetchStrategicObjectiveAndGoal = async (objective_id: number) => {
		try {
			const { data: objectiveData, error: objectiveError } = await supabase.from("strategic_objectives").select("name, strategic_goal_id").eq("id", objective_id).single();

			if (objectiveError || !objectiveData) {
				showAlert("Failed to fetch strategic objective.", "error");
				return;
			}

			strategicObjective = objectiveData;

			const { data: goalData, error: goalError } = await supabase.from("strategic_goals").select("name, goal_no").eq("id", objectiveData.strategic_goal_id).single();

			if (goalError || !goalData) {
				showAlert("Failed to fetch strategic goal.", "error");
				return;
			}

			strategicGoal = goalData;
		} catch (err) {
			showAlert("An error occurred while fetching strategic data.", "error");
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
		actionPlans = actionPlans.filter((_, i) => i !== index);
	};

	/** Submit action plans */
	const submitActionPlans = async () => {
		if (actionPlans.length === 0) {
			showAlert("Please add at least one action plan.", "warning");
			return;
		}

		try {
			isSubmitting = true;
			const { error } = await supabase.from("action_plans").insert(actionPlans);

			if (error) {
				showAlert("Failed to submit action plans.", "error");
			} else {
				showAlert("Action plans submitted successfully.", "success");
				actionPlans = [];
			}
		} catch (err) {
			showAlert("An error occurred while submitting action plans.", "error");
		} finally {
			isSubmitting = false;
		}
	};

	/** Show alert message */
	const showAlert = (message: string, type: string) => {
		alertMessage = message;
		alertType = type;
		setTimeout(() => {
			alertMessage = "";
		}, 5000);
	};
</script>

<div class="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
	<div class="max-w-7xl mx-auto space-y-6">
		<!-- Header -->
		<div class="bg-white dark:bg-black rounded-lg p-6 shadow-sm">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Action Plans</h1>
			{#if strategicGoal && strategicObjective}
				<div class="mt-4 space-y-2">
					<h5 class="text-md text-gray-700 dark:text-gray-300">
						<span class="font-medium">Strategic Goal:</span>
						<span class="ml-2">{strategicGoal.goal_no} - {strategicGoal.name}</span>
					</h5>
					<h5 class="text-md text-gray-700 dark:text-gray-300">
						<span class="font-medium">Strategic Objective:</span>
						<span class="ml-2">{strategicObjective.name}</span>
					</h5>
				</div>
			{/if}
		</div>

		<!-- Alert Messages -->
		{#if alertMessage}
			<Alert message={alertMessage} type={alertType} />
		{/if}

		<!-- Action Plans List -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Action Plans List</h2>
				<button onclick={() => openModal()} class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
					<Plus class="w-5 h-5 mr-2" />
					Add Plan
				</button>
			</div>

			<div class="space-y-4">
				{#each actionPlans as plan, index}
					<div class="border dark:border-gray-700 rounded-lg p-4 relative hover:bg-gray-50 dark:hover:bg-gray-700">
						<div class="grid md:grid-cols-2 gap-4">
							<div>
								<h4 class="font-medium text-gray-900 dark:text-white">Actions Taken</h4>
								<p class="text-gray-600 dark:text-gray-400 mt-1">{plan.actions_taken}</p>
							</div>
							<div>
								<h4 class="font-medium text-gray-900 dark:text-white">KPI</h4>
								<p class="text-gray-600 dark:text-gray-400 mt-1">{plan.kpi}</p>
							</div>
							<div>
								<h4 class="font-medium text-gray-900 dark:text-white">Target Output</h4>
								<p class="text-gray-600 dark:text-gray-400 mt-1">{plan.target_output}</p>
							</div>
							<div>
								<h4 class="font-medium text-gray-900 dark:text-white">Key Person Responsible</h4>
								<p class="text-gray-600 dark:text-gray-400 mt-1">{plan.key_person_responsible}</p>
							</div>
						</div>
						<div class="absolute top-4 right-4 flex gap-2">
							<button onclick={() => openModal(index)} class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full">
								<Save class="w-5 h-5" />
							</button>
							<button onclick={() => deletePlan(index)} class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
								<Trash2 class="w-5 h-5" />
							</button>
						</div>
					</div>
				{/each}
			</div>

			{#if actionPlans.length === 0}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">No action plans added yet. Click "Add Plan" to create one.</div>
			{/if}
		</div>

		<!-- Submit Button -->
		<div class="flex justify-end">
			<button onclick={submitActionPlans} disabled={isSubmitting} class="inline-flex items-center px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50">
				{#if isSubmitting}
					<Loader2 class="w-5 h-5 mr-2 animate-spin" />
					Submitting...
				{:else}
					<Save class="w-5 h-5 mr-2" />
					Submit All
				{/if}
			</button>
		</div>
	</div>
</div>

<!-- Modal -->
<Modal bind:show={showModal}>
	<div class="p-6 dark:bg-gray-800">
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
				{editIndex >= 0 ? "Edit" : "Add"} Action Plan
			</h3>
			<button onclick={() => (showModal = false)} class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
				<X class="w-6 h-6" />
			</button>
		</div>

		<div class="space-y-4">
			{#each ["actions_taken", "kpi", "target_output", "key_person_responsible"] as field}
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						{field
							.split("_")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")}
					</label>
					<textarea class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" value={currentPlan[field]} oninput={(e) => (currentPlan[field] = e.target.value)}></textarea>
				</div>
			{/each}
		</div>

		<div class="mt-6 flex justify-end gap-4">
			<button onclick={() => (showModal = false)} class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
			<button onclick={savePlan} class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
				{editIndex >= 0 ? "Update" : "Add"} Plan
			</button>
		</div>
	</div>
</Modal>
