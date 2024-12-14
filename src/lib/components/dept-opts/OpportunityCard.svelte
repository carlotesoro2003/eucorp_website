<script lang="ts">
	import { Save, Trash2 } from "lucide-svelte";

	/** Props with their types before runes */
	let {
		data,
		index,
		onSave = () => {},
		onDelete = () => {},
	}: {
		data: {
			opt_statement: string;
			planned_actions: string;
			kpi: string;
			budget: number;
		};
		index: number;
		onSave: (data: any) => void;
		onDelete: () => void;
	} = $props();

	/** Handle save button click */
	const handleSave = () => {
		onSave(data);
	};
</script>

<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
	<div class="space-y-4">
		<!-- Header section -->
		<div class="flex justify-between items-start">
			<h3 class="text-lg font-medium truncate">Opportunity {index + 1}</h3>
			<div class="flex gap-2">
				<button onclick={handleSave} class="text-green-500 hover:text-green-700 transition-colors p-2">
					<Save size={18} />
				</button>
				<button onclick={onDelete} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg" title="Delete opportunity">
					<Trash2 size={18} />
				</button>
			</div>
		</div>

		<!-- Form fields -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-1">Opportunity Statement</label>
					<textarea bind:value={data.opt_statement} class="w-full rounded-lg bg-background border border-border p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-1">Planned Actions</label>
					<textarea bind:value={data.planned_actions} class="w-full rounded-lg bg-background border border-border p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
			</div>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-1">KPI</label>
					<textarea bind:value={data.kpi} class="w-full rounded-lg bg-background border border-border p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium text-muted-foreground mb-1">Budget</label>
					<input type="number" bind:value={data.budget} class="w-full rounded-lg bg-background border border-border p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
			</div>
		</div>
	</div>
</div>
