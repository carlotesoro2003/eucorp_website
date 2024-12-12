<script lang="ts">
	import { Trash2, Save } from "lucide-svelte";

	export let plan: any;
	export let index: number;
	export let onEdit: () => void;
	export let onDelete: () => void;
</script>

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
		<button onclick={onEdit} class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
			<Save size={18} />
		</button>
		<button onclick={onDelete} class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
			<Trash2 size={18} />
		</button>
	</div>
</div>
