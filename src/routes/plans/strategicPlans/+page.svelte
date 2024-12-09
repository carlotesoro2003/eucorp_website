<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { Plus, Target, AlertCircle, CheckCircle2 } from "lucide-svelte";
	import ObjectiveForm from "$lib/components/strategic-objectives/ObjectiveForm.svelte";

	interface StrategicGoal {
		id: number;
		name: string;
	}

	// State variables
	let session: any = null;
	let profile: any = null;
	let strategicGoals: StrategicGoal[] = [];
	let selectedGoal: number | null = null;
	let loading: boolean = true;
	let currentStep: number = 0;

	// Alert states
	let successMessage: string | null = null;
	let errorMessage: string | null = null;

	/** Fetch user profile data */
	const fetchUserProfile = async () => {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;

			session = sessionData.session;
			if (session) {
				const { user } = session;
				const { data, error } = await supabase.from("profiles").select("id").eq("id", user.id).single();
				if (error) throw error;
				profile = data;
			}
		} catch (error) {
			errorMessage = `Error fetching profile: ${(error as Error).message}`;
		} finally {
			loading = false;
		}
	};

	/** Fetch strategic goals */
	const fetchStrategicGoals = async () => {
		try {
			const { data, error } = await supabase.from("strategic_goals").select("id, name");
			if (error) throw error;

			strategicGoals = data || [];
		} catch (error) {
			errorMessage = "Failed to fetch strategic goals.";
		}
	};

	/** Handle goal selection */
	const handleGoalSelection = () => {
		if (selectedGoal) {
			currentStep = 1;
		} else {
			errorMessage = "Please select a strategic goal first.";
		}
	};

	/** Handle back step */
	const handleBack = () => {
		currentStep = 0;
	};

	/** Clear messages after 5 seconds */
	$: {
		if (successMessage || errorMessage) {
			const timer = setTimeout(() => {
				successMessage = null;
				errorMessage = null;
			}, 5000);
			const clearMessages = () => clearTimeout(timer);
			clearMessages();
		}
	}

	onMount(() => {
		fetchUserProfile();
		fetchStrategicGoals();
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
	<div class="max-w-4xl mx-auto space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Strategic Objectives</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">Define and manage your strategic objectives</p>
			</div>
			<Target class="w-8 h-8 text-blue-500" />
		</div>

		<!-- Steps -->
		<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
			<div class="flex items-center justify-between mb-8">
				<div class="flex-1">
					<div class="relative">
						<div class="h-2 bg-gray-200 rounded">
							<div
								class="h-2 bg-blue-500 rounded transition-all duration-300"
								style="width: {currentStep === 1 ? '100%' : '0%'}"
							></div>
						</div>
						<div class="flex justify-between absolute -top-3 w-full">
							<span class="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white text-sm">1</span>
							<span
								class="w-8 h-8 flex items-center justify-center rounded-full text-sm"
								class:bg-blue-500={currentStep === 1}
								class:text-white={currentStep === 1}
								class:bg-gray-200={currentStep === 0}
								class:text-gray-600={currentStep === 0}
							>2</span>
						</div>
					</div>
					<div class="flex justify-between mt-4">
						<span class="text-sm font-medium text-gray-600">Select Goal</span>
						<span class="text-sm font-medium text-gray-600">Add Objectives</span>
					</div>
				</div>
			</div>

			<!-- Alerts -->
			{#if successMessage}
				<div class="flex items-center gap-2 p-4 bg-green-100 text-green-700 rounded-lg mb-4">
					<CheckCircle2 class="w-5 h-5" />
					<span>{successMessage}</span>
				</div>
			{/if}
			{#if errorMessage}
				<div class="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-lg mb-4">
					<AlertCircle class="w-5 h-5" />
					<span>{errorMessage}</span>
				</div>
			{/if}

			{#if currentStep === 0}
				<!-- Strategic Goal Selector -->
				<div class="space-y-4">
					<label for="strategic_goal" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Strategic Goal</label>
					<select
						id="strategic_goal"
						bind:value={selectedGoal}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>Select a goal</option>
						{#each strategicGoals as goal}
							<option value={goal.id}>{goal.name}</option>
						{/each}
					</select>
					<button
						onclick={handleGoalSelection}
						class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Plus class="w-5 h-5" />
						Continue to Add Objectives
					</button>
				</div>
			{:else}
				<ObjectiveForm
					{selectedGoal}
					{profile}
					onBack={handleBack}
					onSuccess={(message) => {
						successMessage = message;
						currentStep = 0;
						selectedGoal = null;
					}}
					onError={(message) => (errorMessage = message)}
				/>
			{/if}
		</div>
	</div>
</div>
