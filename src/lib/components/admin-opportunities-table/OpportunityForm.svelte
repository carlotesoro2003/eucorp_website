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

	/** Form data state */
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

	/** Handle form submission */
	const handleSubmit = (e: Event) => {
		e.preventDefault();
		onSave(formData);
	};

	/** Auto resize textarea based on content */
	const autoResize = (e: Event) => {
		const textarea = e.target as HTMLTextAreaElement;
		// Reset height to get the correct scrollHeight
		textarea.style.height = "auto";
		// Set new height based on scrollHeight
		textarea.style.height = textarea.scrollHeight + "px";
	};
</script>

<form onsubmit={handleSubmit} class="h-full max-h-screen flex flex-col gap-4 p-4">
	<h3 class="text-lg font-semibold">Edit Opportunity</h3>

	<!-- Scrollable form content -->
	<div class="flex-1 overflow-y-auto pr-2">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Left column for larger text inputs -->
			<div class="space-y-4">
				<div class="space-y-2">
					<label for="opt_statement">Statement</label>
					<textarea id="opt_statement" bind:value={formData.opt_statement} oninput={autoResize} class="w-full p-2 border rounded-lg bg-background min-h-[100px] overflow-hidden"></textarea>
				</div>

				<div class="space-y-2">
					<label for="planned_actions">Planned Actions</label>
					<textarea id="planned_actions" bind:value={formData.planned_actions} oninput={autoResize} class="w-full p-2 border rounded-lg bg-background min-h-[100px] overflow-hidden"></textarea>
				</div>
			</div>

			<!-- Right column for shorter inputs -->
			<div class="space-y-4">
				<div class="space-y-2">
					<label for="kpi">KPI</label>
					<textarea id="kpi" bind:value={formData.kpi} oninput={autoResize} class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden"></textarea>
				</div>

				<div class="space-y-2">
					<label for="key_persons">Key Persons</label>
					<textarea id="key_persons" bind:value={formData.key_persons} oninput={autoResize} class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden"></textarea>
				</div>

				<div class="space-y-2">
					<label for="target_output">Target Output</label>
					<textarea id="target_output" bind:value={formData.target_output} oninput={autoResize} class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden"></textarea>
				</div>

				<div class="space-y-2">
					<label for="budget">Budget</label>
					<input type="number" id="budget" bind:value={formData.budget} class="w-full p-2 border rounded-lg bg-background" min="0" step="0.01" />
				</div>
			</div>
		</div>
	</div>

	<!-- Fixed footer with action buttons -->
	<div class="sticky bottom-0 flex justify-end gap-2 pt-4 border-t bg-background">
		<button type="submit" disabled={saving} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
			{saving ? "Saving..." : "Save Changes"}
		</button>
	</div>
</form>
