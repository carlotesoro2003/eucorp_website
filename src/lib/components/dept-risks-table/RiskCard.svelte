<script lang="ts">
	import { Trash2, ArrowUpRight } from "lucide-svelte";

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

	// Component props
	let { risk, classification, index, removeRow }: { risk: Risk; classification: Classification[]; index: number; removeRow: (index: number) => void } = $props();
</script>

<div class="bg-white rounded-xl shadow-lg p-6">
	<div class="flex justify-between items-start mb-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-800">{risk.rrn}</h3>
		</div>
		<div class="flex items-center gap-4">
			<a href={`/risks/riskAssessment?riskId=${risk.id}`} class="{!risk.id ? 'pointer-events-none opacity-50' : ''} inline-flex items-center text-blue-600 hover:text-blue-700 gap-1">
				<span class="text-sm">Risk Assessment</span>
				<ArrowUpRight class="w-4 h-4" />
			</a>
			<button onclick={() => removeRow(index)} class="text-red-500 hover:text-red-600">
				<Trash2 class="w-5 h-5" />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Left column -->
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Risk Statement</label>
				<textarea bind:value={risk.risk_statement} placeholder="Enter risk statement..." class="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Actions</label>
				<textarea bind:value={risk.actions} placeholder="Enter actions..." class="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"></textarea>
			</div>
		</div>

		<!-- Right column -->
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Classification</label>
				<select bind:value={risk.classification} class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500">
					<option value={null}>Select classification</option>
					{#each classification as cls}
						<option value={cls.id}>{cls.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Key Persons</label>
				<textarea bind:value={risk.key_persons} placeholder="Enter key persons..." class="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
				<input type="number" bind:value={risk.budget} placeholder="Enter budget..." class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500" />
			</div>
		</div>
	</div>
</div>
