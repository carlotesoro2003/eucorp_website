<script lang="ts">
	import { Save } from "lucide-svelte";
	import { Trash2 } from "lucide-svelte";

	export let data: {
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
	};
	export let onSave: (data: any) => void = () => {};
	export let onEdit: (field: string, value: any) => void = () => {};
	export let onDelete: () => void = () => {};
	export let opportunityNumber: number;

	let isEdited = false;

	/** Handle input change */
	const handleInputChange = (field: string, value: any) => {
		isEdited = true;
		onEdit(field, value); // Notify parent of the field change
	};

	/** Save the individual opportunity */
	const handleSave = () => {
		onSave(data);
		isEdited = false; // Reset edit state after saving
	};
</script>

<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
	<div class="space-y-4">
		<!-- Header -->
		<div class="flex justify-between items-center">
			<h3 class="text-lg font-medium truncate">Opportunity {opportunityNumber}</h3>
			<div class="flex gap-2">
				{#if isEdited}
				<button onclick={handleSave} class="text-green-500 hover:text-green-700 transition-colors p-2" title="Save edits">
					<Save class="w-5 h-5"/>
				</button>
				{/if}
				<button onclick={onDelete} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg" title="Delete opportunity">
					<Trash2 size={18} />
				</button>
			</div>
		</div>

		<!-- Form fields -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-muted-foreground mb-1">Opportunity Statement</label>
				<textarea
					bind:value={data.opt_statement}
					oninput={(e) => handleInputChange("opt_statement", e.target.value)}
					class="w-full rounded-lg bg-background border border-border p-2 focus:ring-2 focus:ring-primary/50"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-muted-foreground mb-1">Planned Actions</label>
				<textarea
					bind:value={data.planned_actions}
					oninput={(e) => handleInputChange("planned_actions", e.target.value)}
					class="w-full rounded-lg bg-background border border-border p-2 focus:ring-2 focus:ring-primary/50"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-muted-foreground mb-1">KPI</label>
				<textarea
					bind:value={data.kpi}
					oninput={(e) => handleInputChange("kpi", e.target.value)}
					class="w-full rounded-lg bg-background border border-border p-2 focus:ring-2 focus:ring-primary/50"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-muted-foreground mb-1">Key Persons</label>
				<textarea
					bind:value={data.key_persons}
					oninput={(e) => handleInputChange("key_persons", e.target.value)}
					class="w-full rounded-lg bg-background border border-border p-2 focus:ring-2 focus:ring-primary/50"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-muted-foreground mb-1">Target Output</label>
				<textarea
					bind:value={data.target_output}
					oninput={(e) => handleInputChange("target_output", e.target.value)}
					class="w-full rounded-lg bg-background border border-border p-2 focus:ring-2 focus:ring-primary/50"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-muted-foreground mb-1">Budget</label>
				<input
					type="number"
					bind:value={data.budget}
					oninput={(e) => handleInputChange("budget", +e.target.value)}
					class="w-full rounded-lg bg-background border border-border p-2 focus:ring-2 focus:ring-primary/50"
				/>
			</div>
		</div>
	</div>
</div>
