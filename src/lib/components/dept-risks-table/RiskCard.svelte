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

<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
	<div class="space-y-4">
		<!-- Header section -->
		<div class="flex justify-between items-start">
			<div>
				<h3 class="text-lg font-medium truncate">{risk.rrn}</h3>
			</div>
			<div class="flex items-center gap-2">
				<a href={`/risks/riskAssessment?riskId=${risk.id}`} class="inline-flex items-center gap-1 p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50 {!risk.id ? 'pointer-events-none opacity-50' : ''}" title="View Risk Assessment">
					<span class="text-sm">Risk Assessment</span>
					<ArrowUpRight size={18} />
				</a>
				<button onclick={() => removeRow(index)} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg" title="Delete risk">
					<Trash2 size={18} />
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Left column -->
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">Risk Statement</label>
					<textarea bind:value={risk.risk_statement} placeholder="Enter risk statement..." class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Actions</label>
					<textarea bind:value={risk.actions} placeholder="Enter actions..." class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
			</div>

			<!-- Right column -->
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">Classification</label>
					<select bind:value={risk.classification} class="w-full px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
						<option value={null}>Select classification</option>
						{#each classification as cls}
							<option value={cls.id}>{cls.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Key Persons</label>
					<textarea bind:value={risk.key_persons} placeholder="Enter key persons..." class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Budget</label>
					<input type="number" bind:value={risk.budget} placeholder="Enter budget..." class="w-full px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
			</div>
		</div>
	</div>
</div>
