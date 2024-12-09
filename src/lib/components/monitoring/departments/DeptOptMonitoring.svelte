<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { writable, get } from "svelte/store";

  interface MonitoringOpportunity {
    opt_id: number;
    opt_statement: string;
    kpi: string;
    planned_actions: string;
    time_completed: string | null;
    evaluation: string;
    statement: string | null;
  }

  let opportunities: MonitoringOpportunity[] = [];
  let profileId: string | null = null;
  let isLoading = false;

  let goals = writable<
    {
      id: number;
      statement: string;
      goal: string;
      evaluation: string;
      achieved: string | null;
      isLoading: boolean;
      timeCompleted: string | null;
      aiStatement: string | null;
    }[]
  >([]);

  let showDialog = false;
  let dialogStatement = "";

  function openDialog(statement: string) {
    dialogStatement = statement;
    showDialog = true;
  }

  const fetchUserProfile = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      console.error("Error fetching session:", error);
      return;
    }

    const { user } = session;
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (profileError || !profileData) {
      console.error("Error fetching profile:", profileError);
      return;
    }

    profileId = profileData.id;
  };

  const fetchOpportunities = async () => {
    isLoading = true;
    try {
      // Fetch the logged-in user's department
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("department_id")
        .eq("id", profileId)
        .single();

      if (profileError || !userProfile?.department_id) {
        console.error(
          "Error fetching user profile or department:",
          profileError
        );
        return;
      }

      const deptId = userProfile.department_id;

      // Fetch profile IDs in the same department
      const { data: profileIds, error: profileIdsError } = await supabase
        .from("profiles")
        .select("id")
        .eq("department_id", deptId);

      if (profileIdsError) {
        console.error("Error fetching profile IDs:", profileIdsError);
        return;
      }

      const profileIdList = profileIds.map((profile) => profile.id);

      // Fetch opportunities for profiles in the same department
      const { data, error } = await supabase
        .from("opt_monitoring")
        .select(
          `
        opt_id,
        time_completed,
        evaluation,
        statement,
        opportunities (opt_statement, kpi, planned_actions)
      `
        )
        .in("profile_id", profileIdList); // Filter by profiles in the same department

      if (error) {
        console.error("Error fetching opportunities:", error);
        return;
      }

      // Map the opportunities data
      opportunities = data.map((monitoringItem: any) => ({
        opt_id: monitoringItem.opt_id,
        opt_statement:
          monitoringItem.opportunities?.opt_statement || "No Statement",
        kpi: monitoringItem.opportunities?.kpi || "No KPI",
        planned_actions:
          monitoringItem.opportunities?.planned_actions || "No Actions Taken",
        time_completed: monitoringItem.time_completed,
        evaluation: monitoringItem.evaluation || "",
        statement: monitoringItem.statement || null,
      }));

      const mappedOpportunities = opportunities.map((opportunity) => ({
        id: opportunity.opt_id,
        statement: opportunity.opt_statement,
        goal: opportunity.kpi,
        evaluation: opportunity.evaluation || "",
        achieved: opportunity.time_completed ? "Achieved" : null,
        isLoading: false,
        timeCompleted: opportunity.time_completed,
        aiStatement: opportunity.statement || null,
      }));

      goals.set(mappedOpportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      isLoading = false;
    }
  };

  // Evaluate a single goal using the AI POST endpoint
  async function evaluateGoal(id: number, goal: string, evaluation: string) {
    // Update the isLoading state for this goal
    goals.update((currentGoals) =>
      currentGoals.map((g) => (g.id === id ? { ...g, isLoading: true } : g))
    );

    try {
      // Send the request to the AI API
      const response = await fetch("/api/evaluate-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: goal, evaluation }),
      });

      const data = await response.json();

      // Handle errors from the server
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to evaluate goal.");
      }

      const aiEvaluation = data.aiEvaluation;

      // Log the AI evaluation for debugging
      console.log("[DEBUG] AI Evaluation:", aiEvaluation);

      // Ensure aiEvaluation is a string
      if (typeof aiEvaluation !== "string") {
        throw new TypeError("AI evaluation response is not a valid string.");
      }

      // Check if the AI evaluation indicates the goal was achieved
      const negativeKeywords = [
        "not achieved",
        "unsuccessful",
        "failed",
        "incomplete",
        "fell short",
        "below target",
        "did not meet",
        "not",
        "not been achieved",
      ];
      const isAchieved = !negativeKeywords.some((neg) =>
        aiEvaluation.toLowerCase().includes(neg)
      );

      const timeCompleted = isAchieved ? new Date().toISOString() : null;

      // Update the database with the result
      const { error } = await supabase
        .from("opt_monitoring")
        .update({
          time_completed: timeCompleted,
          evaluation,
          statement: aiEvaluation,
          is_accomplished: isAchieved,
        })
        .eq("opt_id", id);

      if (error) {
        console.error("[ERROR] Error updating opt_monitoring:", error);
      } else {
        // Update the local goals store
        goals.update((currentGoals) =>
          currentGoals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  achieved: isAchieved ? "Achieved" : "Not Achieved",
                  isLoading: false,
                  timeCompleted,
                  aiStatement: aiEvaluation,
                }
              : g
          )
        );
      }
    } catch (error) {
      console.error("[ERROR] Error evaluating goal:", error);
      // Reset the isLoading state on error
      goals.update((currentGoals) =>
        currentGoals.map((g) => (g.id === id ? { ...g, isLoading: false } : g))
      );
    }
  }

  // Evaluate all goals using the AI POST_SUMMARY endpoint
  async function evaluateAllGoals() {
    const allGoals = get(goals);
    const monitoringData = allGoals.map((goal) => ({
      opt_statement: goal.statement,
      kpi: goal.goal,
      achieved: goal.achieved === "Achieved",
      evaluation: goal.evaluation,
    }));

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monitoringData }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate summary.");
      }

      console.log("Summary Report:", data.summaryReport);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  }

  function handleInput(id: number, field: "evaluation", value: string) {
    goals.update((currentGoals) =>
      currentGoals.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  }

  function autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.width = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    textarea.style.width = `${textarea.scrollWidth + 20}px`; // Adds padding
  }

  onMount(async () => {
    await fetchUserProfile();
    await fetchOpportunities();
  });
