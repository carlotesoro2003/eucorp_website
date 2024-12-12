<script lang="ts">
	import { Search, ArrowUpDown, Plus, Pencil, Target, Loader2, X } from "lucide-svelte";
import { supabase } from "$lib/supabaseClient";
import { onMount } from "svelte";
import { fade } from "svelte/transition";
import { calculateRiskControlRating } from "$lib/components/dept-risks-table/risk-assessment-table/riskCalculator";

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

/** State variables */
let risksMonitoring: RiskMonitoring[] = $state([]);
let isLoading: boolean = $state(true);
let errorMessage: string | null = $state(null);
let showDialog: boolean = $state(false);
let selectedRisk: RiskMonitoring | null = $state(null);
let searchQuery: string = $state("");
let currentPage: number = $state(1);
let itemsPerPage: number = $state(5);
let sortField: "rrn" | "risk_statement" = $state("rrn");
let sortDirection: "asc" | "desc" = $state("asc");

// Filter states
let filterLikelihood: string = $state("all");
let filterSeverity: string = $state("all");
let filterControlRating: string = $state("all");

// Dropdown options
let likelihoodRating: any[] = $state([]);
let severity: any[] = $state([]);
let riskControlRating: any[] = $state([]);
let riskMonitoringRating: any[] = $state([]);

// Form state
let assessment = $state({
	likelihoodRating: null,
	severity: null,
	riskControlRating: null,
	riskMonitoringRating: null,
});

/** Get badge color based on control rating */
const getControlRatingBadgeColor = (rating: string | null) => {
	if (!rating) return "bg-gray-100 text-gray-800";

	const ratingLower = rating.toLowerCase();
	if (ratingLower.includes("high")) return "bg-red-100 text-red-800";
	if (ratingLower.includes("medium")) return "bg-yellow-100 text-yellow-800";
	if (ratingLower.includes("low")) return "bg-green-100 text-green-800";
	return "bg-gray-100 text-gray-800";
};

/** Toggle Sort */
// const toggleSort = (field: "rrn" | "risk_statement") => {
// 	if (sortField === field) {
// 		sortDirection = sortDirection === "asc" ? "desc" : "asc";
// 	} else {
// 		sortField = field;
// 		sortDirection = "asc";
// 	}

// 	risksMonitoring.sort((a, b) => {
// 		const aValue = String(a[field]);
// 		const bValue = String(b[field]);
// 		return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
// 	});
// };

// Previous risk control rating for comparison
let previousRiskControlRating: number | null = null;
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

			risksMonitoring = data
				.map((item: any) => ({
					id: item.id,
					rrn: item.risks.rrn,
					risk_statement: item.risks.risk_statement,
					likelihood_rating: item.likelihood_rating?.name || "Not Available",
					severity: item.severity?.name || "Not Available",
					control_rating: item.control_rating?.name || "Not Available",
					monitoring_rating: item.monitoring_rating?.status || "Not Available",
					is_achieved: item.is_achieved,
				}))
				.sort((a, b) => a.rrn.localeCompare(b.rrn)); // Sort by rrn
		} catch (error) {
			console.error("Error fetching risk monitoring data:", error);
			errorMessage = "Failed to fetch risk monitoring data.";
		} finally {
			isLoading = false;
		}
	};


	/** Fetch dropdown options */
	const fetchDropdownOptions = async () => {
		try {
			const [likelihoodData, severityData, controlData, monitoringData] = await Promise.all([
				supabase.from("likelihood_rating").select("*"),
				supabase.from("severity").select("*"),
				supabase.from("risk_control_rating").select("*"),
				supabase.from("risk_monitoring_rating").select("*"),
			]);

			if (likelihoodData.error || severityData.error || controlData.error || monitoringData.error) {
				throw new Error("Failed to fetch dropdown options");
			}

			likelihoodRating = likelihoodData.data;
			severity = severityData.data;
			riskControlRating = controlData.data;
			riskMonitoringRating = monitoringData.data;
		} catch (error) {
			console.error("Error fetching dropdown options:", error);
		}
	};

	/** Open the dialog to edit the risk assessment */
	const handleEdit = (risk: RiskMonitoring) => {
		selectedRisk = risk;
		assessment = {
			likelihoodRating: likelihoodRating.find((r) => r.name === risk.likelihood_rating)?.id || null,
			severity: severity.find((s) => s.name === risk.severity)?.id || null,
			riskControlRating: riskControlRating.find((c) => c.name === risk.control_rating)?.id || null,
			riskMonitoringRating: riskMonitoringRating.find((m) => m.status === risk.monitoring_rating)?.id || null,
		};
		previousRiskControlRating = assessment.riskControlRating;
		showDialog = true;
	};

