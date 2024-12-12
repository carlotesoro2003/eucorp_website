<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { Search, ArrowUpDown } from "lucide-svelte";
	import { fade } from "svelte/transition";

	/** Risk monitoring interface */
	interface RiskMonitoring {
		id: number;
		rrn: string;
		risk_statement: string;
		likelihood_rating: string | null;
		severity: string | null;
		control_rating: string | null;
		monitoring_rating: string | null;
		is_achieved: boolean;
	}

	/** Types */
	type SortField = "rrn" | "risk_statement" | "likelihood_rating" | "severity" | "control_rating" | "monitoring_rating";
	type SortDirection = "asc" | "desc";

	/** State variables */
	let risksMonitoring: RiskMonitoring[] = $state([]);
	let isLoading: boolean = $state(true);
	let errorMessage: string | null = $state(null);
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let sortField: SortField = $state("rrn");
	let sortDirection: SortDirection = $state("asc");
	let statusFilter: "all" | boolean = $state("all");
	let showAlert: boolean = $state(false);

	/** Fetch risk monitoring data */
	const fetchRiskMonitoring = async () => {
		try {
			const { data, error } = await supabase.from("risk_monitoring").select(`
                id,
                risks (
                    rrn,
                    risk_statement
                ),
                likelihood_rating:likelihood_rating_id(name),
                severity:severity_id(name),
                control_rating:control_rating_id(name),
                monitoring_rating:monitoring_rating_id(status),
                is_achieved
            `);

			if (error) throw error;

			risksMonitoring = data.map((item: any) => ({
				id: item.id,
				rrn: item.risks.rrn,
				risk_statement: item.risks.risk_statement,
				likelihood_rating: item.likelihood_rating?.name || "Not Available",
				severity: item.severity?.name || "Not Available",
				control_rating: item.control_rating?.name || "Not Available",
				monitoring_rating: item.monitoring_rating?.status || "Not Available",
				is_achieved: item.is_achieved,
			}));
		} catch (error) {
			console.error("Error fetching risk monitoring data:", error);
			errorMessage = "Failed to fetch risk monitoring data.";
		} finally {
			isLoading = false;
		}
	};


	/** Toggle Sort */
	const toggleSort = (field: SortField) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
	};

	/** Derived filtered and sorted items */
	const filteredItems = $derived(
		risksMonitoring
			.filter((risk) => {
				const searchFields = `${risk.rrn} ${risk.risk_statement} ${risk.likelihood_rating} ${risk.severity} ${risk.control_rating} ${risk.monitoring_rating}`.toLowerCase();
				const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
				const matchesStatus = statusFilter === "all" || risk.is_achieved === statusFilter;
				return matchesSearch && matchesStatus;
			})
			.sort((a, b) => {
				const aValue = String(a[sortField]);
				const bValue = String(b[sortField]);
				return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			})
	);

	/** Derived paginated items */
	const paginatedItems = $derived(filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));

	/** Fetch data when component mounts */
	fetchRiskMonitoring();
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- {#if showAlert}
		<div transition:fade class="flex items-center p-4 rounded-lg bg-red-100 text-red-800">
			<span>{errorMessage}</span>
		</div>
	{/if} -->

	<div class="flex flex-col md:flex-row gap-4 mb-2 items-center justify-between">
		<div class="flex flex-col md:flex-row gap-4 flex-1">
			<div class="relative flex-1 w-full md:max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search risks..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<select bind:value={statusFilter} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
				<option value="all">All Status</option>
				<option value={true}>Achieved</option>
				<option value={false}>Still mitigating</option>
			</select>
		</div>
	</div>

	<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		{:else}
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("rrn")} class="flex items-center gap-1">
								RRN
								<ArrowUpDown size={16} class={sortField === "rrn" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("risk_statement")} class="flex items-center gap-1">
								Risk Statement
								<ArrowUpDown size={16} class={sortField === "risk_statement" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden lg:table-cell">
							<button onclick={() => toggleSort("likelihood_rating")} class="flex items-center gap-1">
								Likelihood Rating
								<ArrowUpDown size={16} class={sortField === "likelihood_rating" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden lg:table-cell">
							<button onclick={() => toggleSort("severity")} class="flex items-center gap-1">
								Severity
								<ArrowUpDown size={16} class={sortField === "severity" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden md:table-cell">Control Rating</th>
						<th class="px-4 py-3 text-left">Monitoring Rating</th>
						<th class="px-4 py-3 text-left">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedItems as risk (risk.id)}
						<tr class="hover:bg-muted/50">
							<td class="px-4 py-3">{risk.rrn}</td>
							<td class="px-4 py-3">{risk.risk_statement}</td>
							<td class="px-4 py-3 hidden lg:table-cell">{risk.likelihood_rating}</td>
							<td class="px-4 py-3 hidden lg:table-cell">{risk.severity}</td>
							<td class="px-4 py-3 hidden md:table-cell">{risk.control_rating}</td>
							<td class="px-4 py-3">{risk.monitoring_rating}</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {risk.is_achieved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
									{risk.is_achieved ? "Achieved" : "Still mitigating"}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
		<div class="text-sm text-muted-foreground">
			Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
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
</div>
