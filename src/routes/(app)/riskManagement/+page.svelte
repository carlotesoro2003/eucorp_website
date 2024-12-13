<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";    
    import Table from "$lib/components/riskManagement-table/Table.svelte";

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

    let likelihoodRating: LikelihoodRating[] = [];
    let severity: Severity[] = [];
    let riskControlRating: RiskControlRating[] = [];
    let riskMonitoringRating: RiskMonitoringRating[] = [];

    let isLoading = false;
    let errorMessage: string | null = null;
    let selectedDataType: string = "likelihoodRating"; // Tracks the selected data type

    const fetchLikelihoodRating = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('likelihood_rating').select('*');

        if (error) {
            console.error('Error fetching likelihood rating:', error);
            errorMessage = "Failed to fetch likelihood rating.";
        } else {
            likelihoodRating = data;
        }

        isLoading = false;
    };

    const fetchSeverity = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('severity').select('*');

        if (error) {
            console.error('Error fetching severity:', error);
            errorMessage = "Failed to fetch severity.";
        } else {
            severity = data;
        }

        isLoading = false;
    };

    const fetchRiskControlRating = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('risk_control_rating').select('*');

        if (error) {
            console.error('Error fetching risk control rating:', error);
            errorMessage = "Failed to fetch risk control rating.";
        } else {
            riskControlRating = data;
        }

        isLoading = false;
    };

    const fetchRiskMonitoringRating = async () => {
        isLoading = true;
        const { data, error } = await supabase.from('risk_monitoring_rating').select('*');

        if (error) {
            console.error('Error fetching risk monitoring rating:', error);
            errorMessage = "Failed to fetch risk monitoring rating.";
        } else {
            riskMonitoringRating = data;
        }

        isLoading = false;
    };

    onMount(() => {
        fetchLikelihoodRating();
        fetchSeverity();
        fetchRiskControlRating();
        fetchRiskMonitoringRating();
    });
</script>

<main class="container mx-auto min-h-screen p-4">
    <Table />
  </main>