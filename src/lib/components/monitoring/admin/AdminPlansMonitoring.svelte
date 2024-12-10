<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { FileText, Loader2, Download, ChevronDown, ChevronLeft, ChevronRight } from "lucide-svelte";
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
	}

	/** State variables */
	let plans: PlanMonitoring[] = $state([]);
	let filteredPlans: PlanMonitoring[] = $state([]);
	let filterStatus: "all" | "achieved" | "not_achieved" = $state("all");
	let isLoading: boolean = $state(true);
	let isGeneratingSummary: boolean = $state(false);
	let searchQuery: string = $state("");
	let showStatusDropdown: boolean = $state(false);

	/** Pagination state */
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(10);
	let totalPages = $derived(Math.ceil(filteredPlans.length / itemsPerPage));
	let paginatedPlans = $derived(filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

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
                action_plans (actions_taken, kpi)
            `);

			if (error) throw error;

			plans = data.map((plan: any) => ({
				id: plan.id,
				action_plan_id: plan.action_plan_id,
				evaluation: plan.evaluation,
				statement: plan.statement,
				is_accomplished: plan.is_accomplished,
				time_completed: plan.time_completed,
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

	/** Filter plans based on status and search query */
	const applyFilter = () => {
		let filtered = plans;

		if (filterStatus === "achieved") {
			filtered = filtered.filter((p) => p.is_accomplished);
		} else if (filterStatus === "not_achieved") {
			filtered = filtered.filter((p) => !p.is_accomplished);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((p) => p.statement?.toLowerCase().includes(query) || p.actions_taken?.toLowerCase().includes(query) || p.kpi?.toLowerCase().includes(query));
		}

		filteredPlans = filtered;
		currentPage = 1;
	};

	/** Export to PDF */
	const exportToPDF = () => {
		const doc = new jsPDF("landscape");
		const title = "Plan Monitoring Report";

		doc.setFontSize(12);
		doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
		doc.setFontSize(10);
		doc.text("SY 2024-2025", 14, 20);
		doc.setFontSize(14);
		doc.text(title, 14, 15);

		const columns = ["Actions Taken", "KPI", "Evaluation", "Statement", "Status", "Time Completed"];

		const rows = filteredPlans.map((plan) => [plan.actions_taken, plan.kpi, plan.evaluation || "Pending Evaluation", plan.statement || "Pending Statement", plan.is_accomplished ? "Achieved" : "Not Achieved", plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A"]);

		autoTable(doc, {
			head: [columns],
			body: rows,
			startY: 25,
			theme: "grid",
			styles: { fontSize: 10 },
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

	/** Watch for search query changes */
	$effect(() => {
		applyFilter();
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
	<div class="max-w-7xl mx-auto">
		<h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Plans Monitoring</h1>

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

				<input type="text" bind:value={searchQuery} placeholder="Search plans..." class="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" />
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

		<!-- Content -->
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
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action Plans</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">KPI</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions Taken to Achieve Action Plan</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statement</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
								<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
							{#each paginatedPlans as plan}
								<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
