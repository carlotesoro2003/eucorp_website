<script lang="ts">
	import { ArrowDown, ArrowUp } from "lucide-svelte";
	import Chart from "$lib/components/admin-mid-year-monitoring-table/Chart.svelte";
	import { supabase } from "$lib/supabaseClient";

	type Opportunity = {
		id: string;
		title: string;
		department: string;
		status: string;
		progress: number;
		created_at: string;
	};

	let opportunities: Opportunity[] = $state([]);
	let loading: boolean = $state(true);
	let totalOpportunities: number = $derived(opportunities.length);
	let completedOpportunities: number = $derived(opportunities.filter((opp) => opp.status === "completed").length);
	let inProgressOpportunities: number = $derived(opportunities.filter((opp) => opp.status === "in_progress").length);

	/** Fetch opportunities data */
	const fetchOpportunities = async () => {
		try {
			const { data, error } = await supabase.from("opportunities").select("*");

			if (error) throw error;
			opportunities = data || [];
		} catch (error) {
			console.error("Error fetching opportunities:", error);
		} finally {
			loading = false;
		}
	};

	// Chart data
	const chartData = $derived({
		series: [completedOpportunities, inProgressOpportunities],
		labels: ["Completed", "In Progress"],
	});

	// Initialize
	fetchOpportunities();
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">Total Opportunities</h3>
		<p class="text-3xl font-bold">{totalOpportunities}</p>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">Completed</h3>
		<div class="flex items-center">
			<p class="text-3xl font-bold">{completedOpportunities}</p>
			<ArrowUp class="ml-2 text-green-500" size={24} />
		</div>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">In Progress</h3>
		<div class="flex items-center">
			<p class="text-3xl font-bold">{inProgressOpportunities}</p>
			<ArrowDown class="ml-2 text-yellow-500" size={24} />
		</div>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-4">Opportunities Status Distribution</h3>
		<Chart type="pie" width="100%" height="300" series={chartData.series} labels={chartData.labels} />
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-4">Recent Opportunities</h3>
		{#if loading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr>
							<th class="text-left p-2">Title</th>
							<th class="text-left p-2">Department</th>
							<th class="text-left p-2">Status</th>
							<th class="text-left p-2">Progress</th>
						</tr>
					</thead>
					<tbody>
						{#each opportunities.slice(0, 5) as opportunity}
							<tr class="border-t border-border">
								<td class="p-2">{opportunity.title}</td>
								<td class="p-2">{opportunity.department}</td>
								<td class="p-2">
									<span class="px-2 py-1 rounded-full text-sm {opportunity.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}">
										{opportunity.status}
									</span>
								</td>
								<td class="p-2">
									<div class="w-full bg-secondary rounded-full h-2">
										<div class="bg-primary h-2 rounded-full" style="width: {opportunity.progress}%"></div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
