<script lang="ts">
	import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-svelte";
	import Chart from "$lib/components/admin-mid-year-monitoring-table/Chart.svelte";
	import { supabase } from "$lib/supabaseClient";

	type Risk = {
		id: string;
		title: string;
		department: string;
		severity: "high" | "medium" | "low";
		status: string;
		mitigation_progress: number;
	};

	let risks: Risk[] = $state([]);
	let loading: boolean = $state(true);
	let totalRisks: number = $derived(risks.length);
	let highRisks: number = $derived(risks.filter((risk) => risk.severity === "high").length);
	let mitigatedRisks: number = $derived(risks.filter((risk) => risk.mitigation_progress === 100).length);

	/** Fetch risks data */
	const fetchRisks = async () => {
		try {
			const { data, error } = await supabase.from("risks").select("*");

			if (error) throw error;
			risks = data || [];
		} catch (error) {
			console.error("Error fetching risks:", error);
		} finally {
			loading = false;
		}
	};

	// Chart data for risk severity distribution
	const severityChartData = $derived({
		series: [risks.filter((risk) => risk.severity === "high").length, risks.filter((risk) => risk.severity === "medium").length, risks.filter((risk) => risk.severity === "low").length],
		labels: ["High", "Medium", "Low"],
	});

	// Initialize
	fetchRisks();
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold">Total Risks</h3>
			<AlertTriangle class="text-yellow-500" size={24} />
		</div>
		<p class="text-3xl font-bold mt-2">{totalRisks}</p>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold">High Priority</h3>
			<TrendingUp class="text-red-500" size={24} />
		</div>
		<p class="text-3xl font-bold mt-2">{highRisks}</p>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold">Mitigated</h3>
			<TrendingDown class="text-green-500" size={24} />
		</div>
		<p class="text-3xl font-bold mt-2">{mitigatedRisks}</p>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-4">Risk Severity Distribution</h3>
		<Chart type="donut" width="100%" height="300" series={severityChartData.series} labels={severityChartData.labels} />
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-4">High Priority Risks</h3>
		{#if loading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each risks.filter((risk) => risk.severity === "high").slice(0, 5) as risk}
					<div class="p-4 bg-secondary/50 rounded-lg">
						<div class="flex items-center justify-between mb-2">
							<h4 class="font-medium">{risk.title}</h4>
							<span class="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-sm">High Priority</span>
						</div>
						<p class="text-sm text-muted-foreground mb-2">{risk.department}</p>
						<div class="flex items-center gap-2">
							<div class="flex-1 bg-secondary rounded-full h-2">
								<div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: {risk.mitigation_progress}%"></div>
							</div>
							<span class="text-sm text-muted-foreground">
								{risk.mitigation_progress}%
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
