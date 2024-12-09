<script lang="ts">
	import { Pencil, Trash2 } from "lucide-svelte";

	/** Props */
	let {
		department,
		isDeleting,
		onEdit,
		onDelete,
	}: {
		department: {
			id: number;
			name: string;
			full_name: string;
		};
		isDeleting: boolean;
		onEdit: () => void;
		onDelete: (id: number) => void;
	} = $props();
</script>

<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
	<div class="space-y-4">
		<h3 class="text-lg font-medium truncate">{department.full_name}</h3>
		<div class="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
			{department.name}
		</div>
		<div class="flex justify-end gap-2 pt-4">
			<button onclick={onEdit} class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit department">
				<Pencil size={18} />
			</button>
			<button onclick={() => onDelete(department.id)} disabled={isDeleting} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete department">
				<Trash2 size={18} />
			</button>
		</div>
	</div>
</div>
