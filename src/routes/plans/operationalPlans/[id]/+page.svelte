<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  interface ActionPlan {
    actions_taken: string;
    kpi: string;
    target_output: string;
    key_person_responsible: string;
    objective_id: number;
    profile_id: string;
    department_id: string;
  }

  interface StrategicObjective {
    name: string;
    strategic_goal_id: number;
  }

  interface StrategicGoal {
    name: string;
    goal_no: number;
  }

  let actionPlans: ActionPlan[] = [
    {
      actions_taken: "",
      kpi: "",
      target_output: "",
      key_person_responsible: "",
      objective_id: 0,
      profile_id: "",
      department_id: "",
    },
  ];

  let newActionPlan = {
    actions_taken: "",
    kpi: "",
    target_output: "",
    key_person_responsible: "",
    objective_id: 0,
    profile_id: "", // Default value
    department_id: "", // Add department_id property
  };

  let strategicObjective: StrategicObjective | null = null;
  let strategicGoal: StrategicGoal | null = null;
  let alertMessage = "";
  let alertType = "info";
  let objective_id: number | null = null;
  let isSubmitting = false;

  // Fetch profile_id from logged-in user
  let profile_id: string = "";

  onMount(() => {
    const { params } = $page;
    objective_id = parseInt(params.id);

    if (objective_id) {
      newActionPlan.objective_id = objective_id;
      actionPlans[0].objective_id = objective_id;

      // Fetch the strategic objective and related goal
      fetchStrategicObjectiveAndGoal(objective_id);
      fetchUserProfileId(); // Fetch profile_id of the logged-in user
    } else {
      showAlert("Objective ID is missing.", "error");
    }
  });

  const fetchUserProfileId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profileData, error } = await supabase
            .from("profiles")
            .select("id, department_id")
            .eq("id", user.id)
            .single();

        if (error || !profileData) {
            console.error("Error fetching profile details:", error);
            showAlert("Failed to fetch user profile details.", "error");
            return;
        }

        profile_id = profileData.id;
        newActionPlan.profile_id = profile_id; // Assign to newActionPlan
        actionPlans[0].profile_id = profile_id; // Assign to initial action plan

        // Assign the department_id to newActionPlan and initial action plan
        actionPlans.forEach(plan => plan.department_id = profileData.department_id);
        newActionPlan.department_id = profileData.department_id;
    } else {
        showAlert("User not logged in.", "error");
    }
};


  const fetchStrategicObjectiveAndGoal = async (objective_id: number) => {
    try {
      // Fetch Strategic Objective
      const { data: objectiveData, error: objectiveError } = await supabase
        .from("strategic_objectives")
        .select("name, strategic_goal_id")
        .eq("id", objective_id)
        .single();

      if (objectiveError || !objectiveData) {
        console.error("Error fetching strategic objective:", objectiveError);
        showAlert("Failed to fetch strategic objective.", "error");
        return;
      }

      strategicObjective = objectiveData;

      // Fetch Strategic Goal
      const { data: goalData, error: goalError } = await supabase
        .from("strategic_goals")
        .select("name, goal_no")
        .eq("id", objectiveData.strategic_goal_id)
        .single();

      if (goalError || !goalData) {
        console.error("Error fetching strategic goal:", goalError);
        showAlert("Failed to fetch strategic goal.", "error");
        return;
      }

      strategicGoal = goalData;
    } catch (err) {
      console.error("Error fetching strategic objective or goal:", err);
      showAlert("An error occurred while fetching strategic data.", "error");
    }
  };

  const addRow = () => {
    actionPlans = [...actionPlans, { ...newActionPlan }];
  };

  const deleteRow = (index: number) => {
    actionPlans = actionPlans.filter((_, i) => i !== index);
  };

  const updateField = (index: number, field: keyof ActionPlan, value: string) => {
    actionPlans = actionPlans.map((plan, i) =>
      i === index ? { ...plan, [field]: value } : plan
    );
  };

  const submitActionPlans = async () => {
    if (actionPlans.length === 0) {
        showAlert("Please add at least one action plan.", "warning");
        return;
    }

    const plansToSubmit = actionPlans.map((plan) => ({
        ...plan,
        profile_id: profile_id || newActionPlan.profile_id, // Include profile_id
        department_id: plan.department_id || newActionPlan.department_id, // Include department_id
        objective_id: plan.objective_id || newActionPlan.objective_id,
    }));

    try {
        isSubmitting = true;
        const { data, error } = await supabase
            .from("action_plans")
            .insert(plansToSubmit);

        if (error) {
            console.error("Error submitting action plans:", error.message);
            showAlert("Failed to submit action plans.", "error");
        } else {
            console.log("Action plans submitted successfully:", data);
            showAlert("Action plans submitted successfully.", "success");
            actionPlans = []; // Clear the form after submission
        }
    } catch (err) {
        console.error("Error submitting action plans:", err);
        showAlert("An error occurred while submitting action plans.", "error");
    } finally {
        isSubmitting = false;
    }
};


  const showAlert = (message: string, type: string) => {
    alertMessage = message;
    alertType = type;
    setTimeout(() => {
      alertMessage = "";
    }, 5000);
  };

  const autoAdjustTextarea = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
