<script lang="ts">
	import { Pencil, Trash2, User } from "lucide-svelte";

	type Lead = {
		id: number;
		name: string;
	};

	let {
		lead,
		onDelete,
		onEdit,
	}: {
		lead: Lead;
		onDelete: (id: number) => void;
		onEdit: (lead: Lead) => void;
	} = $props();
</script>

<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
	<div class="flex items-start justify-between">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
				<User size={20} />
			</div>
			<div>
				<h3 class="text-lg font-medium break-words">{lead.name}</h3>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button onclick={() => onEdit(lead)} class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit">
				<Pencil size={16} />
			</button>
			<button onclick={() => onDelete(lead.id)} class="p-1.5 hover:bg-muted rounded-lg text-red-400" title="Delete">
				<Trash2 size={16} />
			</button>
		</div>
	</div>
</div>
