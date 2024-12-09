<script lang="ts">
	/** Props */
	let {
		department = null,
		isSaving,
		onSave,
	}: {
		department: { id: number; name: string; full_name: string } | null;
		isSaving: boolean;
		onSave: (department: { id: number | null; name: string; full_name: string }) => void;
	} = $props();

	// Form state
	let name: string = $state(department?.name ?? "");
	let fullName: string = $state(department?.full_name ?? "");

	/** Handle form submit */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onSave({
			id: department?.id ?? null,
			name,
			full_name: fullName,
		});
	};
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<h3 class="text-lg font-semibold">{department ? "Edit" : "Add"} Department</h3>

	<div class="space-y-2">
		<label for="fullName" class="text-sm font-medium">Full Name</label>
		<input id="fullName" type="text" bind:value={fullName} required class="w-full px-3 py-2 rounded-lg bg-secondary border-secondary focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter full name..." />
	</div>

	<div class="space-y-2">
		<label for="name" class="text-sm font-medium">Short Name</label>
		<input id="name" type="text" bind:value={name} required class="w-full px-3 py-2 rounded-lg bg-secondary border-secondary focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter short name..." />
	</div>

	<button type="submit" disabled={isSaving} class="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50">
		{isSaving ? "Saving..." : department ? "Update" : "Add"} Department
	</button>
</form>
