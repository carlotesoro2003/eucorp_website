<script lang="ts">
	import { Trash2, Save } from "lucide-svelte";

	export let data: any;
	export let planNumber: number;
	export let onSave: (data: any) => void = () => {};
	export let onEdit: (field: string, value: any) => void = () => {};
	export let onDelete: () => void = () => {};

	let isEdited = false;

	/** Handle input changes */
	const handleInputChange = (field: string, value: any) => {
		isEdited = true; // Mark the card as edited
		onEdit(field, value); // Notify parent about the field update
	};

	/** Save individual plan */
	const handleSave = () => {
		onSave(data);
		isEdited = false; // Reset edit state after saving
	};
</script>

<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
	<div class="flex justify-between items-start mb-4">
		<h3 class="text-lg font-semibold">Plan {planNumber}</h3>
		<div class="flex gap-2">
			{#if isEdited}
				<button onclick={handleSave} class="text-green-500 hover:text-green-700 transition-colors p-2">
					<Save class="w-5 h-5" />
				</button>
			{/if}
			<button onclick={onDelete} class="text-red-500 hover:text-red-700 transition-colors p-2">
				<Trash2 class="w-5 h-5" />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-1">Action Plan</label>
				<textarea
					bind:value={data.actions_taken}
					oninput={(e) => handleInputChange("actions_taken", e.target.value)}
					class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
				></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">KPI</label>
				<textarea
					bind:value={data.kpi}
					oninput={(e) => handleInputChange("kpi", e.target.value)}
					class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
				></textarea>
			</div>
		</div>
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-1">Target Output</label>
				<textarea
					bind:value={data.target_output}
					oninput={(e) => handleInputChange("target_output", e.target.value)}
					class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
				></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Budget</label>
				<input
					type="number"
					bind:value={data.budget}
					oninput={(e) => handleInputChange("budget", +e.target.value)}
					class="w-full px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Key Person Responsible</label>
				<textarea
					bind:value={data.key_person_responsible}
					oninput={(e) => handleInputChange("key_person_responsible", e.target.value)}
					class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
				></textarea>
			</div>
		</div>
	</div>
</div>
