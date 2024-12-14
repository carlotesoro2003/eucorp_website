<script lang="ts">
	type Lead = {
		id: number;
		name: string;
	};

	let { lead,isSaving, onSave  }: { lead: Lead | null; isSaving: boolean; onSave: (lead: { name: string }) => void } = $props();

	// Form state
	let name: string = $state(lead?.name ?? "");

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onSave({ name });
	};
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<h3 class="text-xl font-semibold">{lead ? "Edit" : "Add"} Lead</h3>

	<div class="flex flex-col gap-2">
		<label for="name" class="font-medium">Name</label>
		<input id="name" type="text" bind:value={name} required class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter name" />
	</div>

	<button type="submit"  disabled={isSaving} class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 mt-4 disabled:opacity-50">
		{isSaving ? "Saving..." : lead ? "Update" : "Add"} Lead
	</button>
</form>
