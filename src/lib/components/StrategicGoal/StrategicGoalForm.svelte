<script lang="ts">
	import { X } from "lucide-svelte";
    import { fade } from "svelte/transition";
	/** Props */
	let {
		goal,
		leads,
		isSaving,
		onSave,
		onClose,
	}: {
		goal: any;
		leads: Array<{ id: number; name: string }>;
		isSaving: boolean;
		onSave: (data: any) => void;
		onClose: () => void;
	} = $props();

	/** Form state */
	let name: string = $state(goal?.name || "");
	let description: string = $state(goal?.description || "");
	let kpi: string = $state(goal?.kpi || "");
	let lead_id: number | null = $state(goal?.lead_id || null);

	/** Handle form submit */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onSave({ name, description, kpi, lead_id });
	};
</script>

<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
	<div class="bg-card p-6 rounded-lg shadow-lg w-full max-w-md relative border border-border">
		<button onclick={onClose} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg" title="Close">
			<X size={20} />
		</button>

		<h2 class="text-xl font-semibold mb-4">{goal ? "Edit" : "Create"} Strategic Goal</h2>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<label for="name" class="text-sm font-medium">Name</label>
				<textarea id="name" bind:value={name} placeholder="Enter goal name" class="w-full px-3 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
			</div>

			<div class="space-y-2">
				<label for="description" class="text-sm font-medium">Description</label>
				<textarea id="description" bind:value={description} placeholder="Enter description" class="w-full px-3 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
			</div>

			<div class="space-y-2">
				<label for="kpi" class="text-sm font-medium">KPI</label>
				<textarea id="kpi" bind:value={kpi} placeholder="Enter KPI" class="w-full px-3 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
			</div>

			<div class="space-y-2">
				<label for="lead_id" class="text-sm font-medium">Lead</label>
				<select id="lead_id" bind:value={lead_id} class="w-full px-3 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
					<option value={null}>Select a lead</option>
					{#each leads as lead}
						<option value={lead.id}>{lead.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-2 pt-4">
				<button type="submit" disabled={isSaving} class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
					{isSaving ? "Saving..." : goal ? "Update" : "Create"} Goal
				</button>
				<button type="button" onclick={onClose} class="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">Cancel</button>
			</div>
		</form>
	</div>
</div>
