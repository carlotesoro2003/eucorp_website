<script lang="ts">
	// Props
	let {
		type,
		item,
		onSave,
		onCancel,
	}: {
		type: string;
		item: any;
		onSave: (formData: any) => void;
		onCancel: () => void;
	} = $props();

	// Form data state
	let formData: any = $state(
		item
			? { ...item }
			: {
					...(type === "likelihoodRating" || type === "riskControlRating" ? { name: "", symbol: "" } : type === "severity" ? { name: "", value: 0 } : { status: "" }),
				}
	);

	/** Handle form submit */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onSave(formData);
	};
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<h2 class="text-xl font-semibold mb-4">
		{item ? "Edit" : "Add New"}
		{type}
	</h2>

	{#if type === "likelihoodRating" || type === "riskControlRating"}
		<div class="space-y-2">
			<label class="block text-sm font-medium">Name</label>
			<input type="text" bind:value={formData.name} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required />
		</div>
		<div class="space-y-2">
			<label class="block text-sm font-medium">Symbol</label>
			<input type="text" bind:value={formData.symbol} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required />
		</div>
	{:else if type === "severity"}
		<div class="space-y-2">
			<label class="block text-sm font-medium">Name</label>
			<input type="text" bind:value={formData.name} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required />
		</div>
		<div class="space-y-2">
			<label class="block text-sm font-medium">Value</label>
			<input type="number" bind:value={formData.value} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required />
		</div>
	{:else}
		<div class="space-y-2">
			<label class="block text-sm font-medium">Status</label>
			<input type="text" bind:value={formData.status} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required />
		</div>
	{/if}

	<div class="flex justify-end gap-2 pt-4">
		<button type="button" onclick={onCancel} class="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
		<button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
			{item ? "Update" : "Create"}
		</button>
	</div>
</form>
