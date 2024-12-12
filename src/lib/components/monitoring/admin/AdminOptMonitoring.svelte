<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { FileText, Loader2, Download, ChevronDown, ChevronLeft, ChevronRight, Search, Plus, Eye, Pencil, ArrowUpDown, Lightbulb } from "lucide-svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";

	/** Define opportunity interface */
	interface Opportunity {
		id: number;
		opt_statement: string;
		kpi: string;
		planned_actions: string;
		evaluation: string | null;
		statement: string | null;
		achieved: boolean;
		time_completed: string | null;
	}

	/** State variables */
	let opportunities: Opportunity[] = $state([]);
	let filteredOpportunities: Opportunity[] = $state([]);
	let filterStatus: "all" | "achieved" | "not_achieved" = $state("all");
	let isLoading: boolean = $state(true);
	let isGeneratingSummary: boolean = $state(false);
	let searchQuery: string = $state("");
	let showStatusDropdown: boolean = $state(false);
	let sortField: keyof Opportunity = $state("opt_statement");
	let sortDirection: "asc" | "desc" = $state("asc");

	/** Pagination state */
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let totalPages = $derived(Math.ceil(filteredOpportunities.length / itemsPerPage));
	let paginatedOpportunities = $derived(filteredOpportunities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

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

	/** Sort opportunities */
	const toggleSort = (field: keyof Opportunity) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
		applyFilter();
	};

	/** Fetch opportunities from database */
	const fetchOpportunities = async () => {
		isLoading = true;

		try {
			const { data, error } = await supabase.from("opt_monitoring").select(`
                opt_id,
                opportunities (
                    opt_statement,
                    kpi,
                    planned_actions
                ),
				statement,
                evaluation,
                is_accomplished,
                time_completed
            `);

			if (error) {
				console.error("Error fetching opportunities:", error);
				return;
			}

			if (data) {
				opportunities = data.map((item: any) => ({
					id: item.opt_id,
					opt_statement: item.opportunities?.opt_statement || "No Statement Available",
					kpi: item.opportunities?.kpi || "No KPI Available",
					planned_actions: item.opportunities?.planned_actions || "No Actions Available",
					evaluation: item.evaluation || "Pending Evaluation",
					statement: item.statement || "No Statement Available",
					achieved: item.is_accomplished || false,
					time_completed: item.time_completed || null,
				}));

				applyFilter();
			}
		} catch (error) {
			console.error("Unexpected error during data fetch:", error);
		} finally {
			isLoading = false;
		}
	};

	/** Filter and sort opportunities */
	const applyFilter = () => {
		let filtered = opportunities;

		if (filterStatus === "achieved") {
			filtered = filtered.filter((o) => o.achieved);
		} else if (filterStatus === "not_achieved") {
			filtered = filtered.filter((o) => !o.achieved);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((o) => o.opt_statement.toLowerCase().includes(query) || o.kpi.toLowerCase().includes(query) || o.planned_actions.toLowerCase().includes(query));
		}

		filtered.sort((a, b) => {
			const aValue = String(a[sortField]);
			const bValue = String(b[sortField]);
			return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
		});

		filteredOpportunities = filtered;
		currentPage = 1;
	};

	/** Export functions */
	const exportToPDF = () => {
		const doc = new jsPDF();
		doc.text("Opportunities Monitoring Report", 14, 20);

		const rows = filteredOpportunities.map((opportunity) => [opportunity.opt_statement, opportunity.kpi, opportunity.planned_actions, opportunity.evaluation || "Pending", opportunity.achieved ? "Achieved" : "Not Achieved", opportunity.time_completed ? new Date(opportunity.time_completed).toLocaleString() : "N/A"]);

		autoTable(doc, {
			head: [["Statement", "KPI", "Actions", "Evaluation", "Status", "Completed"]],
			body: rows,
			startY: 30,
		});

		doc.save("opportunities.pdf");
	};

	/** Generate PDF report */
	const generateSummaryPDF = async () => {
		isGeneratingSummary = true;
		try {
			// Your existing PDF generation logic
			doc.save("OpportunitiesSummary.pdf");
		} catch (error) {
			console.error("Error generating summary:", error);
		} finally {
			isGeneratingSummary = false;
		}
	};

	/** Watch for search query changes */
	$effect(() => {
		applyFilter();
	});

	/** Initialize data */
	fetchOpportunities();
