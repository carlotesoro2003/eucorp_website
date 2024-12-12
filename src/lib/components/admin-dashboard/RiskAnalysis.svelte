<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { supabase } from "$lib/supabaseClient";
	import { ChevronDown } from "lucide-svelte";

	// State variables
	let classifications: string[] = [];
	let selectedCategory: string = "";
	let riskData: Record<string, { low: number; medium: number; high: number; very_high: number }> = {};
	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;
	let isLoading = true;

	// Fetch risk data
	const fetchRiskData = async () => {
		try {
			// Fetch classifications
			const { data: classificationData, error: classificationError } = await supabase
				.from("classification")
				.select("name");
			if (classificationError) throw classificationError;

			// Populate classifications and initialize riskData
			classifications = classificationData.map((classification) => classification.name);
			riskData = classifications.reduce((acc, classification) => {
				acc[classification] = { low: 0, medium: 0, high: 0, very_high: 0 };
				return acc;
			}, {});

			// Fetch risk monitoring data
			const { data: riskMonitoringData, error: riskMonitoringError } = await supabase
				.from("risk_monitoring")
				.select(`
					control_rating_id ( name ),
					risks ( classification ( name ) )
				`);
			if (riskMonitoringError) throw riskMonitoringError;

			// Populate riskData counts
			riskMonitoringData.forEach((item) => {
				const classification = item.risks?.classification?.name || "Unknown";
				const controlRating = item.control_rating_id?.name.toLowerCase();
				if (riskData[classification] && controlRating) {
					if (riskData[classification][controlRating] !== undefined) {
						riskData[classification][controlRating]++;
					}
				}
			});

			// Set default selected category
			if (classifications.length > 0) {
				selectedCategory = classifications[0];
			}
		} catch (error) {
			console.error("Error fetching risk data:", error);
		} finally {
			isLoading = false;
			createChart();
		}
	};

	// Create or update the chart
	const createChart = () => {
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Destroy existing chart if any
		if (chart) {
			chart.destroy();
		}

		const data = riskData[selectedCategory] || { low: 0, medium: 0, high: 0, very_high: 0 };
		chart = new Chart(ctx, {
			type: "doughnut",
			data: {
				labels: ["Low Risk", "Medium Risk", "High Risk", "Very High Risk"],
				datasets: [
					{
						data: [data.low, data.medium, data.high, data.very_high],
						backgroundColor: ["#34C759", "#FFCC00", "#FF9500", "#FF3B30"], // Green, Yellow, Orange, Red
						borderWidth: 2,
						borderColor: "#ffffff",
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				cutout: "65%",
				plugins: {
					legend: {
						position: "bottom",
						labels: {
							padding: 20,
							usePointStyle: true,
						},
					},
				},
			},
		});
	};

	// Fetch data on mount
	onMount(() => {
		fetchRiskData();
	});
</script>

<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300">
	<h2 class="mb-6 text-xl font-semibold text-gray-800">Risk Analysis</h2>
	{#if isLoading}
	  <div class="text-center">
		<span class="loading loading-spinner text-primary"></span>
		<p>Loading risk data...</p>
	  </div>
	{:else}
	  <!-- Header and Dropdown aligned -->
	  <div class="flex justify-between items-center mb-6">
		<p class="text-gray-800 font-medium">Classification:</p>
		<div class="relative w-full sm:w-1/3 lg:w-1/4">
		  <select
			bind:value={selectedCategory}
			on:change={createChart}
			class="appearance-none w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus:border-blue-500 focus:outline-none"
		  >
			{#each classifications as classification}
			  <option value={classification}>{classification}</option>
			{/each}
		  </select>
		  <ChevronDown class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
		</div>
	  </div>
  
	  <!-- Chart -->
	  <div class="h-[300px]">
		<canvas bind:this={canvas}></canvas>
	  </div>
	{/if}
  </div>
  