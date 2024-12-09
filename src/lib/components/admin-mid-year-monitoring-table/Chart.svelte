<script lang="ts">
	import ApexCharts from "apexcharts";
	import { onMount } from "svelte";

	let chartElement: HTMLElement;
	let chart: ApexCharts;

	// Props
	let { type = "line", width = "100%", height = "350", series = [], categories = [], labels = [] } = $props();

	// Chart options
	const options = $derived({
		chart: {
			type,
			foreColor: "#64748b",
			toolbar: {
				show: false,
			},
			animations: {
				enabled: true,
				easing: "easeinout",
				speed: 800,
				dynamicAnimation: {
					enabled: true,
					speed: 350,
				},
			},
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: "60%",
			},
		},
		colors: ["#2563eb", "#16a34a", "#dc2626"],
		grid: {
			borderColor: "#334155",
			strokeDashArray: 4,
			yaxis: {
				lines: {
					show: true,
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: "smooth",
			width: 2,
		},
		xaxis: {
			categories: categories,
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			show: true,
		},
		tooltip: {
			theme: "dark",
		},
		legend: {
			position: "top",
			horizontalAlign: "right",
		},
		labels: labels,
	});

	/** Initialize chart */
	const initChart = () => {
		if (chart) chart.destroy();
		chart = new ApexCharts(chartElement, {
			...options,
			series,
			width,
			height,
		});
		chart.render();
	};

	// Initialize on mount
	onMount(() => {
		initChart();
		return () => {
			if (chart) chart.destroy();
		};
	});

	// Update chart when data changes
	$effect(() => {
		if (chart) {
			chart.updateOptions({
				...options,
				series,
				labels,
			});
		}
	});
</script>

<div bind:this={chartElement}></div>
