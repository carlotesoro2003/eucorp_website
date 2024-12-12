<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { FileText, Loader2, Download, ChevronDown, ChevronLeft, ChevronRight, Building2, Target, Search, NotepadText } from "lucide-svelte";
	import DoughnutChart from "$lib/components/monitoring/admin/DoughnutChart.svelte";
	import { fade } from "svelte/transition";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";

	/** Types */
	interface PlanMonitoring {
		id: number;
		action_plan_id: number;
		evaluation: string;
		statement: string;
		is_accomplished: boolean;
		time_completed: string | null;
		actions_taken: string;
		kpi: string;
		department: string;
		goal: string;
		objective: string; 
		goal_no: number; 
	}

	/** State variables */
	let plans: PlanMonitoring[] = $state([]);
	let filteredPlans: PlanMonitoring[] = $state([]);
	let filterStatus: "all" | "achieved" | "not_achieved" = $state("all");
	let selectedDepartment: string = $state("all");
	let isLoading: boolean = $state(true);
	let isGeneratingSummary: boolean = $state(false);
	let searchQuery: string = $state("");
	let showStatusDropdown: boolean = $state(false);
	let showDepartmentDropdown: boolean = $state(false);
	let showAlert: boolean = $state(false);
	let alertMessage: string = $state("");
	let alertType: "success" | "error" = $state("success");

	/** Pagination state */
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let totalPages = $derived(Math.ceil(filteredPlans.length / itemsPerPage));
	let paginatedPlans = $derived(filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	/** Chart data */
	const chartData = $derived({
		achieved: filteredPlans.filter((p) => p.is_accomplished).length,
		notAchieved: filteredPlans.filter((p) => !p.is_accomplished).length,
	});

	/** Departments list */
	let departments: string[] = $state([]);

	/**Strategic Goals List**/
	let selectedStrategicGoal: string = $state("all");
	let showStrategicGoalDropdown: boolean = $state(false);
	let strategicGoals: string[] = $state([]);

	//Strategic Objectives List
	let selectedStrategicObjective: string = $state("all");
	let showStrategicObjectiveDropdown: boolean = $state(false);
	let strategicObjectives: string[] = $state([]);

	/** Status options for dropdown */
	const statusOptions = [
		{ value: "all", label: "All Status" },
		{ value: "achieved", label: "Achieved" },
		{ value: "not_achieved", label: "Not Achieved" },
	];

	/** Get status label */
	const getStatusLabel = (value: string) => {
		return statusOptions.find((opt) => opt.value === value)?.label || "All Status";
	};

	/** Display alert message */
	const displayAlert = (message: string, type: "success" | "error") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	/** Fetch plans from database */
		const fetchPlanMonitoring = async () => {
		isLoading = true;
		try {
			const { data, error } = await supabase.from("plan_monitoring").select(`
				id,
				action_plan_id,
				evaluation,
				statement,
				is_accomplished,
				time_completed,
				department_id,
				action_plans (
					actions_taken,
					kpi,
					objective_id,
					strategic_objectives (
						name,
						strategic_goal_id,
						strategic_goals (name, goal_no)
					)
				)
			`);

			if (error) throw error;

			// Fetch departments and map department_id to department name
			const { data: departmentsData, error: departmentsError } = await supabase.from("departments").select("id, name");
			if (departmentsError) throw departmentsError;

			const departmentMap = Object.fromEntries(departmentsData.map((dept: { id: number; name: string }) => [dept.id, dept.name]));

			plans = data.map((plan: any) => ({
				id: plan.id,
				action_plan_id: plan.action_plan_id,
				evaluation: plan.evaluation,
				statement: plan.statement,
				is_accomplished: plan.is_accomplished,
				time_completed: plan.time_completed,
				department: departmentMap[plan.department_id] || "Unassigned",
				actions_taken: plan.action_plans?.actions_taken || "No Actions Taken",
				kpi: plan.action_plans?.kpi || "No KPI",
				objective: plan.action_plans?.strategic_objectives?.name || "No Objective",
				goal: plan.action_plans?.strategic_objectives?.strategic_goals?.name || "No Goal",
				goal_no: plan.action_plans?.strategic_objectives?.strategic_goals?.goal_no || 0,
			}));

			applyFilter();
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			isLoading = false;
		}
	};

	/** Fetch departments from database */
	const fetchDepartments = async () => {
		try {
			const { data, error } = await supabase.from("departments").select("name");
			if (error) throw error;

			departments = ["All Departments", ...data.map((dept: { name: string }) => dept.name)];
		} catch (error) {
			displayAlert("Error fetching departments", "error");
		}
	};
	
	//Fetch Strategic Goals
		const fetchStrategicGoals = async () => {
		try {
			const { data, error } = await supabase.from("strategic_goals").select("name, goal_no");
			if (error) throw error;

			strategicGoals = ["All Goals", ...data.map((goal: { name: string, goal_no: number }) => goal.name)];
		} catch (error) {
			console.error("Error fetching strategic goals:", error);
		}
	};

	//Fetch Strategic Objectives
	const fetchStrategicObjectives = async () => {
		try {
			const { data, error } = await supabase.from("strategic_objectives").select("name");
			if (error) throw error;

			strategicObjectives = ["All Objectives", ...data.map((objective: { name: string }) => objective.name)];
		} catch (error) {
			console.error("Error fetching strategic objectives:", error);
		}
	};

	/** Filter plans based on status, department and search query */
	const applyFilter = () => {
    let filtered = plans;

    if (filterStatus === "achieved") {
        filtered = filtered.filter((p) => p.is_accomplished);
    } else if (filterStatus === "not_achieved") {
        filtered = filtered.filter((p) => !p.is_accomplished);
    }

    if (selectedDepartment !== "all") {
        filtered = filtered.filter((p) => p.department === selectedDepartment);
    }

    if (selectedStrategicGoal !== "all") {
        filtered = filtered.filter((p) => p.goal === selectedStrategicGoal);
    }

    if (selectedStrategicObjective !== "all") {
        filtered = filtered.filter((p) => p.objective === selectedStrategicObjective);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((p) => p.statement?.toLowerCase().includes(query) || p.actions_taken?.toLowerCase().includes(query) || p.kpi?.toLowerCase().includes(query) || p.department?.toLowerCase().includes(query));
    }

    filteredPlans = filtered;
    currentPage = 1;
	};

	/** Export to PDF with visualization */
	const exportToPDF = () => {
		const doc = new jsPDF("landscape");
		const title = "Plan Monitoring Report";
		try {
			doc.setFontSize(16);
			doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", doc.internal.pageSize.width / 2, 15, { align: "center" });
			doc.setFontSize(12);
			doc.text("Plan Monitoring Report", doc.internal.pageSize.width / 2, 22, { align: "center" });
			doc.text("SY 2024-2025", doc.internal.pageSize.width / 2, 28, { align: "center" });

			doc.setFontSize(11);
			const totalPlans = filteredPlans.length;
			const achievedPlans = chartData.achieved;
			const notAchievedPlans = chartData.notAchieved;
			const achievementRate = ((achievedPlans / totalPlans) * 100).toFixed(1);

			doc.text([`Total Plans: ${totalPlans}`, `Achieved: ${achievedPlans}`, `Not Achieved: ${notAchievedPlans}`, `Achievement Rate: ${achievementRate}%`], 14, 40);

			const columns = ["Department", "Actions Taken", "KPI", "Evaluation", "Statement", "Status", "Time Completed"];
			const rows = filteredPlans.map((plan) => [plan.department, plan.actions_taken, plan.kpi, plan.evaluation || "Pending", plan.statement || "Pending", plan.is_accomplished ? "Achieved" : "Not Achieved", plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A"]);

			autoTable(doc, {
				head: [columns],
				body: rows,
				startY: 60,
				theme: "grid",
				styles: { fontSize: 8 },
				headStyles: { fillColor: [41, 128, 185] },
			});

			doc.save("PlanMonitoring.pdf");
			displayAlert("PDF exported successfully", "success");
		} catch (error) {
			displayAlert("Error exporting PDF", "error");
		}
	};

	/** Generate summary report */
	const generateSummaryPDF = async () => {
		isGeneratingSummary = true;

		try {
			const response = await fetch("/api/summary-report-plan-monitoring", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plans: filteredPlans }),
			});

			const data = await response.json();

			if (!response.ok || data.error) {
				throw new Error(data.error || "Failed to generate summary.");
			}

			const doc = new jsPDF();
			doc.setFont("times", "normal");
			doc.setFontSize(12);
			doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
			doc.setFontSize(10);
			doc.text("SY 2024-2025", 14, 20);
			doc.setFontSize(14);
			doc.text("Summary Report", 14, 15);

			const summaryLines = doc.splitTextToSize(data.summaryReport, 180);
			doc.setFontSize(12);
			doc.text(summaryLines, 14, 35);

			doc.save("PlanMonitoringSummary.pdf");
			displayAlert("Summary report generated successfully", "success");
		} catch (error) {
			displayAlert("Error generating summary report", "error");
		} finally {
			isGeneratingSummary = false;
		}
	};

	/** Pagination handlers */
	const nextPage = () => {
		if (currentPage < totalPages) currentPage++;
	};

	const prevPage = () => {
		if (currentPage > 1) currentPage--;
	};

	/** Fetch data when component mounts */	
	fetchPlanMonitoring();
	fetchDepartments();
	fetchStrategicGoals();
	fetchStrategicObjectives();

	/** Watch for filter changes */
	$effect(() => {
		applyFilter();
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div transition:fade class="flex items-center p-4 rounded-lg {alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<NotepadText class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Plans Monitoring</h1>
		</div>
	</div>

	<!-- Stats and Chart -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<!-- Total Plans -->
		<div class="bg-card rounded-lg shadow border border-border p-4">
			<h3 class="text-sm font-medium text-muted-foreground">Total Plans</h3>
			<p class="text-2xl font-semibold mt-2">{filteredPlans.length}</p>
		</div>

		<!-- Achieved -->
		<div class="bg-card rounded-lg shadow border border-border p-4">
			<h3 class="text-sm font-medium text-muted-foreground">Achieved</h3>
			<p class="text-2xl font-semibold text-green-600 mt-2">{chartData.achieved}</p>
		</div>

		<!-- Not Achieved -->
		<div class="bg-card rounded-lg shadow border border-border p-4">
			<h3 class="text-sm font-medium text-muted-foreground">Not Achieved</h3>
			<p class="text-2xl font-semibold text-red-600 mt-2">{chartData.notAchieved}</p>
		</div>

		<!-- Doughnut Chart -->
		<div class="bg-card rounded-lg shadow border border-border p-4">
			<DoughnutChart {chartData} />
		</div>
	</div>

	<div class="flex flex-col md:flex-row gap-4 mb-2 items-center justify-between">
		<div class="flex flex-col md:flex-row gap-4 flex-1">
			<div class="relative flex-1 w-full md:max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>

			<!-- Status Dropdown -->
			<div class="relative">
				<button class="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2" onclick={() => (showStatusDropdown = !showStatusDropdown)}>
					{getStatusLabel(filterStatus)}
					<ChevronDown class="w-4 h-4" />
				</button>

				{#if showStatusDropdown}
					<div class="absolute top-full left-0 mt-1 w-48 rounded-lg bg-popover shadow-lg border border-border z-10">
						{#each statusOptions as option}
							<button
								class="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg {filterStatus === option.value ? 'bg-muted/50' : ''}"
								onclick={() => {
									filterStatus = option.value as "all" | "achieved" | "not_achieved";
									showStatusDropdown = false;
									applyFilter();
								}}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Department Dropdown -->
			<div class="relative">
				<button class="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2" onclick={() => (showDepartmentDropdown = !showDepartmentDropdown)}>
					<Building2 class="w-4 h-4" />
					{selectedDepartment === "all" ? "All Departments" : selectedDepartment}
					<ChevronDown class="w-4 h-4" />
				</button>

				{#if showDepartmentDropdown}
					<div class="absolute top-full left-0 mt-1 w-56 rounded-lg bg-popover shadow-lg border border-border z-10">
						{#each departments as dept}
							<button
								class="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg {selectedDepartment === dept.toLowerCase() ? 'bg-muted/50' : ''}"
								onclick={() => {
									selectedDepartment = dept === "All Departments" ? "all" : dept;
									showDepartmentDropdown = false;
									applyFilter();
								}}
							>
								{dept}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			
			<!-- Strategic Goal Dropdown -->
			<div class="relative">
				<button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2" onclick={() => (showStrategicGoalDropdown = !showStrategicGoalDropdown)}>
					{selectedStrategicGoal === "all" ? "All Goals" : selectedStrategicGoal}
					<ChevronDown class="w-4 h-4" />
				</button>

				{#if showStrategicGoalDropdown}
					<div class="absolute top-full left-0 mt-1 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
						{#each strategicGoals as goal}
							<button
								class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg {selectedStrategicGoal === goal.toLowerCase() ? 'bg-gray-50 dark:bg-gray-700' : ''}"
								onclick={() => {
									selectedStrategicGoal = goal === "All Goals" ? "all" : goal;
									showStrategicGoalDropdown = false;
									applyFilter();
								}}
							>
								{goal}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Strategic Objective Dropdown -->
			<div class="relative">
				<button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2" onclick={() => (showStrategicObjectiveDropdown = !showStrategicObjectiveDropdown)}>
					{selectedStrategicObjective === "all" ? "All Objectives" : selectedStrategicObjective}
					<ChevronDown class="w-4 h-4" />
				</button>

				{#if showStrategicObjectiveDropdown}
					<div class="absolute top-full left-0 mt-1 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
						{#each strategicObjectives as objective}
							<button
								class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg {selectedStrategicObjective === objective.toLowerCase() ? 'bg-gray-50 dark:bg-gray-700' : ''}"
								onclick={() => {
									selectedStrategicObjective = objective === "All Objectives" ? "all" : objective;
									showStrategicObjectiveDropdown = false;
									applyFilter();
								}}
							>
								{objective}
							</button>
						{/each}
					</div>
				{/if}
			</div>

		</div>

		<div class="flex gap-2">
			<button class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial whitespace-nowrap" onclick={exportToPDF}>
				<Download class="w-4 h-4" />
				Export PDF
			</button>

			<button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" onclick={generateSummaryPDF} disabled={isGeneratingSummary}>
				{#if isGeneratingSummary}
					<Loader2 class="w-4 h-4 animate-spin" />
				{:else}
					<FileText class="w-4 h-4" />
				{/if}
				Generate Report
			</button>
		</div>
	</div>

	<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
		{#if isLoading}
			<div class="flex items-center justify-center p-8">
				<Loader2 class="w-6 h-6 animate-spin text-primary" />
				<span class="ml-2 text-muted-foreground">Loading plans...</span>
			</div>
		{:else if filteredPlans.length > 0}
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">Department</th>
						<th class="px-4 py-3 text-left">Action Plans</th>
						<th class="px-4 py-3 text-left">KPI</th>
						<th class="px-4 py-3 text-left">Actions Taken</th>
						<th class="px-4 py-3 text-left">Statement</th>
						<th class="px-4 py-3 text-left">Status</th>
						<th class="px-4 py-3 text-left">Completed</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedPlans as plan}
						<tr class="hover:bg-muted/50">
							<td class="px-4 py-3">{plan.department}</td>
							<td class="px-4 py-3">{plan.actions_taken}</td>
							<td class="px-4 py-3">{plan.kpi}</td>
							<td class="px-4 py-3">{plan.evaluation || "Pending"}</td>
							<td class="px-4 py-3">{plan.statement || "Pending"}</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {plan.is_accomplished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{plan.is_accomplished ? "Achieved" : "Not Achieved"}
								</span>
							</td>
							<td class="px-4 py-3 text-muted-foreground">
								{plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A"}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 border-t border-border">
				<div class="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPlans.length)} of {filteredPlans.length} results
				</div>
				<div class="flex flex-col sm:flex-row items-center gap-4">
					<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring">
						<option value={5}>5 per page</option>
						<option value={10}>10 per page</option>
						<option value={25}>25 per page</option>
					</select>
					<div class="flex gap-2">
						<button disabled={currentPage === 1} onclick={() => currentPage--} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Previous</button>
						<button disabled={currentPage === totalPages} onclick={() => currentPage++} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Next</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center p-8 text-muted-foreground">No plans found matching your criteria.</div>
		{/if}
	</div>
</div>