/** Update risk control and monitoring ratings explicitly */
const updateRatings = async () => {
	if (!assessment.likelihoodRating || !assessment.severity || !selectedRisk) {
		return; // Exit if required fields or selectedRisk is not available
	}

	try {
		// Fetch the current control rating from the database for the selected risk
		const { data, error } = await supabase
			.from("risk_monitoring")
			.select("control_rating_id")
			.eq("id", selectedRisk.id)
			.single();

		if (error || !data) {
			console.error("Failed to fetch current control rating:", error);
			return;
		}

		const currentControlRatingId = data.control_rating_id;
		const currentControlRating = riskControlRating.find((r) => r.id === currentControlRatingId);
		const currentControlValue = currentControlRating?.value || 0; // Current control rating value from DB

		// Calculate the new control rating based on likelihood and severity
		const likelihood = likelihoodRating.find((r) => r.id === assessment.likelihoodRating)?.symbol;
		const severityValue = severity.find((s) => s.id === assessment.severity)?.value;

		if (likelihood && severityValue) {
			const { controlRating } = calculateRiskControlRating(likelihood, severityValue);
			const matchingControlRating = riskControlRating.find((r) => r.symbol === controlRating);
			const newControlRatingId = matchingControlRating?.id || null;

			// Only update the control rating in the UI (but not yet in DB)
			if (newControlRatingId && assessment.riskControlRating !== newControlRatingId) {
				assessment.riskControlRating = newControlRatingId;
			}

			// Adjust monitoring rating based on the current control rating (from DB)
			let newMonitoringStatusId = null;

			if (matchingControlRating?.value > currentControlValue) {
				// Grading Increased
				newMonitoringStatusId = riskMonitoringRating.find((r) => r.status === "Grading Increased")?.id;
			} else if (matchingControlRating?.value < currentControlValue) {
				// Grading Decreased
				newMonitoringStatusId = riskMonitoringRating.find((r) => r.status === "Grading Decreased")?.id;
			} else if (matchingControlRating?.value === currentControlValue) {
				// No Change to Grade
				newMonitoringStatusId = riskMonitoringRating.find((r) => r.status === "No Change to Grade")?.id;
			}

			// Update monitoring rating in the UI if it changes
			if (newMonitoringStatusId && assessment.riskMonitoringRating !== newMonitoringStatusId) {
				assessment.riskMonitoringRating = newMonitoringStatusId;
			}
		}
	} catch (error) {
		console.error("Error updating monitoring rating:", error);
	}
};




	/** Trigger updates when dropdown values change */
	const handleDropdownChange = () => {
		updateRatings();
	};

	/** Save the updated assessment */
	const handleSave = async () => {
		try {
			const { error } = await supabase
				.from("risk_monitoring")
				.update({
					likelihood_rating_id: assessment.likelihoodRating,
					severity_id: assessment.severity,
					control_rating_id: assessment.riskControlRating,
					monitoring_rating_id: assessment.riskMonitoringRating,
				})
				.eq("id", selectedRisk?.id);

			if (error) throw error;

			showDialog = false;
			selectedRisk = null;
			await fetchRiskMonitoring();
		} catch (error) {
			console.error("Failed to save risk assessment:", error);
		}
	};

	

	/** Close the dialog */
	const handleCloseDialog = () => {
		showDialog = false;
		selectedRisk = null;
		previousRiskControlRating = null;
	};

	const toggleSort = (field: "rrn" | "risk_statement") => {
	if (sortField === field) {
		sortDirection = sortDirection === "asc" ? "desc" : "asc";
	} else {
		sortField = field;
		sortDirection = "asc";
	}

	risksMonitoring.sort((a, b) => {
		const aValue = String(a[field]);
		const bValue = String(b[field]);
		return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
	});
};

/** Reset filters */
const resetFilters = () => {
	filterLikelihood = "all";
	filterSeverity = "all";
	filterControlRating = "all";
	searchQuery = "";
};

/** Derived Values */
const filteredItems = $derived(
	risksMonitoring.filter((risk) => {
		const searchFields = `${risk.rrn} ${risk.risk_statement}`.toLowerCase();
		const matchesSearch = searchFields.includes(searchQuery.toLowerCase());

		const matchesLikelihood = filterLikelihood === "all" || risk.likelihood_rating?.toLowerCase() === filterLikelihood.toLowerCase();
		const matchesSeverity = filterSeverity === "all" || risk.severity?.toLowerCase() === filterSeverity.toLowerCase();
		const matchesControlRating = filterControlRating === "all" || risk.control_rating?.toLowerCase() === filterControlRating.toLowerCase();

		return matchesSearch && matchesLikelihood && matchesSeverity && matchesControlRating;
	})
);

