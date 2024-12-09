<script lang="ts">
	type Opportunity = {
		id: number;
		opt_statement: string;
		planned_actions: string;
		kpi: string;
		key_persons: string;
		target_output: string;
		budget: number;
	};

	let {
		opportunity,
		onSave,
		saving,
	}: {
		opportunity: Opportunity | null;
		onSave: (formData: Partial<Opportunity>) => void;
		saving: boolean;
	} = $props();

	let formData = opportunity
		? { ...opportunity }
		: {
				opt_statement: "",
				planned_actions: "",
				kpi: "",
				key_persons: "",
				target_output: "",
				budget: 0,
			};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		onSave(formData);
	};
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<h3 class="text-lg font-semibold mb-4">Edit Opportunity</h3>

	<div class="space-y-2">
		<label for="opt_statement">Statement</label>
		<textarea id="opt_statement" bind:value={formData.opt_statement} class="w-full p-2 border rounded-lg bg-background" rows="3"></textarea>
	</div>

	<div class="space-y-2">
		<label for="planned_actions">Planned Actions</label>
		<textarea id="planned_actions" bind:value={formData.planned_actions} class="w-full p-2 border rounded-lg bg-background" rows="3"></textarea>
	</div>

	<div class="space-y-2">
		<label for="kpi">KPI</label>
		<input type="text" id="kpi" bind:value={formData.kpi} class="w-full p-2 border rounded-lg bg-background" />
	</div>

	<div class="space-y-2">
		<label for="key_persons">Key Persons</label>
		<input type="text" id="key_persons" bind:value={formData.key_persons} class="w-full p-2 border rounded-lg bg-background" />
	</div>

	<div class="space-y-2">
		<label for="target_output">Target Output</label>
		<input type="text" id="target_output" bind:value={formData.target_output} class="w-full p-2 border rounded-lg bg-background" />
	</div>

	<div class="space-y-2">
		<label for="budget">Budget</label>
		<input type="number" id="budget" bind:value={formData.budget} class="w-full p-2 border rounded-lg bg-background" min="0" step="0.01" />
	</div>

	<div class="flex justify-end gap-2 mt-6">
		<button type="submit" disabled={saving} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
			{saving ? "Saving..." : "Save Changes"}
		</button>
	</div>
</form>
