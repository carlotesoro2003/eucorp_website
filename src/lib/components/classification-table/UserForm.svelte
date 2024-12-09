<script lang="ts">
	import { X } from "lucide-svelte";

	// Types
	interface Classification {
		id: number | null;
		name: string;
	}

	// Props
	let {
		isEditing = false,
		classification,
		onClose,
		onSubmit,
	}: {
		isEditing: boolean;
		classification: Classification;
		onClose: () => void;
		onSubmit: (classification: Classification) => Promise<boolean>;
	} = $props();

	// State
	let isSaving: boolean = $state(false);
	let currentClassification: Classification = $state({ ...classification });

	/** Handle form submission */
	const handleSubmit = async () => {
		isSaving = true;
		const success = await onSubmit(currentClassification);
		if (!success) {
			isSaving = false;
		}
	};
</script>

<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
	<div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border">
		<button onclick={onClose} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">
			<X size={20} />
		</button>

		<h2 class="text-xl font-bold mb-4">
			{isEditing ? "Edit Classification" : "Add Classification"}
		</h2>

		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label for="name">Classification Name</label>
				<input id="name" type="text" bind:value={currentClassification.name} class="px-3 py-2 bg-secondary border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter classification name" />
			</div>

			<div class="flex justify-end gap-2 mt-4">
				<button onclick={onClose} class="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
				<button onclick={handleSubmit} disabled={isSaving || !currentClassification.name} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
					{isSaving ? "Saving..." : "Save"}
				</button>
			</div>
		</div>
	</div>
</div>
