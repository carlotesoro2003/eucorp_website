<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { ChevronDown } from "lucide-svelte";

	let { data }: { data: { categories: string[]; datasets: Record<string, number[]> } } = $props();
	let canvas: HTMLCanvasElement;
	let selectedCategory: string = $state("manpower");

	$effect(() => {
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				new Chart(ctx, {
					type: "doughnut",
					data: {
						labels: ["Low Risk", "Medium Risk", "High Risk"],
						datasets: [
							{
								data: data.datasets[selectedCategory],
								backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(234, 179, 8, 0.8)", "rgba(239, 68, 68, 0.8)"],
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
			}
		}
	});
</script>

<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 ">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-800">Risk Analysis</h2>
		<div class="relative">
			<select bind:value={selectedCategory} class="appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus:border-blue-500 focus:outline-none">
				{#each data.categories as category}
					<option value={category.toLowerCase()}>{category}</option>
				{/each}
			</select>
			<ChevronDown class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
		</div>
	</div>
	<div class="h-[300px]">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>
