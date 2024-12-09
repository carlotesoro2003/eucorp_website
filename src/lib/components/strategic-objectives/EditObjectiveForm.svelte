<script lang="ts">
	/** Types */
	interface StrategicObjective {
		id: number;
		name: string;
		strategic_initiatives: string;
		kpi: string;
		persons_involved: string;
		target: string;
		eval_measures: string;
		strategic_goal_id: number;
		profile_id: string;
	}

	/** Props */
	let {
		objective,
		onSave,
		onCancel,
		isSaving,
	}: {
		objective: StrategicObjective;
		onSave: (data: Partial<StrategicObjective>) => void;
		onCancel: () => void;
		isSaving: boolean;
	} = $props();

	/** Form data */
	let formData: Partial<StrategicObjective> = $state({
		name: objective.name,
		strategic_initiatives: objective.strategic_initiatives,
		kpi: objective.kpi,
		persons_involved: objective.persons_involved,
		target: objective.target,
		eval_measures: objective.eval_measures,
	});

	/** Handle form submit */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onSave(formData);
	};
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<h3 class="text-lg font-semibold">Edit Strategic Objective</h3>

	<div>
		<label for="name" class="block text-sm font-medium mb-1">Strategic Objective</label>
		<textarea id="name" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.name} required rows="3" />
	</div>

	<div>
		<label for="strategic_initiatives" class="block text-sm font-medium mb-1">Strategic Initiatives</label>
		<textarea id="strategic_initiatives" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.strategic_initiatives} required rows="3" />
	</div>

	<div>
		<label for="kpi" class="block text-sm font-medium mb-1">KPI</label>
		<textarea id="kpi" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.kpi} required rows="3" />
	</div>

	<div>
		<label for="persons_involved" class="block text-sm font-medium mb-1">Persons Involved</label>
		<textarea id="persons_involved" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.persons_involved} required rows="3" />
	</div>

	<div>
		<label for="target" class="block text-sm font-medium mb-1">Target</label>
		<textarea id="target" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.target} required rows="3" />
	</div>

	<div>
		<label for="eval_measures" class="block text-sm font-medium mb-1">Evaluation Measures</label>
		<textarea id="eval_measures" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.eval_measures} required rows="3" />
	</div>

	<div class="flex justify-end gap-2 pt-4">
		<button type="button" onclick={onCancel} class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">Cancel</button>
		<button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50" disabled={isSaving}>
			{isSaving ? "Saving..." : "Save"}
		</button>
	</div>
</form>