</script>

<!-- Page Layout -->
<div class="min-h-screen p-8">
  <h1 class="text-3xl font-bold mb-6">Mid-Year Opportunity Monitoring</h1>
  <button
    on:click={evaluateAllGoals}
    class="btn bg-indigo-500 hover:bg-indigo-600 text-white font-medium mb-6"
  >
    Evaluate All Opportunities
  </button>

  {#if isLoading}
    <div class="text-center text-xl">
      <span class="loading loading-spinner text-primary"></span>
      Loading Opportunities...
    </div>
  {:else}
  {#if $goals.length === 0}
    <p class="text-center text-lg">No opportunities found.</p>
  {:else}
    <div class="overflow-x-auto shadow-lg rounded-lg">
      <table class="table-auto w-full text-left text-sm border-collapse">
        <thead class="uppercase text-xs">
          <tr>
            <th class="px-4 py-3">Opportunity Statement</th>
            <th class="px-4 py-3">Target (KPI)</th>
            <th class="px-4 py-3">Actions Taken to Achieve Opportunities</th>
            <th class="px-4 py-3">Achieved</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each $goals as { id, statement, goal, evaluation, achieved, isLoading, timeCompleted, aiStatement }}
            <tr class="hover border-b">
              <td class="px-4 py-3">{statement}</td>
              <td class="px-4 py-3">{goal}</td>
              <td class="px-4 py-3">
                <textarea
                  class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder="Enter your evaluation"
                  value={evaluation}
                  on:input={(e) => {
                    handleInput(
                      id,
                      "evaluation",
                      (e.target as HTMLTextAreaElement).value
                    );
                    autoResize(e);
                  }}
                  style="overflow:hidden; resize:none; min-width: 200px;"
                  disabled={achieved === "Achieved"}
                ></textarea>
              </td>
              <td class="px-4 py-3">
                {#if isLoading}
                  <span class="loading loading-spinner text-primary"></span>
                {:else if achieved === "Achieved"}
                  Achieved on {timeCompleted
                    ? new Date(timeCompleted).toLocaleDateString()
                    : "N/A"}
                {:else if achieved === "Not Achieved"}
                  Not Achieved
                {:else}
                  Pending
                {/if}
              </td>
              <td class="px-4 py-3">
                {#if isLoading}
                  <span class="loading loading-spinner text-primary"></span>
                {:else if achieved === "Achieved"}
                  <button class="btn btn-success btn-sm" disabled>
                    Achieved
                  </button>
                {:else}
                  <button
                    on:click={() => evaluateGoal(id, goal, evaluation)}
                    class="btn btn-success btn-sm"
                    disabled={!evaluation || isLoading}
                  >
                    Evaluate
                  </button>
                {/if}
                {#if aiStatement}
                  <button
                    on:click={() => openDialog(aiStatement)}
                    class="btn btn-primary btn-sm ml-2"
                  >
                    View Statement
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if showDialog}
      <div
        class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-lg font-bold mb-4">AI Evaluation Statement</h2>
          <p class="mb-4">{dialogStatement}</p>
          <button
            on:click={() => (showDialog = false)}
            class="btn bg-indigo-500 hover:bg-indigo-600 text-white w-full"
          >
            Close
          </button>
        </div>
      </div>
    {/if}
  {/if}
  {/if}
</div>
