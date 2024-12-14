<script lang="ts">
	import { Search } from "lucide-svelte";
	import type { Risk, Classification, RiskAssessment } from "$lib/types/RiskTypes";

	let {
		savedRisks,
		classification,
		riskAssessments,
		isSaving,
		onAssess,
	}: {
		savedRisks: Risk[];
		classification: Classification[];
		riskAssessments: RiskAssessment[];
		isSaving: boolean;
		onAssess: (risk: Risk) => void;
	} = $props();

	// Search and filter
	let searchTerm: string = $state("");

	// Create derived states for filtered risks and assessment status
	let filteredRisks = $derived(savedRisks.filter((risk) => risk.rrn.toLowerCase().includes(searchTerm.toLowerCase()) || risk.risk_statement.toLowerCase().includes(searchTerm.toLowerCase())));

	// Create a derived state to check if a risk is assessed
	let isRiskAssessed = (riskId: string) => {
		const assessedRiskIds = new Set(riskAssessments.map((ra) => ra.risk_id));
		return assessedRiskIds.has(riskId);
	};
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- Search Section -->
	<div class="flex flex-col md:flex-row gap-4 mb-2 items-center justify-between">
		<div class="flex flex-col md:flex-row gap-4 flex-1">
			<div class="relative flex-1 w-full md:max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchTerm} placeholder="Search risks..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
		</div>
	</div>

	<!-- Table Section -->
	<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
		<table class="min-w-full table-auto">
			<thead class="bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left">RRN</th>
					<th class="px-4 py-3 text-left">Risk Statement</th>
					<th class="px-4 py-3 text-left">Classification</th>
					<th class="px-4 py-3 text-left">Actions</th>
					<th class="px-4 py-3 text-left">Key Persons</th>
					<th class="px-4 py-3 text-left">Budget</th>
					<th class="px-4 py-3 text-center">Assessment</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#each filteredRisks as risk (risk.id)}
					<tr class="hover:bg-muted/50">
						<td class="px-4 py-3 font-medium">{risk.rrn}</td>
						<td class="px-4 py-3">{risk.risk_statement}</td>
						<td class="px-4 py-3">
							{classification.find((cls) => cls.id === risk.classification)?.name || "N/A"}
						</td>
						<td class="px-4 py-3">{risk.actions}</td>
						<td class="px-4 py-3">{risk.key_persons}</td>
						<td class="px-4 py-3">P{risk.budget}</td>
						<td class="px-4 py-3">
							<div class="flex justify-center">
								{#if risk.id && isRiskAssessed(risk.id)}
									<button disabled class="flex items-center gap-2 bg-success text-success-foreground px-3 py-1 rounded-lg opacity-50 cursor-not-allowed">Assessed</button>
								{:else}
									<button onclick={() => onAssess(risk)} disabled={isSaving} class="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
										{#if isSaving}
											<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
										{/if}
										Assess
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
