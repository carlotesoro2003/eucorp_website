<script lang="ts">
	import { Trash2, Save } from "lucide-svelte";

	export let data: any;
	export let index: number;
	export let onSave: (data: any) => void = () => {};
	export let onDelete: () => void = () => {};

	const handleSave = () => {
		onSave(data);
	};
</script>

<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
	<div class="flex justify-between items-start mb-4">
		<h3 class="text-lg font-semibold text-gray-700">Plan {index + 1}</h3>
		<div class="flex gap-2">
			<button onclick={handleSave} class="text-green-500 hover:text-green-700 transition-colors p-2">
				<Save class="w-5 h-5" />
			</button>
			<button onclick={onDelete} class="text-red-500 hover:text-red-700 transition-colors p-2">
				<Trash2 class="w-5 h-5" />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Actions Taken</label>
				<textarea bind:value={data.actions_taken} class="w-full border-gray-300 rounded-lg"></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">KPI</label>
				<textarea bind:value={data.kpi} class="w-full border-gray-300 rounded-lg"></textarea>
			</div>
		</div>
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Target Output</label>
				<textarea bind:value={data.target_output} class="w-full border-gray-300 rounded-lg"></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
				<input type="number" bind:value={data.budget} class="w-full border-gray-300 rounded-lg" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Key Person Responsible</label>
				<textarea bind:value={data.key_person_responsible} class="w-full border-gray-300 rounded-lg"></textarea>
			</div>
		</div>
	</div>
</div>
