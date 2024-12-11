<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import RiskTable from "$lib/components/dept-risks-table/risk-assessment-table/RiskTable.svelte";
	import AssessmentDialog from "$lib/components/dept-risks-table/risk-assessment-table/AssessmentDialog.svelte";
	import Notifications from "$lib/components/dept-risks-table/risk-assessment-table/Notifications.svelte";
	import Header from "$lib/components/dept-risks-table/risk-assessment-table/Header.svelte";
	import type { Risk, Classification, LikelihoodRating, Severity, RiskControlRating, RiskMonitoringRating, RiskAssessment } from "$lib/types/RiskTypes";
  
	// State variables
	let risks: Risk[] = $state([]);
	let savedRisks: Risk[] = $state([]);
	let riskAssessments: RiskAssessment[] = $state([]);
	let classification: Classification[] = $state([]);
	let likelihoodRating: LikelihoodRating[] = $state([]);
	let severity: Severity[] = $state([]);
	let riskControlRating: RiskControlRating[] = $state([]);
	let riskMonitoringRating: RiskMonitoringRating[] = $state([]);

	let session: any = $state(null);
	let profile: any = $state(null);
	let departmentName: string = $state("");
	let isLoading: boolean = $state(true);

	let successMessage: string | null = $state(null);
	let errorMessage: string | null = $state(null);

	// Dialog state
	let showDialog: boolean = $state(false);
	let selectedRisk: Risk | null = $state(null);

  

	// Fetch all data
	const fetchAllData = async () => {
		try {
			await Promise.all([fetchRisks(), fetchRiskAssessments(), fetchClassification(), fetchLikelihoodRating(), fetchSeverity(), fetchRiskControlRating(), fetchRiskMonitoringRating()]);
		} catch (error) {
			errorMessage = "Failed to fetch data. Please refresh the page.";
		}
	};

	// Individual fetch functions (same as your original code)
	const fetchClassification = async () => {
		const { data, error } = await supabase.from("classification").select("*");
		if (error) throw error;
		classification = data;
	};

	// ... (other fetch functions remain the same)
  const fetchLikelihoodRating = async () => {
    try {
      const { data, error } = await supabase
        .from("likelihood_rating")
        .select("*");
      if (error) throw error;
      likelihoodRating = data;
    } catch (error) {
      errorMessage = "Failed to fetch likelihood rating.";
    }
  };

  const fetchSeverity = async () => {
    try {
      const { data, error } = await supabase.from("severity").select("*");
      if (error) throw error;
      severity = data;
    } catch (error) {
      errorMessage = "Failed to fetch severity.";
    }
  };

  const fetchRiskControlRating = async () => {
    try {
      const { data, error } = await supabase
        .from("risk_control_rating")
        .select("*");
      if (error) throw error;
      riskControlRating = data;
    } catch (error) {
      errorMessage = "Failed to fetch risk control rating.";
    }
  };

  const fetchRiskMonitoringRating = async () => {
    try {
      const { data, error } = await supabase
        .from("risk_monitoring_rating")
        .select("*");
      if (error) throw error;
      riskMonitoringRating = data;
    } catch (error) {
      errorMessage = "Failed to fetch risk monitoring rating.";
    }
  };

  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("*")
        .order("rrn", { ascending: true });
      if (error) throw error;
      savedRisks = data;
    } catch (error) {
      errorMessage = "Failed to fetch saved risks.";
    }
  };

  const fetchRiskAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from("risk_assessment")
        .select("*");
      if (error) throw error;
      riskAssessments = data;
    } catch (error) {
      errorMessage = "Failed to fetch risk assessments.";
    }
  };


	const fetchUserProfile = async () => {
		isLoading = true;
		try {
			const { data: sessionData } = await supabase.auth.getSession();
			session = sessionData.session;

			if (session) {
				const { data: profileData } = await supabase.from("profiles").select("id, department_id").eq("id", session.user.id).single();
				profile = profileData;

				const { data: departmentData } = await supabase.from("departments").select("name").eq("id", profile.department_id).single();
				departmentName = departmentData ? departmentData.name : "Unknown Department";

				await fetchAllData();
			}
		} catch (error) {
			errorMessage = "Failed to load profile. Please try again.";
		} finally {
			isLoading = false;
		}
	};

	// Dialog handlers
	const handleOpenDialog = (risk: Risk) => {
		selectedRisk = risk;
		showDialog = true;
	};

	const handleCloseDialog = () => {
		showDialog = false;
		selectedRisk = null;
	};

	// Message handlers
	const handleSuccess = (message: string) => {
		successMessage = message;

		setTimeout(() => (successMessage = null), 3000);
	};


	const handleError = (message: string) => {
		errorMessage = message;
		setTimeout(() => (errorMessage = null), 3000);
	};

	onMount(() => {
		fetchUserProfile();
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<Header {departmentName} />

	<main class="container mx-auto px-4 py-8">
		<Notifications {successMessage} {errorMessage} />

		{#if isLoading}
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
		{:else}
			<RiskTable {savedRisks} {classification} {riskAssessments} onAssess={handleOpenDialog} />

			{#if showDialog}
			<AssessmentDialog
				{selectedRisk}
				{likelihoodRating}
				{severity}
				{riskControlRating}
				{riskMonitoringRating}
				onClose={handleCloseDialog}
				onSuccess={handleSuccess}
				onError={handleError}
			/>
			{/if}
		{/if}
	</main>
</div>
