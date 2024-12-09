<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  interface ActionPlan {
    id: number;
    actions_taken: string;
    kpi: string;
    objective_id: number;
    strategic_goal_name: string;
    objective_name: string;
    is_accomplished: boolean;
    evaluation: string | null;
    statement: string | null;
    time_completed: string | null;
    isLoading: boolean;
  }

  const actionPlans = writable<ActionPlan[]>([]);
  let profileId: string | null = null;
  let showDialog = false;
  let dialogStatement = "";
  let isLoadingPage = true;

  function openDialog(statement: string) {
    dialogStatement = statement;
    showDialog = true;
  }

  // Fetch the logged-in user's profile
  const fetchUserProfile = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      console.error("Error fetching session:", error);
      return;
    }

    profileId = session.user.id;
  };

  // Fetch action plans and related monitoring data based on department

  const fetchActionPlans = async () => {
  try {
    // Get the logged-in user's profile and department
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("department_id")
      .eq("id", profileId)
      .single();

    if (profileError || !userProfile?.department_id) {
      console.error("Error fetching user profile or department:", profileError);
      return;
    }

    const deptId = userProfile.department_id;

    // Fetch action plans for users in the same department where is_approved is true
    const { data: profileIds, error: profileIdsError } = await supabase
      .from("profiles")
      .select("id")
      .eq("department_id", deptId);

    if (profileIdsError) {
      console.error("Error fetching profile IDs:", profileIdsError);
      return;
    }

    const profileIdList = profileIds.map((profile) => profile.id);

    const { data, error } = await supabase
      .from("action_plans")
      .select(`
        id,
        actions_taken,
        kpi,
        objective_id,
        strategic_objectives (
          name,
          strategic_goals (name)
        ),
        is_approved
      `)
      .in("profile_id", profileIdList)
      .eq("is_approved", true); // Filter only approved action plans

    if (error) {
      console.error("Error fetching action plans:", error);
      return;
    }

    const plans = data.map((plan: any) => ({
      id: plan.id,
      actions_taken: plan.actions_taken,
      kpi: plan.kpi,
      objective_id: plan.objective_id,
      strategic_goal_name: plan.strategic_objectives?.strategic_goals?.name || "No Goal Assigned",
      objective_name: plan.strategic_objectives?.name || "No Objective Assigned",
      is_accomplished: false,
      evaluation: null,
      statement: null,
      time_completed: null,
      isLoading: false,
    }));

    // Fetch related monitoring data
    const monitoringData = await fetchPlanMonitoringData(plans.map((p) => p.id));

    actionPlans.set(
      plans.map((plan) => {
        const monitoring = monitoringData.find((m) => m.action_plan_id === plan.id);
        return {
          ...plan,
          is_accomplished: monitoring?.is_accomplished || false,
          evaluation: monitoring?.evaluation || null,
          statement: monitoring?.statement || null,
          time_completed: monitoring?.time_completed || null,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoadingPage = false;
  }
  };


  // Fetch monitoring data for action plans
  const fetchPlanMonitoringData = async (planIds: number[]) => {
    try {
      const { data, error } = await supabase
        .from("plan_monitoring")
        .select("action_plan_id, is_accomplished, evaluation, statement, time_completed")
        .in("action_plan_id", planIds);

      if (error) {
        console.error("Error fetching monitoring data:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      return [];
    }
  };

  // Evaluate a single action plan using AI
  const evaluateActionPlan = async (id: number, kpi: string, evaluation: string) => {
    actionPlans.update((plans) =>
      plans.map((plan) => (plan.id === id ? { ...plan, isLoading: true } : plan))
    );

    try {
      const response = await fetch("/api/evaluate-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: kpi, evaluation }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to evaluate action plan.");
      }

      const aiEvaluation = data.aiEvaluation;

      if (typeof aiEvaluation !== "string") {
        throw new TypeError("AI evaluation response is not a valid string.");
      }

      const negativeKeywords = [
        "not achieved",
        "unsuccessful",
        "failed",
        "incomplete",
        "fell short",
        "below target",
        "did not meet",
        "not",
      ];

      const isAccomplished = !negativeKeywords.some((neg) =>
        aiEvaluation.toLowerCase().includes(neg)
      );
      const timeCompleted = isAccomplished ? new Date().toISOString() : null;

      // Update the database with the AI result
      const { error } = await supabase
        .from("plan_monitoring")
        .update({
          evaluation,
          statement: aiEvaluation,
          is_accomplished: isAccomplished,
          time_completed: timeCompleted,
        })
        .eq("action_plan_id", id);

      if (error) {
        console.error("[ERROR] Error updating plan monitoring:", error);
      }

      // Update the local state
      actionPlans.update((plans) =>
        plans.map((plan) =>
          plan.id === id
            ? {
                ...plan,
                is_accomplished: isAccomplished,
                evaluation,
                statement: aiEvaluation,
                time_completed: timeCompleted,
                isLoading: false,
              }
            : plan
        )
      );
    } catch (error) {
      console.error("[ERROR] Error evaluating action plan:", error);
      actionPlans.update((plans) =>
        plans.map((plan) => (plan.id === id ? { ...plan, isLoading: false } : plan))
      );
    }
  };

  const autoResize = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  onMount(async () => {
    await fetchUserProfile();
    await fetchActionPlans();
  });
</script>

<!-- HTML Structure -->
<div class="min-h-screen p-8">
  <h1 class="text-3xl font-bold mb-6">Plans Monitoring</h1>

  {#if isLoadingPage}
    <div class="text-center text-xl">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {:else if $actionPlans.length > 0 }
    <div class="overflow-x-auto shadow-lg rounded-lg">
      <table class="table-auto w-full text-left text-sm border-collapse">
        <thead class="uppercase text-xs">
          <tr>
            <th class="px-4 py-3">Strategic Goal</th>
            <th class="px-4 py-3">Objective Name</th>
            <th class="px-4 py-3">Actions Taken</th>
            <th class="px-4 py-3">KPI</th>
            <th class="px-4 py-3">Actions Taken to Achieve Action Plan</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Remarks</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each $actionPlans as plan}
            <tr class="hover border-b">
              <td class="px-4 py-3">{plan.strategic_goal_name}</td>
              <td class="px-4 py-3">{plan.objective_name}</td>
              <td class="px-4 py-3">{plan.actions_taken}</td>
              <td class="px-4 py-3">{plan.kpi}</td>
              <td class="px-4 py-3">
                <textarea
                  class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder="Enter evaluation..."
                  value={plan.evaluation}
                  on:input={(e) => {
                    actionPlans.update((plans) =>
                      plans.map((p) =>
                        p.id === plan.id
                          ? { ...p, evaluation: (e.target as HTMLTextAreaElement).value }
                          : p
                      )
                    );
                    autoResize(e);
                  }}
                  disabled={plan.is_accomplished}
                ></textarea>
              </td>
              <td class="px-4 py-3">
                {#if plan.is_accomplished}
                  Achieved on {plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A"}
                {:else}
                  Not Achieved
                {/if}
              </td>
              <td class="px-4 py-3">
                {#if plan.statement}
                <button
                  on:click={() => openDialog(plan.statement || "")}
                  class="btn btn-primary btn-sm ml-2"
                >
                  View Statement
                </button>
              {/if}
              </td>
              <td class="px-4 py-3">
                {#if plan.isLoading}
                  <span class="loading loading-spinner text-primary"></span>
                {:else if plan.is_accomplished}
                  <button class="btn btn-success btn-sm" disabled>Achieved</button>
                {:else}
                  <button
                    on:click={() => evaluateActionPlan(plan.id, plan.kpi, plan.evaluation || "")}
                    class="btn btn-success btn-sm"
                    disabled={!plan.evaluation || plan.isLoading}
                  >
                    Evaluate
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div>No action plans found for this user.</div>
  {/if}

  {#if showDialog}
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Evaluation Statement</h2>
        <p class="mb-4">{dialogStatement}</p>
        <button on:click={() => (showDialog = false)} class="btn bg-indigo-500 hover:bg-indigo-600 text-white w-full">
          Close
        </button>
      </div>
    </div>
  {/if}
</div>


