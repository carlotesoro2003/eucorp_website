<script lang="ts">
	import { X } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { calculateRiskControlRating } from "$lib/components/dept-risks-table/risk-assessment-table/riskCalculator";
	import type { Risk, LikelihoodRating, Severity, RiskControlRating, RiskMonitoringRating } from "$lib/types/RiskTypes";
    import { fade } from "svelte/transition";

	// Props
	let {
		selectedRisk,	
		likelihoodRating,
		severity,
		riskControlRating,
		riskMonitoringRating,
		isSaving = $bindable(false),
		onClose,
		onSuccess,
		onError,
	}: {
		selectedRisk: Risk | null;
		likelihoodRating: LikelihoodRating[];
		severity: Severity[];
		riskControlRating: RiskControlRating[];
		riskMonitoringRating: RiskMonitoringRating[];
		isSaving: boolean;
		onClose: () => void;
		onSuccess: (message: string) => void;
		onError: (message: string) => void;
	} = $props();

	// Form state
	let assessment = $state({
		likelihoodRating: null as number | null,
		severity: null as number | null,
		riskControlRating: null as number | null,
		riskMonitoringRating: null as number | null,
	});

	// Derived state for form validation
	const isFormValid = $derived(
		assessment.likelihoodRating !== null &&
		assessment.severity !== null &&
		assessment.riskControlRating !== null &&
		assessment.riskMonitoringRating !== null
	);

	//reload page 
    let isPageReloading = $state(false);


	// Calculate risk control rating when likelihood or severity changes
	$effect(() => {
		if (assessment.likelihoodRating && assessment.severity) {
			const likelihood = likelihoodRating.find((r) => r.id === assessment.likelihoodRating)?.symbol;
			const severityValue = severity.find((s) => s.id === assessment.severity)?.value;

			if (likelihood && severityValue) {
				const ratingSymbol = calculateRiskControlRating(likelihood, severityValue);
				const matchingRating = riskControlRating.find((r) => r.symbol === ratingSymbol.controlRating);
				assessment.riskControlRating = matchingRating?.id || null;
			}
		}
	});

	/** Handle assessment save */
	const handleSave = async () => {
		if (!isFormValid || !selectedRisk || isSaving || isPageReloading) return;

		// Immediately trigger full-page loading spinner
		isPageReloading = true;

		try {
			// Insert new assessment
			const { data, error } = await supabase
				.from("risk_assessment")
				.insert({
					risk_id: selectedRisk.id,
					lr: assessment.likelihoodRating,
					s: assessment.severity,
					rcr: assessment.riskControlRating,
					rmr: assessment.riskMonitoringRating,
				})
				.select();

			if (error) throw error;

			// Show success message
			onSuccess("Assessment saved successfully");

			// Reload the page immediately
			location.reload();
		} catch (error) {
			onError("Failed to save assessment");
			isPageReloading = false; // Reset loading state if there's an error
		}
	};


</script>



{#if isPageReloading}
<!-- Full-page Loading Spinner -->
<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
	<div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
</div>
{:else}
<!-- Page Content -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
	<div class="bg-card rounded-xl max-w-xl w-full shadow-xl">
		<!-- Header -->
		<div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
			<div>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Risk Assessment</h2>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">RRN: {selectedRisk?.rrn}</p>
			</div>
			<button onclick={onClose} class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
				<X class="h-5 w-5" />
			</button>
		</div>

		<!-- Body -->
		<div class="p-6 space-y-6">
			<div class="bg-card border border-border p-4 rounded-lg">
				<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Statement</h3>
				<p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedRisk?.risk_statement}</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Likelihood Rating</label>
					<select bind:value={assessment.likelihoodRating} class="bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring px-3 py-2">
						<option value={null}>Select likelihood</option>
						{#each likelihoodRating as rating}
							<option value={rating.id}>{rating.symbol} - {rating.name}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Severity</label>
					<select bind:value={assessment.severity} class="bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring px-3 py-2">
						<option value={null}>Select severity</option>
						{#each severity as sev}
							<option value={sev.id}>{sev.value} - {sev.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Risk Control Rating</label>
				<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
					{#if assessment.riskControlRating}
						{@const rating = riskControlRating.find((r) => r.id === assessment.riskControlRating)}
						<div class="flex items-center gap-2">
							<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold">
								{rating?.symbol}
							</span>
							<span class="text-gray-900 dark:text-gray-100">{rating?.name}</span>
						</div>
					{:else}
						<p class="text-gray-500 dark:text-gray-400">Select likelihood and severity first</p>
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Monitoring Rating</label>
				<select bind:value={assessment.riskMonitoringRating} class="bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring px-3 py-2">
					<option value={null}>Select monitoring rating</option>
					{#each riskMonitoringRating as rating}
						{#if rating.status === "New Risk"}
							<option value={rating.id}>{rating.status}</option>
						{/if}
					{/each}
				</select>
			</div>
		</div>

		<!-- Footer -->
		<div class="flex items-center justify-end gap-3 p-6 border-t dark:border-gray-700">
			<button onclick={onClose} disabled={isSaving || isPageReloading} class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
			<button 
				onclick={handleSave} 
				disabled={!isFormValid || isSaving || isPageReloading} 
				class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
				{#if isSaving || isPageReloading}
					<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
				{/if}
				Save Assessment
			</button>
		</div>
	</div>
</div>
{/if}

