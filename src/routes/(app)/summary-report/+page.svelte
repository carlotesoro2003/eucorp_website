<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { ClipboardList, AlertTriangle, Lightbulb } from "lucide-svelte";
  import PlanSummary from "$lib/components/summary-report/PlanSummary.svelte";
  import RiskSummary from "$lib/components/summary-report/RiskSummary.svelte";
  import OpportunitySummary from "$lib/components/summary-report/OpportunitySummary.svelte";

  let loading = true;
  let activeTab = "Plans";

  const tabs = [
    { id: "Plans", label: "Plans", icon: ClipboardList },
    { id: "Risks", label: "Risks", icon: AlertTriangle },
    { id: "Opportunities", label: "Opportunities", icon: Lightbulb },
  ];

  
</script>

<div class="min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-2">
      <ClipboardList class="w-6 h-6 text-primary"/>
      <h1 class="text-2xl font-bold">Summary Report</h1>
      </div>
    </div>

    <div class="rounded-lg shadow-sm mb-6">
      <div class="flex flex-wrap gap-2 p-2">
        {#each tabs as tab}
          <button
            onclick={() => (activeTab = tab.id)}
            class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === tab.id ? 'bg-primary hover:bg-primary/90 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}"
          >
            <svelte:component this={tab.icon} size={18} />
            <span>{tab.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="rounded-lg shadow-sm p-6"> 
      {#if activeTab === "Plans"}
        <PlanSummary />
      {:else if activeTab === "Risks"}
        <RiskSummary />
      {:else}
        <OpportunitySummary />
      {/if}
    </div>
  </div>
</div>
  