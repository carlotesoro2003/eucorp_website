<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	// Props using new svelte 5 syntax
	let { chartData }: { chartData: { achieved: number; notAchieved: number } } = $props();

	// Chart instance and canvas element
	let chart: Chart | null = $state(null);
	let canvas: HTMLCanvasElement = $state();

	// Create chart function
	const createChart = () => {
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Destroy existing chart
		if (chart) chart.destroy();

		chart = new Chart(ctx, {
			type: "doughnut",
			data: {
				labels: ["Achieved", "Not Achieved"],
				datasets: [
					{
						data: [chartData.achieved, chartData.notAchieved],
						backgroundColor: [
							"rgb(34, 197, 94)", // green-600
							"rgb(239, 68, 68)", // red-600
						],
						borderWidth: 1,
						borderColor: "#fff",
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "bottom",
						labels: {
							color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
							padding: 10,
							font: {
								size: 12,
							},
						},
					},
				},
			},
		});
	};
	
	// Update chart when data changes
	$effect(() => {
		if (chart && chartData) {
			chart.data.datasets[0].data = [chartData.achieved, chartData.notAchieved];
			chart.update();
		}
	});

	// Initialize chart when component mounts
	onMount(() => {
		createChart();
		return () => {
			if (chart) chart.destroy();
		};
	});
</script>

<!-- Added min-height to ensure canvas has space to render -->
<div class="h-[200px] min-h-[200px] w-full">
	<canvas bind:this={canvas}></canvas>
</div>