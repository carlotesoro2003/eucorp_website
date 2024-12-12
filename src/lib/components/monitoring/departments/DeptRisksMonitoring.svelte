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
									<button class="text-blue-600 text-sm" onclick={() => handleEdit(risk)}>Add Re-Assessment</button>
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
						<select
							bind:value={assessment.likelihoodRating}
							onchange={handleDropdownChange}
							class="block w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200"
						>
							<option value={null}>Select Likelihood</option>
							{#each likelihoodRating as rating}
								<option value={rating.id}>
									{rating.name}
								</option>
							{/each}
						</select>
					</div>
		
					<div>
						<label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Severity</label>
						<select
							bind:value={assessment.severity}
							onchange={handleDropdownChange}
							class="block w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200"
						>
							<option value={null}>Select Severity</option>
							{#each severity as sev}
								<option value={sev.id}>
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
