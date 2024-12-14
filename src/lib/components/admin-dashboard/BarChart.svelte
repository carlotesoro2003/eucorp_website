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

	// Pagination variables
	let currentPage = 0;
	let barsPerPage = 9; // Default bars per page

	// Paginated data
	let paginatedData = {
		goals: [] as string[],
		achieved: [] as number[],
		notAchieved: [] as number[],
	};

	// Update bars per page based on screen size
	const updateBarsPerPage = () => {
		const screenWidth = window.innerWidth;
		barsPerPage = screenWidth < 640 ? 2 : 9; // Show 2 bars on small screens, 9 on larger screens
		updatePaginatedData();
	};

	// Fetch data for the bar chart
	const fetchStrategicData = async () => {
		try {
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

			// Sort the goals by goal_no in ascending order
			const sortedGoals = result.sort((a, b) => a.goal_no - b.goal_no);

			// Process data
			const goals = sortedGoals.map((goal) => {
				const achievedCount = goal.strategic_objectives
					.flatMap((objective) => objective.action_plans.flatMap((plan) =>
						plan.plan_monitoring.filter((monitor) => monitor.is_accomplished)
					)).length;

				const notAchievedCount = goal.strategic_objectives
					.flatMap((objective) => objective.action_plans.flatMap((plan) =>
						plan.plan_monitoring.filter((monitor) => !monitor.is_accomplished)
					)).length;

				return {
					goal_no: goal.goal_no,
					name: goal.name,
					achieved: achievedCount,
					notAchieved: notAchievedCount,
				};
			});

			// Populate chart data
			data.goals = goals.map((goal) => `Strategic Goal No. ${goal.goal_no}`);
			data.achieved = goals.map((goal) => goal.achieved);
			data.notAchieved = goals.map((goal) => goal.notAchieved);

			// Initialize paginated data
			updateBarsPerPage(); // Update the number of bars per page dynamically

		} catch (error) {
			console.error("Error processing strategic data:", error);
		}
	};

	// Update paginated data based on current page
	const updatePaginatedData = () => {
		const start = currentPage * barsPerPage;
		const end = start + barsPerPage;

		paginatedData.goals = data.goals.slice(start, end);
		paginatedData.achieved = data.achieved.slice(start, end);
		paginatedData.notAchieved = data.notAchieved.slice(start, end);

		createChart();
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
					labels: paginatedData.goals,
					datasets: [
						{
							label: "Achieved",
							data: paginatedData.achieved,
							backgroundColor: "#e21d48",
							borderColor: "#e21d48",
							borderWidth: 1,
						},
						{
							label: "Not Achieved",
							data: paginatedData.notAchieved,
							backgroundColor: "#e5e7eb",
							borderColor: "#e5e7eb",
							borderWidth: 1,
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
						},
					},
				},
			});
		}
	};

	// Handle pagination
	const goToNextPage = () => {
		if ((currentPage + 1) * barsPerPage < data.goals.length) {
			currentPage++;
			updatePaginatedData();
		}
	};

	const goToPreviousPage = () => {
		if (currentPage > 0) {
			currentPage--;
			updatePaginatedData();
		}
	};

	// Handle resize for responsiveness
	let resizeTimer: ReturnType<typeof setTimeout>;
	const handleResize = () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			updateBarsPerPage(); // Update bars per page on resize
		}, 250);
	};

	onMount(() => {
		const initialize = async () => {
			await fetchStrategicData(); // Fetch data for the chart
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

<!-- Pagination Controls -->
<div class="flex justify-center mt-4 space-x-4">
	<button 
		class="flex items-center gap-2 bg-secondary text-foreground hover:bg-gray-200 px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial"
		on:click={goToPreviousPage}
		disabled={currentPage === 0}
	>
		Previous
	</button>
	<button 
		class="flex items-center gap-2 bg-secondary text-foreground hover:bg-gray-200 px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial"
		on:click={goToNextPage}
		disabled={(currentPage + 1) * barsPerPage >= data.goals.length}
	>
		Next
	</button>
</div>
