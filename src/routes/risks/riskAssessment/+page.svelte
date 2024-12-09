<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  // Interfaces
  interface Risk {
    id: string;
    rrn: string;
    risk_statement: string;
    classification: number | null;
    actions: string;
    key_persons: string;
    budget: number;
    profile_id: string;
  }

  interface Classification {
    id: number;
    name: string;
  }

  interface LikelihoodRating {
    id: number;
    name: string;
    symbol: string;
  }

  interface Severity {
    id: number;
    name: string;
    value: number;
  }

  interface RiskControlRating {
    id: number;
    name: string;
    symbol: string;
  }

  interface RiskMonitoringRating {
    id: number;
    status: string;
  }

  interface RiskAssessment {
    risk_id: string;
    likelihoodRating: number | null;
    severity: number | null;
    riskControlRating: number | null;
    riskMonitoringRating: number | null;
  }

  // Variables
  let risks: Risk[] = [];
  let savedRisks: Risk[] = [];
  let riskAssessments: RiskAssessment[] = [];
  let classification: Classification[] = [];
  let likelihoodRating: LikelihoodRating[] = [];
  let severity: Severity[] = [];
  let riskControlRating: RiskControlRating[] = [];
  let riskMonitoringRating: RiskMonitoringRating[] = [];
  let isCalculatingRiskControlRating = false;

  let session: any = null;
  let profile: any = null;
  let departmentName = "";
  let isLoading = true;

  let successMessage: string | null = null;
  let errorMessage: string | null = null;

  // Dialog state
  let showDialog = false;
  let selectedRisk: Risk | null = null;
  let newRiskAssessment: RiskAssessment = {
    risk_id: "",
    likelihoodRating: null,
    severity: null,
    riskControlRating: null,
    riskMonitoringRating: null,
  };

  // Fetch functions
  const fetchClassification = async () => {
    try {
      const { data, error } = await supabase.from("classification").select("*");
      if (error) throw error;
      classification = data;
    } catch (error) {
      errorMessage = "Failed to fetch classification.";
    }
  };

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
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, department_id")
          .eq("id", session.user.id)
          .single();
        profile = profileData;

        const { data: departmentData } = await supabase
          .from("departments")
          .select("name")
          .eq("id", profile.department_id)
          .single();
        departmentName = departmentData ? departmentData.name : "Unknown Department";

        await fetchRisks();
        await fetchRiskAssessments();
        await fetchClassification();
        await fetchLikelihoodRating();
        await fetchSeverity();
        await fetchRiskControlRating();
        await fetchRiskMonitoringRating();
      } else {
        errorMessage = "User is not logged in.";
      }
    } catch (error) {
      errorMessage = "Failed to fetch profile or department details.";
    } finally {
      isLoading = false;
    }
  };

  // Utility functions
  function getRiskControlRating(
    likelihoodSymbol: string,
    severityValue: number
  ): string {
    const likelihoodMapping: { [key: string]: number } = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
    };

    const ratingMatrix: string[][] = [
      ["M", "H", "H", "VH", "VH"],
      ["L", "M", "H", "H", "VH"],
      ["L", "L", "M", "H", "H"],
      ["L", "L", "M", "M", "H"],
      ["L", "L", "L", "M", "M"],
    ];

    const likelihoodIndex = likelihoodMapping[likelihoodSymbol] - 1;
    const severityIndex = severityValue - 1;

    if (
      likelihoodIndex < 0 ||
      likelihoodIndex > 4 ||
      severityIndex < 0 ||
      severityIndex > 4
    ) {
      throw new Error("Invalid likelihood symbol or severity value.");
    }

    return ratingMatrix[likelihoodIndex][severityIndex];
  }

  function calculateRiskControlRating() {
    if (newRiskAssessment.likelihoodRating && newRiskAssessment.severity) {
      const likelihood = likelihoodRating.find(
        (rating) => rating.id === newRiskAssessment.likelihoodRating
      )?.symbol;

      const severityValue = severity.find(
        (sev) => sev.id === newRiskAssessment.severity
      )?.value;

      if (likelihood && severityValue) {
        const ratingSymbol = getRiskControlRating(likelihood, severityValue);
        const matchingRating = riskControlRating.find(
          (rating) => rating.symbol === ratingSymbol
        );

        newRiskAssessment.riskControlRating = matchingRating
          ? matchingRating.id
          : null;
      } else {
        newRiskAssessment.riskControlRating = null;
      }
    } else {
      newRiskAssessment.riskControlRating = null;
    }
  }

  // Watch for changes in inputs and trigger calculation
  $: if (
    newRiskAssessment.likelihoodRating !== null &&
    newRiskAssessment.severity !== null
  ) {
    calculateRiskControlRating();
  }

  // Event Handlers
  const openRiskAssessmentDialog = (risk: Risk) => {
    selectedRisk = risk;
    showDialog = true;
  };

  const closeRiskAssessmentDialog = () => {
    showDialog = false;
    selectedRisk = null;
  };

  const saveRiskAssessment = async () => {
    if (!newRiskAssessment.riskControlRating) {
      errorMessage = "Risk Control Rating is not calculated.";
      return;
    }

    const { error } = await supabase.from("risk_assessment").insert({
      risk_id: selectedRisk?.id,
      lr: newRiskAssessment.likelihoodRating,
      s: newRiskAssessment.severity,
      rcr: newRiskAssessment.riskControlRating,
      rmr: newRiskAssessment.riskMonitoringRating,
    });

    if (error) {
      errorMessage = "Failed to save risk assessment.";
    } else {
      successMessage = "Risk assessment saved!";
      fetchRiskAssessments();
    }

    closeRiskAssessmentDialog();
  };

  onMount(() => {
    fetchUserProfile();
  });