</script>

<div class="min-h-screen bg-base-300 p-8">
  <h1 class="text-2xl font-bold mb-4">Action Plans</h1>

  <!-- Strategic Goal and Objective -->
  {#if strategicGoal && strategicObjective}
      <h5 class="text-md font-semibold">
        <strong>Strategic Goal: </strong> {strategicGoal.goal_no} - {strategicGoal.name}
      </h5>
      <h5 class="text-md font-semibold mt-2">
        <strong>Strategic Objective: </strong> {strategicObjective.name}
      </h5>
  {/if}

  <!-- Alert Messages -->
  {#if alertMessage}
    <div class="alert alert-{alertType} shadow-lg mb-4">
      <span>{alertMessage}</span>
    </div>  
  {/if}

  <!-- Table for Action Plans -->
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full shadow-lg rounded-lg">
      <thead>
        <tr>
          <th>Actions Taken</th>
          <th>KPI</th>
          <th>Target Output</th>
          <th>Key Person Responsible</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each actionPlans as plan, index}
          <tr>
            <td>
              <textarea
                class="input input-bordered w-full resize-none"
                bind:value={plan.actions_taken}
                on:input={(e) => {
                  autoAdjustTextarea(e);
                  updateField(index, "actions_taken", (e.target as HTMLInputElement).value);
                }}
              ></textarea>
            </td>
            <td>
              <textarea
                class="input input-bordered w-full resize-none"
                bind:value={plan.kpi}
                on:input={(e) => {
                  autoAdjustTextarea(e);
                  updateField(index, "kpi", (e.target as HTMLInputElement).value);
                }}
              ></textarea>
            </td>
            <td>
              <textarea
                class="input input-bordered w-full resize-none"
                bind:value={plan.target_output}
                on:input={(e) => {
                  autoAdjustTextarea(e);
                  updateField(index, "target_output", (e.target as HTMLInputElement).value);
                }}
              ></textarea>
            </td>
            <td>
              <textarea
                class="input input-bordered w-full resize-none"
                bind:value={plan.key_person_responsible}
                on:input={(e) => {
                  autoAdjustTextarea(e);
                  updateField(index, "key_person_responsible", (e.target as HTMLInputElement).value);
                }}
              ></textarea>
            </td>
            <td>
              <button
                class="btn btn-error btn-sm text-white"
                on:click={() => deleteRow(index)}
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Add and Submit Buttons -->
  <div class="mt-4 flex gap-4">
    <button class="btn btn-primary" on:click={addRow}>Add Row</button>
    <button
      class="btn btn-secondary"
      on:click={submitActionPlans}
      disabled={isSubmitting}
    >
      {#if isSubmitting}
        <span class="loading loading-spinner">Submitting...</span>
      {:else}
        Submit
      {/if}
    </button>
  </div>
</div>




<style>
  .input {
    padding: 8px 12px;
    border-radius: 8px;
  }
  .resize-none {
    resize: none; /* Disable manual resizing */
  }
</style>
