<script lang="ts">
	import { Trash2 } from "lucide-svelte";

	// Props
	let {
		data,
		index,
		onDelete,
	}: {
		data: any;
		index: number;
		onDelete: () => void;
	} = $props();

	// Input adjustment function
	const adjustTextarea = (event: Event) => {
		const target = event.target as HTMLTextAreaElement;
		target.style.height = "auto";
		target.style.height = `${target.scrollHeight}px`;
	};
</script>

<div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
	<div class="flex justify-between items-start mb-4">
		<h3 class="text-lg font-semibold text-gray-700">Opportunity {index + 1}</h3>
		<button onclick={onDelete} class="text-red-500 hover:text-red-700 transition-colors p-2">
			<Trash2 class="w-5 h-5" />
		</button>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Opportunity Statement</label>
				<textarea bind:value={data.opt_statement} placeholder="Describe the opportunity..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" oninput={adjustTextarea}></textarea>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Planned Actions</label>
				<textarea bind:value={data.planned_actions} placeholder="List planned actions..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" oninput={adjustTextarea}></textarea>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">KPI</label>
				<textarea bind:value={data.kpi} placeholder="Key Performance Indicators..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" oninput={adjustTextarea}></textarea>
			</div>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Key Persons</label>
				<textarea bind:value={data.key_persons} placeholder="List key persons involved..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" oninput={adjustTextarea}></textarea>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Target Output</label>
				<textarea bind:value={data.target_output} placeholder="Expected outcomes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" oninput={adjustTextarea}></textarea>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
				<input type="number" bind:value={data.budget} placeholder="Enter budget amount..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
			</div>
		</div>
	</div>
</div>
