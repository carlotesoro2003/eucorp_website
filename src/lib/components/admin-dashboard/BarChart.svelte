<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { supabase } from "../../supabaseClient";

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	// Data structure for the chart
	let data = {
		goals: [] as string[],
		achieved: [] as number[],
		notAchieved: [] as number[],
	};

	// Fetch data for the bar chart
	const fetchStrategicData = async () => {
		try {
			console.log("Starting to fetch strategic goals...");

			// Fetch strategic goals, objectives, and action plans
			const { data: result, error } = await supabase
				.from("strategic_goals")
				.select(`
					id,
					goal_no,
					name,
					strategic_objectives (
						id,
						name,
						action_plans (
							id,
							plan_monitoring (
								id,
								is_accomplished
							)
						)
					)
				`);
			if (error) {
				console.error("Error fetching strategic goals:", error);
				return;
			}

			console.log("Raw data fetched:", result);

			// Process data
			const goals = result.map((goal) => {
				console.log(`Processing goal: ${goal.name}`);

				const achievedCount = goal.strategic_objectives
					.flatMap((objective) => {
						return objective.action_plans.flatMap((plan) =>
							plan.plan_monitoring.filter((monitor) => monitor.is_accomplished)
						);
					}).length;

				const notAchievedCount = goal.strategic_objectives
					.flatMap((objective) => {
						return objective.action_plans.flatMap((plan) =>
							plan.plan_monitoring.filter((monitor) => !monitor.is_accomplished)
						);
					}).length;

				console.log(
					`Goal: ${goal.name}, Achieved: ${achievedCount}, Not Achieved: ${notAchievedCount}`
				);

				return {
					goal_no: goal.goal_no,
					name: goal.name,
					achieved: achievedCount,
					notAchieved: notAchievedCount,
				};
			});

			// Populate chart data
			console.log("Processed data for chart:", goals);

			data.goals = goals.map((goal) => `Strategic Goal No. ${goal.goal_no}`);
			data.achieved = goals.map((goal) => goal.achieved);
			data.notAchieved = goals.map((goal) => goal.notAchieved);

			console.log("Final chart data:", data);
		} catch (error) {
			console.error("Error processing strategic data:", error);
		}
	};

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
							barThickness: 100, // Fixed bar thickness
							maxBarThickness: 150,
						},
						{
							label: "Not Achieved",
							data: data.notAchieved,
							backgroundColor: "#e5e7eb",
							borderColor: "#e5e7eb",
							borderWidth: 1,
							barThickness: 100, // Fixed bar thickness
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
							ticks: {
								callback: (value) => `${value}`,
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
		const initialize = async () => {
			console.log("Initializing chart...");
			await fetchStrategicData(); // Fetch data for the chart
			createChart(); // Create the chart with the fetched data
		};

		initialize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (chart) chart.destroy();
		};
	});
</script>

<div class="relative h-[400px] w-full bg-card">
	<canvas bind:this={canvas}></canvas>
</div>
