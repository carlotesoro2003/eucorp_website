<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { Loader2, X } from "lucide-svelte";
	import { onMount } from "svelte";
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

	/** Save the updated assessment */
	const handleSave = async () => {
		try {
			const { error } = await supabase
				.from("risk_monitoring")
				.update({
					likelihood_rating: assessment.likelihoodRating,
					severity: assessment.severity,
					control_rating: assessment.riskControlRating,
					monitoring_rating: assessment.riskMonitoringRating,
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

	// Calculate risk control rating and adjust risk monitoring rating
	$effect(() => {
		if (assessment.likelihoodRating && assessment.severity) {
			const likelihood = likelihoodRating.find((r) => r.id === assessment.likelihoodRating)?.symbol;
			const severityValue = severity.find((s) => s.id === assessment.severity)?.value;

			console.log("Likelihood Rating Symbol:", likelihood);
			console.log("Severity Value:", severityValue);

			if (likelihood && severityValue) {
				// Calculate the control rating symbol
				const { controlRating } = calculateRiskControlRating(likelihood, severityValue);

				console.log("Calculated Control Rating Symbol:", controlRating);

				// Find the matching control rating entry from the database
				const matchingControlRating = riskControlRating.find((r) => r.symbol === controlRating);
				assessment.riskControlRating = matchingControlRating?.id || null;

				console.log("Matching Control Rating:", matchingControlRating);

				if (assessment.riskControlRating !== null) {
					const newControlValue = matchingControlRating?.value || 0;

					// Find the current monitoring rating
					const currentMonitoring = riskMonitoringRating.find((r) => r.id === assessment.riskMonitoringRating);

					if (!currentMonitoring) {
						console.warn(
							"Current Monitoring Rating Not Found:",
							assessment.riskMonitoringRating,
							"Check if it exists in riskMonitoringRating."
						);
					} else {
						const currentMonitoringValue = currentMonitoring.value;

						console.log("Current Monitoring Value:", currentMonitoringValue);
						console.log("New Control Value:", newControlValue);

						// Determine the new monitoring rating based on comparison
						let newMonitoringStatusId = null;
						if (newControlValue > currentMonitoringValue) {
							newMonitoringStatusId = riskMonitoringRating.find((r) => r.status === "Grading Increased")?.id;
							console.log("New Monitoring Status: Grading Increased");
						} else if (newControlValue < currentMonitoringValue) {
							newMonitoringStatusId = riskMonitoringRating.find((r) => r.status === "Grading Decreased")?.id;
							console.log("New Monitoring Status: Grading Decreased");
						} else {
							newMonitoringStatusId = riskMonitoringRating.find((r) => r.status === "No Change to Grade")?.id;
							console.log("New Monitoring Status: No Change to Grade");
						}

						// Update the monitoring rating if it differs
						if (newMonitoringStatusId && newMonitoringStatusId !== assessment.riskMonitoringRating) {
							console.log(
								`Updating Monitoring Rating: Old Value - ${assessment.riskMonitoringRating}, New Value - ${newMonitoringStatusId}`
							);
							assessment.riskMonitoringRating = newMonitoringStatusId;
						} else {
							console.log("No Update Needed for Monitoring Rating");
						}
					}
				}
			}
		}
	});







	/** Fetch data when component mounts */
	onMount(() => {
		fetchRiskMonitoring();
		fetchDropdownOptions();
	});
</script>


<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
	{#if isLoading}
		<div class="flex items-center justify-center p-8">
			<Loader2 class="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
			<span class="ml-2 text-gray-600 dark:text-gray-400">Loading risks...</span>
		</div>
	{:else if errorMessage}
		<div class="p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
			{errorMessage}
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
						<th class="px-6 py-4">RRN</th>
						<th class="px-6 py-4">Risk Statement</th>
						<th class="px-6 py-4">Likelihood Rating</th>
						<th class="px-6 py-4">Severity</th>
						<th class="px-6 py-4">Control Rating</th>
						<th class="px-6 py-4">Monitoring Rating</th>
						<th class="px-6 py-4">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each risksMonitoring as risk}
						<tr>
							<td class="px-6 py-4">{risk.rrn}</td>
							<td class="px-6 py-4">{risk.risk_statement}</td>
							<td class="px-6 py-4">{risk.likelihood_rating}</td>
							<td class="px-6 py-4">{risk.severity}</td>
							<td class="px-6 py-4">{risk.control_rating}</td>
							<td class="px-6 py-4">{risk.monitoring_rating}</td>
							<td class="px-6 py-4">
								<button class="text-blue-600" onclick={() => handleEdit(risk)}>Edit</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if showDialog}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
			<div class="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Risk Assessment</h3>
				<button onclick={handleCloseDialog} class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
					<X class="w-5 h-5" />
				</button>
			</div>
	
			<div class="p-6 space-y-4">
				<div>
					<h4 class="text-sm font-medium text-gray-600 dark:text-gray-300">Risk Statement</h4>
					<p class="text-sm text-gray-800 dark:text-gray-100">{selectedRisk?.risk_statement}</p>
				</div>
	
				<div>
					<label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Likelihood Rating</label>
					<select bind:value={assessment.likelihoodRating} class="block w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200">
						<option value={null}>Select Likelihood</option>
						{#each likelihoodRating as rating}
							<option value={rating.id} selected={rating.id === assessment.likelihoodRating}>
								{rating.name}
							</option>
						{/each}
					</select>
				</div>
	
				<div>
					<label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Severity</label>
					<select bind:value={assessment.severity} class="block w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200">
						<option value={null}>Select Severity</option>
						{#each severity as sev}
							<option value={sev.id} selected={sev.id === assessment.severity}>
								{sev.name}
							</option>
						{/each}
					</select>
				</div>
	
				<div>
					<label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Control Rating</label>
					<div class="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
						{#if assessment.riskControlRating}
							{@const rating = riskControlRating.find((r) => r.id === assessment.riskControlRating)}
							<p class="text-sm text-gray-800 dark:text-gray-200">{rating?.name || "Not Available"}</p>
						{:else}
							<p class="text-sm text-gray-500 dark:text-gray-400">Select Likelihood and Severity first</p>
						{/if}
					</div>
				</div>
	
				<div>
					<label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Monitoring Rating</label>
					<select bind:value={assessment.riskMonitoringRating} class="block w-full mt-1 rounded-lg">
						<option value={null}>Select Monitoring Rating</option>
						{#each riskMonitoringRating as monitor}
							<option value={monitor.id}>
								{monitor.value} - {monitor.status}
							</option>
						{/each}
					</select>					
				</div>
			</div>
	
			<div class="p-4 flex justify-end space-x-2 border-t border-gray-300 dark:border-gray-700">
				<button onclick={handleCloseDialog} class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
					Cancel
				</button>
				<button onclick={handleSave}  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed">
					Save Changes
				</button>
			</div>
		</div>
	</div>
	
	{/if}
</div>
