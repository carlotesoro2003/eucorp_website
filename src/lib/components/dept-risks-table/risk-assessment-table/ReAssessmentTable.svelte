<script lang="ts">
	import { Search } from "lucide-svelte";
	import type { Risk, Classification, RiskAssessment } from "$lib/types/RiskTypes";

	let {
		savedRisks,
		classification,
		riskAssessments,
		onAssess,
	}: {
		savedRisks: Risk[];
		classification: Classification[];
		riskAssessments: RiskAssessment[];
		onAssess: (risk: Risk) => void;
	} = $props();

	// Search and filter
	let searchTerm: string = $state("");
	let filteredRisks = $derived(
		savedRisks.filter(
			(risk) =>
				risk.rrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
				risk.risk_statement.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	// Function to log the current assessment for the selected risk
	const logRiskAssessment = (risk: Risk) => {
		const currentAssessment = riskAssessments.find(
			(assessment) => assessment.risk_id === risk.id
		);

		console.log("Selected Risk for Re-Assessment:", risk);
		if (currentAssessment) {
			console.log("Current Assessment:", currentAssessment);
		} else {
			console.log("No assessment found for this risk.");
		}
	};
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
	<div class="p-4 border-b dark:border-gray-700">
		<div class="flex items-center gap-2">
			<div class="relative flex-1">
				<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Search risks..."
					class="pl-10 w-full h-10 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full text-sm text-left">
			<thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
				<tr>
					<th class="px-6 py-3">RRN</th>
					<th class="px-6 py-3">Risk Statement</th>
					<th class="px-6 py-3">Classification</th>
					<th class="px-6 py-3">Actions</th>
					<th class="px-6 py-3">Key Persons</th>
					<th class="px-6 py-3">Budget</th>
					<th class="px-6 py-3">Assessment</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRisks as risk}
					<tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
						<td class="px-6 py-4 font-medium">{risk.rrn}</td>
						<td class="px-6 py-4">{risk.risk_statement}</td>
						<td class="px-6 py-4">
							{classification.find((cls) => cls.id === risk.classification)?.name || "N/A"}
						</td>
						<td class="px-6 py-4">{risk.actions}</td>
						<td class="px-6 py-4">{risk.key_persons}</td>
						<td class="px-6 py-4">${risk.budget}</td>
						<td class="px-6 py-4">
							<button
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								onclick={() => {
									logRiskAssessment(risk);
									onAssess(risk);
								}}
							>
								Risk Re-Assessment
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