</script>

<div class="container mx-auto p-4">
	{#if isLoading}
		<div class="flex justify-center items-center min-h-[200px]">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
		</div>
	{:else}
		<div class="flex flex-col gap-6">
			<!-- Header -->
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div class="flex items-center gap-2">
					<Lightbulb class="w-8 h-8 text-primary" />
					<h1 class="text-2xl font-bold">Opportunities Monitoring</h1>
				</div>
			</div>
		
			<!-- Search and Actions -->
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<div class="relative flex-3 w-full md:max-w-[300px]">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
					<input type="text" bind:value={searchQuery} placeholder="Search opportunities..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>
				<div class="flex gap-2">
					<div class="relative">
						<button onclick={() => (showStatusDropdown = !showStatusDropdown)} class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80">
							{getStatusLabel(filterStatus)}
							<ChevronDown size={20} />
						</button>
						{#if showStatusDropdown}
							<div class="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-10">
								{#each statusOptions as option}
									<button
										onclick={() => {
											filterStatus = option.value;
											showStatusDropdown = false;
											applyFilter();
										}}
										class="w-full text-left px-4 py-2 hover:bg-secondary/80"
									>
										{option.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>
					<button onclick={exportToPDF} class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80">
						<Download size={20} />
						Export
					</button>
					<button onclick={generateSummaryPDF} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90" disabled={isGeneratingSummary}>
						{#if isGeneratingSummary}
							<Loader2 class="animate-spin" size={20} />
						{:else}
							<FileText size={20} />
						{/if}
						Generate Report
					</button>
				</div>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
				<table class="min-w-full table-auto">
					<thead class="bg-muted/50">
						<tr>
							<th class="px-4 py-3 text-left">
								<button onclick={() => toggleSort("opt_statement")} class="flex items-center gap-1 hover:text-primary">
									Statement
									<ArrowUpDown size={16} class={sortField === "opt_statement" ? "text-primary" : ""} />
								</button>
							</th>
							<th class="px-4 py-3 text-left">KPI</th>
							<th class="px-4 py-3 text-left">Actions</th>
							<th class="px-4 py-3 text-left">Evaluation</th>
							<th class="px-4 py-3 text-left">Status</th>
							<th class="px-4 py-3 text-left">Remarks</th>
							<th class="px-4 py-3 text-left">Completed</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each paginatedOpportunities as opportunity}
							<tr class="hover:bg-muted/50">
								<td class="px-4 py-3">{opportunity.opt_statement}</td>
								<td class="px-4 py-3">{opportunity.kpi}</td>
								<td class="px-4 py-3">{opportunity.planned_actions}</td>
								<td class="px-4 py-3">{opportunity.evaluation || "Pending"}</td>
								<td class="px-4 py-3">
									<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium {opportunity.achieved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
										{opportunity.achieved ? "Achieved" : "Not Achieved"}
									</span>
								</td>
								<td class="px-4 py-3">{opportunity.statement}</td>
								<td class="px-4 py-3">{opportunity.time_completed ? new Date(opportunity.time_completed).toLocaleString() : "N/A"}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
				<div class="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOpportunities.length)} of {filteredOpportunities.length} results
				</div>
				<div class="flex gap-2 items-center">
					<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
						<option value={5}>5 per page</option>
						<option value={10}>10 per page</option>
						<option value={25}>25 per page</option>
						<option value={50}>50 per page</option>
					</select>
					<button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">
						<ChevronLeft size={20} />
					</button>
					<button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">
						<ChevronRight size={20} />
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
