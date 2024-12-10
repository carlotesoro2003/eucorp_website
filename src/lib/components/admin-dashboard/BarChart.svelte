<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	// Updated data structure for strategic goals
	let {
		data,
	}: {
		data: {
			goals: string[];
			achieved: number[];
			notAchieved: number[];
		};
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	// Create and update chart
	const createChart = () => {
		const ctx = canvas.getContext("2d");
		if (ctx) {
			// Destroy existing chart if it exists
			if (chart) chart.destroy();

			chart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: data.goals,
					datasets: [
						{
							label: "Achieved",
							data: data.achieved,
							backgroundColor: "#e21d48",
							borderColor: "#e21d48",
							borderWidth: 1,
							barThickness: 100, // Added fixed bar thickness
							maxBarThickness: 150,
						},
						{
							label: "Not Achieved",
							data: data.notAchieved,
							backgroundColor: "#e5e7eb",
							borderColor: "#e5e7eb",
							borderWidth: 1,
							barThickness: 100, // Added fixed bar thickness
							maxBarThickness: 150,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: "bottom",
						},
					},
					scales: {
						x: {
							stacked: true,
							ticks: {
								autoSkip: false,
								
							},
						},
						y: {
							stacked: true,
							beginAtZero: true,
							max: 100,
							ticks: {
								callback: (value) => `${value}%`,
							},
						},
					},
				},
			});
		}
	};

	// Handle resize for responsiveness
	let resizeTimer: ReturnType<typeof setTimeout>;
	const handleResize = () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			createChart();
		}, 250);
	};

	onMount(() => {
		createChart();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (chart) chart.destroy();
		};
	});
</script>

<div class="relative h-[400px] w-full">
	<canvas bind:this={canvas}></canvas>
</div>