</script>

<div>
  <h1 class="text-3xl font-bold">{departmentName} Risks Register</h1>

  {#if successMessage}
    <p class="text-green-400 my-2">{successMessage}</p>
  {/if}
  {#if errorMessage}
    <p class="text-red-400 my-2">{errorMessage}</p>
  {/if}

  <h2 class="text-2xl font-bold mt-8">All Saved Risks</h2>
  <table class="table table-zebra w-full mt-4">
    <thead>
      <tr>
        <th>RRN</th>
        <th>Risk Statement</th>
        <th>Classification</th>
        <th>Actions</th>
        <th>Key Persons</th>
        <th>Budget</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each savedRisks as risk}
        <tr>
          <td>{risk.rrn}</td>
          <td>{risk.risk_statement}</td>
          <td>
            {classification.find((cls) => cls.id === risk.classification)
              ?.name || "N/A"}
          </td>
          <td>{risk.actions}</td>
          <td>{risk.key_persons}</td>
          <td>{risk.budget}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              on:click={() => openRiskAssessmentDialog(risk)}
              disabled={riskAssessments.some((ra) => ra.risk_id === risk.id)}
            >
              Add Assessment
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if showDialog}
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">
          Add Risk Assessment for {selectedRisk?.rrn}
        </h3>

        <label class="label" for="likelihoodRating">Likelihood Rating</label>
        <select
          id="likelihoodRating"
          bind:value={newRiskAssessment.likelihoodRating}
          class="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled>Select likelihood</option>
          {#each likelihoodRating as rating}
            <option value={rating.id}>{rating.symbol} - {rating.name}</option>
          {/each}
        </select>

        <label class="label mt-2" for="severity">Severity</label>
        <select
          id="severity"
          bind:value={newRiskAssessment.severity}
          class="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled>Select severity</option>
          {#each severity as sev}
            <option value={sev.id}>{sev.value} - {sev.name}</option>
          {/each}
        </select>

        <label class="label mt-2" for="riskControlRating">Risk Control Rating</label>
        <div>
          {#if isCalculatingRiskControlRating}
            <div class="flex items-center">
              <p>Calculating Risk Control Rating...</p>
              <div class="ml-2 spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></div>
            </div>
          {:else if newRiskAssessment.riskControlRating}
            <p class="text-lg font-bold">
              {#if riskControlRating.find(r => r.id === newRiskAssessment.riskControlRating)}
                {riskControlRating.find(r => r.id === newRiskAssessment.riskControlRating)?.symbol || "N/A"} - 
                {riskControlRating.find(r => r.id === newRiskAssessment.riskControlRating)?.name || "N/A"}
              {/if}
            </p>
          {:else}
            <p class="text-gray-500">No Risk Control Rating available</p>
          {/if}
        </div>

        <label class="label mt-2" for="riskMonitoringRating">Risk Monitoring Rating</label>
        <select
          id="riskMonitoringRating"
          bind:value={newRiskAssessment.riskMonitoringRating}
          class="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled>Select monitoring rating</option>
          {#each riskMonitoringRating as rating}
            {#if rating.status === "New Risk"}
              <option value={rating.id}>{rating.status}</option>
            {/if}
          {/each}
        </select>

        <div class="modal-action">
          <button class="btn btn-primary" on:click={saveRiskAssessment}>Save</button>
          <button class="btn" on:click={closeRiskAssessmentDialog}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
</div>
