<script lang="ts">
	import { Pencil, Trash2 } from "lucide-svelte";

	// Types
	interface Classification {
		id: number | null;
		name: string;
	}

	// Props
	let {
		classification,
		onEdit,
		onDelete,
	}: {
		classification: Classification;
		onEdit: (classification: Classification) => void;
		onDelete: (id: number) => Promise<void>;
	} = $props();

	// State
	let isDeleting: boolean = $state(false);

	/** Handle delete */
	const handleDelete = async () => {
		if (classification.id === null) return;
		isDeleting = true;
		await onDelete(classification.id);
		isDeleting = false;
	};
</script>

<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
	<div class="flex justify-between items-start gap-4">
		<h3 class="text-lg font-medium break-words flex-1">{classification.name}</h3>
		<div class="flex gap-2 shrink-0">
			<button onclick={() => onEdit(classification)} class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit">
				<Pencil size={18} />
			</button>
			<button class= "hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete" onclick={handleDelete} disabled={isDeleting}>
				<Trash2 size={18} />
			</button>
		</div>
	</div>
</div>
