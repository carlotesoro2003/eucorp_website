<script lang="ts">
	import DashboardCards from "$lib/components/admin-dashboard/DashboardCards.svelte";
	import BarChart from "$lib/components/admin-dashboard/BarChart.svelte";
	import RiskAnalysis from "$lib/components/admin-dashboard/RiskAnalysis.svelte";
	import RecentEvents from "$lib/components/admin-dashboard/RecentEvents.svelte";
	import Header from "$lib/components/admin-dashboard/Header.svelte";
	import { dashboardData } from "$lib/components/admin-dashboard/data";
</script>



<main class=" min-h-screen  p-4 md:p-6 container mx-auto ">
	<div class="mx-auto max-w-7xl space-y-8">
		<Header />

		<!-- Dashboard Cards -->
		<DashboardCards data={dashboardData.cards} />

		<!-- Bar Graph Section -->
		<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 ">
			<h2 class="mb-6 text-xl font-semibold">Strategic Goal Overiew</h2>
			<BarChart data={dashboardData.barChart} />
		</div>

		<!-- Risk Analysis and Recent Events Grid -->
		<div class="grid gap-8 lg:grid-cols-2">
			<RiskAnalysis data={dashboardData.riskData} />
			<RecentEvents events={dashboardData.recentEvents} />
		</div>
	</div>
</main>
