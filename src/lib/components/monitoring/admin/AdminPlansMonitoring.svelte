<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { FileText, Loader2, Download, ChevronDown, ChevronLeft, ChevronRight, Building2 } from "lucide-svelte";
	import DoughnutChart from "$lib/components/monitoring/admin/DoughnutChart.svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";

	/** Define plan monitoring interface */
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

	/** Pagination state */
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(10);
	let totalPages = $derived(Math.ceil(filteredPlans.length / itemsPerPage));
	let paginatedPlans = $derived(filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	/** Chart data */
	const chartData = $derived({
		achieved: filteredPlans.filter((p) => p.is_accomplished).length,
		notAchieved: filteredPlans.filter((p) => !p.is_accomplished).length,
	});

	/** Departments list */
	let departments: string[] = $state([]);

	/** Status options for dropdown */
	const statusOptions = [
		{ value: "all", label: "All Status", color: "bg-blue-600" },
		{ value: "achieved", label: "Achieved", color: "bg-green-600" },
		{ value: "not_achieved", label: "Not Achieved", color: "bg-red-600" },
	];

	/** Get status label */
	const getStatusLabel = (value: string) => {
		return statusOptions.find((opt) => opt.value === value)?.label || "All Status";
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
                action_plans (actions_taken, kpi)
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
			console.error("Error fetching departments:", error);
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

		// Header
		doc.setFontSize(16);
		doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", doc.internal.pageSize.width / 2, 15, { align: "center" });
		doc.setFontSize(12);
		doc.text("Plan Monitoring Report", doc.internal.pageSize.width / 2, 22, { align: "center" });
		doc.text("SY 2024-2025", doc.internal.pageSize.width / 2, 28, { align: "center" });

		// Summary statistics
		doc.setFontSize(11);
		const totalPlans = filteredPlans.length;
		const achievedPlans = chartData.achieved;
		const notAchievedPlans = chartData.notAchieved;
		const achievementRate = ((achievedPlans / totalPlans) * 100).toFixed(1);

		doc.text([`Total Plans: ${totalPlans}`, `Achieved: ${achievedPlans}`, `Not Achieved: ${notAchievedPlans}`, `Achievement Rate: ${achievementRate}%`], 14, 40);

		// Table
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
			const title = `Summary Report`;

			doc.setFont("times", "normal");
			doc.setFontSize(12);
			doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
			doc.setFontSize(10);
			doc.text("SY 2024-2025", 14, 20);
			doc.setFontSize(14);
			doc.text(title, 14, 15);

			const summaryLines = doc.splitTextToSize(data.summaryReport, 180);
			doc.setFontSize(12);
			doc.text(summaryLines, 14, 35);

			doc.save("PlanMonitoringSummary.pdf");
		} catch (error) {
			console.error("Error generating summary report:", error);
			alert("An error occurred while generating the summary report.");
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

	/** Watch for filter changes */
	$effect(() => {
		applyFilter();
	});
</script>



<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
	<div class="max-w-7xl mx-auto">
		<h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Plans Monitoring</h1>

		<!-- Stats and Chart -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<div class="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
				<!-- Total Plans -->
				<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Plans</h3>
					<p class="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{filteredPlans.length}</p>
				</div>

				<!-- Achieved -->
				<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Achieved</h3>
					<p class="text-2xl font-semibold text-green-600 dark:text-green-400 mt-2">{chartData.achieved}</p>
				</div>

				<!-- Not Achieved -->
				<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Not Achieved</h3>
					<p class="text-2xl font-semibold text-red-600 dark:text-red-400 mt-2">{chartData.notAchieved}</p>
				</div>
			</div>

			<!-- Doughnut Chart -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<DoughnutChart {chartData} />
			</div>
		</div>

		<!-- Filters and Search -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
			<div class="flex flex-wrap gap-2 items-center">
				<!-- Status Dropdown -->
				<div class="relative">
					<button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2" onclick={() => (showStatusDropdown = !showStatusDropdown)}>
						{getStatusLabel(filterStatus)}
						<ChevronDown class="w-4 h-4" />
					</button>

					{#if showStatusDropdown}
						<div class="absolute top-full left-0 mt-1 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
							{#each statusOptions as option}
								<button
									class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg {filterStatus === option.value ? 'bg-gray-50 dark:bg-gray-700' : ''}"
									onclick={() => {
										filterStatus = option.value;
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
					<button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2" onclick={() => (showDepartmentDropdown = !showDepartmentDropdown)}>
						<Building2 class="w-4 h-4" />
						{selectedDepartment === "all" ? "All" : selectedDepartment}
						<ChevronDown class="w-4 h-4" />
					</button>

					{#if showDepartmentDropdown}
						<div class="absolute top-full left-0 mt-1 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
							{#each departments as dept}
								<button
									class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg {selectedDepartment === dept.toLowerCase() ? 'bg-gray-50 dark:bg-gray-700' : ''}"
									onclick={() => {
										selectedDepartment = dept === "All" ? "all" : dept;
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

				<input type="text" bind:value={searchQuery} placeholder="Search plans..." class="flex-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" />
			</div>

			<div class="flex gap-2 justify-end">
				<button class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2" onclick={exportToPDF}>
					<Download class="w-4 h-4" />
					Export PDF
				</button>

				<button class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" onclick={generateSummaryPDF} disabled={isGeneratingSummary}>
					{#if isGeneratingSummary}
						<Loader2 class="w-4 h-4 animate-spin" />
					{:else}
						<FileText class="w-4 h-4" />
					{/if}
					Generate Report
				</button>
			</div>
		</div>

		<!-- Table Content -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
			{#if isLoading}
				<div class="flex items-center justify-center p-8">
					<Loader2 class="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
					<span class="ml-2 text-gray-600 dark:text-gray-400">Loading plans...</span>
				</div>
			{:else if filteredPlans.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action Plans</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">KPI</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions Taken</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statement</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
							{#each paginatedPlans as plan}
								<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{plan.department}</td>
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{plan.actions_taken}</td>
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{plan.kpi}</td>
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{plan.evaluation || "Pending"}</td>
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{plan.statement || "Pending"}</td>
									<td class="px-6 py-4">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {plan.is_accomplished ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}">
											{plan.is_accomplished ? "Achieved" : "Not Achieved"}
										</span>
									</td>
									<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
										{plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A"}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				<div class="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
					<div class="text-sm text-gray-700 dark:text-gray-300">
						Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPlans.length)} of {filteredPlans.length} entries
					</div>
					<div class="flex gap-2">
						<button class="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" onclick={prevPage} disabled={currentPage === 1}>
							<ChevronLeft class="w-5 h-5" />
						</button>
						<button class="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" onclick={nextPage} disabled={currentPage === totalPages}>
							<ChevronRight class="w-5 h-5" />
						</button>
					</div>
				</div>
			{:else}
				<div class="text-center p-8 text-gray-500 dark:text-gray-400">No plans found matching your criteria.</div>
			{/if}
		</div>
	</div>
</div>
