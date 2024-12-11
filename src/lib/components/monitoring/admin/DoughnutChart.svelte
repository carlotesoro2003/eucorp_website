<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	// Props
	let { chartData }: { chartData: { achieved: number; notAchieved: number } } = $props();

	// Chart instance
	let chart: Chart | null = null;
	let canvas: HTMLCanvasElement;

	// Create chart
	const createChart = () => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

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
						},
					},
				},
			},
		});
	};

	// Update chart when data changes
	$effect(() => {
		if (chart) {
			chart.data.datasets[0].data = [chartData.achieved, chartData.notAchieved];
			chart.update();
		}
	});

	onMount(() => {
		createChart();
		return () => {
			if (chart) chart.destroy();
		};
	});
</script>

<div class="h-[200px]">
	<canvas bind:this={canvas}></canvas>
</div>
