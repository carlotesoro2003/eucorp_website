<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { Loader2 } from "lucide-svelte";

	/** Risk monitoring interface */
	interface RiskMonitoring {
		id: number;
		rrn: string;
		risk_statement: string;
		likelihood_rating: string | null;
		severity: string | null;
		control_rating: string | null;
		monitoring_rating: string | null;
		is_achieved: boolean;
	}

	/** State variables */
	let risksMonitoring: RiskMonitoring[] = $state([]);
	let isLoading: boolean = $state(true);
	let errorMessage: string | null = $state(null);

	/** Fetch risk monitoring data */
	const fetchRiskMonitoring = async () => {
		try {
			const { data, error } = await supabase.from("risk_monitoring").select(`
                id,
                risks (
                    rrn,
                    risk_statement
                ),
                likelihood_rating:likelihood_rating_id(name),
                severity:severity_id(name),
                control_rating:control_rating_id(name),
                monitoring_rating:monitoring_rating_id(status),
                is_achieved
            `);

			if (error) throw error;

			risksMonitoring = data.map((item: any) => ({
				id: item.id,
				rrn: item.risks.rrn,
				risk_statement: item.risks.risk_statement,
				likelihood_rating: item.likelihood_rating?.name || "Not Available",
				severity: item.severity?.name || "Not Available",
				control_rating: item.control_rating?.name || "Not Available",
				monitoring_rating: item.monitoring_rating?.status || "Not Available",
				is_achieved: item.is_achieved,
			}));
		} catch (error) {
			console.error("Error fetching risk monitoring data:", error);
			errorMessage = "Failed to fetch risk monitoring data.";
		} finally {
			isLoading = false;
		}
	};

	/** Fetch data when component mounts */
	fetchRiskMonitoring();
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
	{#if isLoading}
		<div class="flex items-center justify-center p-8">
			<Loader2 class="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
			<span class="ml-2 text-gray-600 dark:text-gray-400">Loading risks...</span>
		</div>
	{:else if errorMessage}
		<div class="p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
			{errorMessage}
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">RRN</th>
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Statement</th>
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Likelihood Rating</th>
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Control Rating</th>
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monitoring Rating</th>
						<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each risksMonitoring as risk}
						<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
							<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{risk.rrn}</td>
							<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{risk.risk_statement}</td>
							<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{risk.likelihood_rating}</td>
							<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{risk.severity}</td>
							<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{risk.control_rating}</td>
							<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{risk.monitoring_rating}</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {risk.is_achieved ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}">
									{risk.is_achieved ? "Achieved" : "Still mitigating"}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
