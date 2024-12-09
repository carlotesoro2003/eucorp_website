<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { ArrowLeft } from "lucide-svelte";

	interface ObjectiveForm {
		name: string;
		strategic_initiatives: string;
		kpi: string;
		persons_involved: string;
		target: string;
		eval_measures: string;
	}

	// Props
	let { selectedGoal, profile, onBack, onSuccess, onError } = $props<{
		selectedGoal: number;
		profile: any;
		onBack: () => void;
		onSuccess: (message: string) => void;
		onError: (message: string) => void;
	}>();

	// Form data
	let objective: ObjectiveForm = $state({
		name: "",
		strategic_initiatives: "",
		kpi: "",
		persons_involved: "",
		target: "",
		eval_measures: "",
	});

	/** Handle form submission */
	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		try {
			// Validate all fields
			for (const [key, value] of Object.entries(objective)) {
				if (!value.trim()) {
					throw new Error(`Please fill in the ${key.replace("_", " ")} field`);
				}
			}

			const { error } = await supabase.from("strategic_objectives").insert({
				...objective,
				strategic_goal_id: selectedGoal,
				profile_id: profile.id,
			});

			if (error) throw error;

			onSuccess("Strategic Objective added successfully!");
		} catch (error) {
			onError((error as Error).message);
		}
	};
</script>

<form class="space-y-6" onsubmit={handleSubmit}>
	<div class="grid gap-6">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objective Name</label>
			<input type="text" id="name" bind:value={objective.name} class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter objective name" />
		</div>

		<div>
			<label for="strategic_initiatives" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Strategic Initiatives</label>
			<textarea id="strategic_initiatives" bind:value={objective.strategic_initiatives} class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Enter strategic initiatives"></textarea>
		</div>

		<div>
			<label for="kpi" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KPI</label>
			<input type="text" id="kpi" bind:value={objective.kpi} class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter KPI" />
		</div>

		<div>
			<label for="persons_involved" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Persons Involved</label>
			<input type="text" id="persons_involved" bind:value={objective.persons_involved} class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter persons involved" />
		</div>

		<div>
			<label for="target" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target</label>
			<input type="text" id="target" bind:value={objective.target} class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter target" />
		</div>

		<div>
			<label for="eval_measures" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evaluation Measures</label>
			<textarea id="eval_measures" bind:value={objective.eval_measures} class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Enter evaluation measures"></textarea>
		</div>
	</div>

	<div class="flex gap-4">
		<button type="button" onclick={onBack} class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
			<ArrowLeft class="w-5 h-5" />
			Back
		</button>
		<button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Submit Objective</button>
	</div>
</form>
