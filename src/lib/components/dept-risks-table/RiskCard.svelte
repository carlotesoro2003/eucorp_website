<script lang="ts">
	import { ArrowRight, Trash2 } from "lucide-svelte";

	interface Risk {
		id?: string;
		rrn: string;
		risk_statement: string;
		classification: number | null;
		actions: string;
		key_persons: string;
		budget: number;
	}

	interface Classification {
		id: number;
		name: string;
	}

	let {
		risk,
		classification,
		onRemove,
	}: {
		risk: Risk;
		classification: Classification[];
		onRemove: () => void;
	} = $props();
</script>

<div class="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
	<div class="flex justify-between items-start mb-4">
		<div>
			<span class="text-xs font-medium text-gray-500">Reference Number</span>
			<h3 class="text-lg font-semibold text-gray-800">{risk.rrn}</h3>
		</div>
		<div class="flex items-center gap-3">
			<button onclick={onRemove} class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Remove Risk">
				<Trash2 class="w-5 h-5" />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Risk Statement</label>
				<textarea bind:value={risk.risk_statement} class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" placeholder="Describe the risk..." />
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Classification</label>
				<select bind:value={risk.classification} class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
					<option value={null}>Select classification</option>
					{#each classification as cls}
						<option value={cls.id}>{cls.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Actions</label>
				<textarea bind:value={risk.actions} class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" placeholder="List the actions to be taken..." />
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Key Persons</label>
					<input type="text" bind:value={risk.key_persons} class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Responsible persons..." />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
					<input type="number" bind:value={risk.budget} class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
				</div>
			</div>
		</div>
	</div>

	{#if risk.id}
		<div class="mt-4 flex justify-end">
			<a href={`/risks/riskAssessment?riskId=${risk.id}`} class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
				Go to Risk Assessment
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	{/if}
</div>
