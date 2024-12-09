<script lang="ts">
	import { Calendar, Target } from "lucide-svelte";
	import Chart from "$lib/components/admin-mid-year-monitoring-table/Chart.svelte";
	import { supabase } from "$lib/supabaseClient";

	type Plan = {
		id: string;
		title: string;
		department: string;
		status: string;
		target_date: string;
		progress: number;
	};

	let plans: Plan[] = $state([]);
	let loading: boolean = $state(true);
	let totalPlans: number = $derived(plans.length);
	let completedPlans: number = $derived(plans.filter((plan) => plan.status === "completed").length);
	let ongoingPlans: number = $derived(plans.filter((plan) => plan.status === "ongoing").length);
	let delayedPlans: number = $derived(plans.filter((plan) => plan.status === "delayed").length);

	/** Fetch plans data */
	const fetchPlans = async () => {
		try {
			const { data, error } = await supabase.from("plans").select("*");

			if (error) throw error;
			plans = data || [];
		} catch (error) {
			console.error("Error fetching plans:", error);
		} finally {
			loading = false;
		}
	};

	// Chart data
	const chartData = $derived({
		series: [
			{
				name: "Plans Progress",
				data: plans.map((plan) => plan.progress),
			},
		],
		categories: plans.map((plan) => plan.title.substring(0, 20) + "..."),
	});

	// Initialize
	fetchPlans();
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">Total Plans</h3>
		<p class="text-3xl font-bold">{totalPlans}</p>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">Completed</h3>
		<p class="text-3xl font-bold text-green-500">{completedPlans}</p>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">Ongoing</h3>
		<p class="text-3xl font-bold text-blue-500">{ongoingPlans}</p>
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-2">Delayed</h3>
		<p class="text-3xl font-bold text-red-500">{delayedPlans}</p>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-4">Plans Progress Overview</h3>
		<Chart type="bar" width="100%" height="300" series={chartData.series} categories={chartData.categories} />
	</div>

	<div class="bg-card p-4 rounded-lg shadow border border-border">
		<h3 class="text-lg font-semibold mb-4">Recent Plans</h3>
		{#if loading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each plans.slice(0, 5) as plan}
					<div class="flex items-start gap-4 p-3 bg-secondary/50 rounded-lg">
						<div class="p-2 bg-primary/20 rounded-lg">
							{#if plan.status === "completed"}
								<Target class="text-primary" size={24} />
							{:else}
								<Calendar class="text-primary" size={24} />
							{/if}
						</div>
						<div class="flex-1">
							<h4 class="font-medium">{plan.title}</h4>
							<p class="text-sm text-muted-foreground">{plan.department}</p>
							<div class="mt-2">
								<div class="w-full bg-secondary rounded-full h-2">
									<div class="bg-primary h-2 rounded-full" style="width: {plan.progress}%"></div>
								</div>
							</div>
						</div>
						<span class="px-2 py-1 rounded-full text-sm {plan.status === 'completed' ? 'bg-green-500/20 text-green-500' : plan.status === 'ongoing' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}">
							{plan.status}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