const paginatedItems = $derived(filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));








	/** Fetch data when component mounts */
	onMount(() => {
		fetchRiskMonitoring();
		fetchDropdownOptions();
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
	<div class="flex items-center gap-2">
		<Target class="w-8 h-8 text-primary" />
		<h1 class="text-2xl font-bold">Risk Monitoring</h1>
	</div>
</div>

<div class="grid gap-4">
	<!-- Search and Items Per Page -->
	<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
		<div class="relative flex-1 w-full md:max-w-[300px]">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
			<input type="text" bind:value={searchQuery} placeholder="Search risks..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
		</div>
		
	</div>

	<!-- Filters -->
	<div class="grid sm:grid-cols-4 gap-4">
		<select bind:value={filterLikelihood} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
			<option value="all">All Likelihood</option>
			{#each likelihoodRating as rating}
				<option value={rating.name}>{rating.name}</option>
			{/each}
		</select>

		<select bind:value={filterSeverity} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
			<option value="all">All Severity</option>
			{#each severity as sev}
				<option value={sev.name}>{sev.name}</option>
			{/each}
		</select>

		<select bind:value={filterControlRating} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
			<option value="all">All Control Rating</option>
			{#each riskControlRating as rating}
				<option value={rating.name}>{rating.name}</option>
			{/each}
		</select>

		<button onclick={resetFilters} class="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80">Reset Filters</button>
	</div>
</div>

{#if isLoading}
	<div class="flex justify-center p-8">
		<Loader2 class="animate-spin h-8 w-8 text-primary" />
	</div>
{:else if errorMessage}
	<div transition:fade class="flex items-center p-4 rounded-lg bg-red-100 text-red-800">
		<span>{errorMessage}</span>
	</div>
{:else}
	<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
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
					<th class="px-4 py-3 text-left">Likelihood Rating</th>
					<th class="px-4 py-3 text-left">Severity</th>
					<th class="px-4 py-3 text-left">Control Rating</th>
					<th class="px-4 py-3 text-left">Monitoring Rating</th>
					<th class="px-4 py-3 text-center">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#each paginatedItems as risk (risk.id)}
					<tr class="hover:bg-muted/50">
						<td class="px-4 py-3">{risk.rrn}</td>
						<td class="px-4 py-3">{risk.risk_statement}</td>
						<td class="px-4 py-3">{risk.likelihood_rating}</td>
						<td class="px-4 py-3">{risk.severity}</td>
						<td class="px-4 py-3">
							<span class={`px-2 py-1 rounded-full text-xs font-medium ${getControlRatingBadgeColor(risk.control_rating)}`}>
								{risk.control_rating || "N/A"}
							</span>
						</td>
						<td class="px-4 py-3">{risk.monitoring_rating}</td>
						<td class="px-4 py-3">
							<div class="flex justify-center gap-2">
								<button onclick={() => handleEdit(risk)} class="p-1.5 hover:bg-primary/10 rounded-md transition-colors text-primary" title="Add Re-Assessment">
									<Pencil size={18} />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
		<div class="text-sm text-muted-foreground">
			Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
		</div>
		<div class="flex flex-col sm:flex-row items-center gap-4">
			<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
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
{/if}

<!-- Keep dialog as is -->
{#if showDialog}
{#if showDialog}
<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
	<div class="bg-card rounded-lg shadow-lg max-w-md w-full">
		<div class="flex justify-between items-center p-4 border-b border-border">
			<h3 class="text-lg font-semibold">Edit Risk Assessment</h3>
			<button onclick={handleCloseDialog} class="text-muted-foreground hover:text-foreground">
				<X class="w-5 h-5" />
			</button>
		</div>

		<div class="p-6 space-y-4">
			<div>
				<h4 class="text-sm font-medium text-muted-foreground">Risk Statement</h4>
				<p class="text-sm">{selectedRisk?.risk_statement}</p>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium">Likelihood Rating</label>
				<select bind:value={assessment.likelihoodRating} onchange={handleDropdownChange} class="w-full px-3 py-2 bg-secondary rounded-lg focus:ring-2 focus:ring-ring">
					<option value={null}>Select Likelihood</option>
					{#each likelihoodRating as rating}
						<option value={rating.id}>{rating.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium">Severity</label>
				<select bind:value={assessment.severity} onchange={handleDropdownChange} class="w-full px-3 py-2 bg-secondary rounded-lg focus:ring-2 focus:ring-ring">
					<option value={null}>Select Severity</option>
					{#each severity as sev}
						<option value={sev.id}>{sev.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium">Control Rating</label>
				<div class="mt-1 p-2 bg-muted rounded-lg">
					{#if assessment.riskControlRating}
						{@const rating = riskControlRating.find((r) => r.id === assessment.riskControlRating)}
						<p class="text-sm">{rating?.name || "Not Available"}</p>
					{:else}
						<p class="text-sm text-muted-foreground">Select Likelihood and Severity first</p>
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium">Monitoring Rating</label>
				<select bind:value={assessment.riskMonitoringRating} class="w-full px-3 py-2 bg-secondary rounded-lg focus:ring-2 focus:ring-ring">
					<option value={null}>Select Monitoring Rating</option>
					{#each riskMonitoringRating as monitor}
						<option value={monitor.id}>{monitor.value} - {monitor.status}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="p-4 flex justify-end gap-2 border-t border-border">
			<button onclick={handleCloseDialog} class="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">Cancel</button>
			<button onclick={handleSave} class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">Save Changes</button>
		</div>
	</div>
</div>
{/if}
{/if}
</div>