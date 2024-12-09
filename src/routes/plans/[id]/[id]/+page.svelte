<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  import { page } from "$app/stores";

  interface ActionPlan {
    id: number;
    actions_taken: string;
    kpi: string;
    target_output: string;
    key_person_responsible: string;
    created_at: string;
    objective_id: number;
    is_approved: boolean;
    is_approved_vp: boolean;
    is_approved_president: boolean;
    profile_id: string | null;
    department_name: string | null;
    user_name: string | null;
  }

  interface StrategicObjective {
    id: number;
    name: string;
  }

  interface StrategicGoal {
    id: number;
    name: string;
  }

  let actionPlans: ActionPlan[] = [];
  let displayedActionPlans: ActionPlan[] = [];
  let departments: { id: string; name: string }[] = [];
  let selectedDepartment: string | "all" = "all";
  let filterType: "all" | "approved" | "notApproved" = "all";

  let objective: StrategicObjective | null = null;
  let strategicGoal: StrategicGoal | null = null;
  let objective_id: number | null = null;
  let isLoading = false;

  let adminName: string | null = null;
  let vicePresidentName: string | null = null;
  let presidentName: string | null = null;
  let currentUserRole: string | null = null;

  onMount(async () => {
    const { params } = $page;
    objective_id = parseInt(params.id);

    if (objective_id) {
      try {
        await fetchCurrentUserRole();
        await fetchActionPlans();
        await fetchDepartments();
        await fetchObjective();
        await fetchAdminName();
        await fetchVPAndPresidentNames();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        isLoading = false;
      }
    } else {
      console.error("Objective ID is missing.");
      isLoading = false;
    }
  });

  const fetchCurrentUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) return;

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
      } else {
        currentUserRole = profileData.role;
      }
    } catch (error) {
      console.error("Error fetching current user role:", error);
    }
  };

  const fetchActionPlans = async () => {
    const { data: plansData, error: plansError } = await supabase
      .from("action_plans")
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          departments (name)
        )
      `);

    if (plansError) {
      console.error("Error fetching action plans:", plansError);
    } else {
      actionPlans = plansData.map((plan: any) => ({
        id: plan.id,
        actions_taken: plan.actions_taken,
        kpi: plan.kpi,
        target_output: plan.target_output,
        key_person_responsible: plan.key_person_responsible,
        created_at: plan.created_at,
        objective_id: plan.objective_id,
        is_approved: plan.is_approved,
        is_approved_vp: plan.is_approved_vp,
        is_approved_president: plan.is_approved_president,
        profile_id: plan.profile_id,
        department_name: plan.profiles?.departments?.name || "Unknown",
        user_name: `${plan.profiles?.first_name || ""} ${plan.profiles?.last_name || ""}`,
      }));

      applyFilters();
    }
  };

  const fetchDepartments = async () => {
    const { data: departmentData, error: departmentError } = await supabase
      .from("departments")
      .select("id, name");

    if (departmentError) {
      console.error("Error fetching departments:", departmentError);
    } else {
      departments = departmentData;
    }
  };

  const fetchObjective = async () => {
    const { data: objectiveData, error: objectiveError } = await supabase
      .from("strategic_objectives")
      .select("id, name, strategic_goal_id")
      .eq("id", objective_id)
      .single();

    if (objectiveError) {
      console.error("Error fetching objective:", objectiveError);
    } else {
      objective = objectiveData;

      const { data: goalData, error: goalError } = await supabase
        .from("strategic_goals")
        .select("id, name")
        .eq("id", objectiveData.strategic_goal_id)
        .single();

      if (goalError) {
        console.error("Error fetching strategic goal:", goalError);
      } else {
        strategicGoal = goalData;
      }
    }
  };

  const fetchAdminName = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("role", "admin");

      if (error || !data) {
        console.error("Error fetching admin names:", error || "No data found");
        adminName = "N/A"; // Fallback if no admins are found
      } else {
        // Combine all admin names into a single string
        adminName = data.map((admin) => `${admin.first_name} ${admin.last_name}`).join(", ");
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
      adminName = "N/A";
    }
  };


  const fetchVPAndPresidentNames = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, role")
        .in("role", ["vice_president", "president"]);

      if (error || !data) {
        console.error("Error fetching VP and President names:", error || "No data found");
        vicePresidentName = "N/A";
        presidentName = "N/A";
        return;
      }

      const vp = data.find((user) => user.role === "vice_president");
      const president = data.find((user) => user.role === "president");

      vicePresidentName = vp ? `${vp.first_name} ${vp.last_name}` : "N/A";
      presidentName = president ? `${president.first_name} ${president.last_name}` : "N/A";
    } catch (error) {
      console.error("Error fetching VP and President details:", error);
      vicePresidentName = "N/A";
      presidentName = "N/A";
    }
  };


  const applyFilters = () => {
    let filteredPlans = [...actionPlans];

    if (currentUserRole === "vice_president") {
      filteredPlans = filteredPlans.filter((plan) => plan.is_approved);
    }

    if (currentUserRole === "president") {
      filteredPlans = filteredPlans.filter(
        (plan) => plan.is_approved && plan.is_approved_vp
      );
    }

    if (selectedDepartment !== "all") {
      filteredPlans = filteredPlans.filter(
        (plan) => plan.department_name === selectedDepartment
      );
    }

    if (filterType === "approved") {
      filteredPlans = filteredPlans.filter((plan) => plan.is_approved);
    } else if (filterType === "notApproved") {
      filteredPlans = filteredPlans.filter((plan) => !plan.is_approved);
    }

    displayedActionPlans = filteredPlans;
  };

  const deleteActionPlan = async (planId: number) => {
    const { error } = await supabase
      .from("action_plans")
      .delete()
      .eq("id", planId);

    if (error) {
      console.error("Error deleting action plan:", error);
    } else {
      await fetchActionPlans();
    }
  };

  const approveActionPlan = async (planId: number) => {
  let updateField = {};
  isLoading = true;

  // Check the role and set the appropriate field
  if (currentUserRole === "admin") {
    updateField = { is_approved: true }; // Admin approves the plan
  } else if (currentUserRole === "vice_president") {
    updateField = { is_approved_vp: true }; // VP approves the plan
  } else if (currentUserRole === "president") {
    updateField = { is_approved_president: true }; // President approves the plan
  } else {
    isLoading = false;
    return; // No action if the user does not have a valid role
  }

  try {
    // Update the action plan approval status
    const { data, error } = await supabase
      .from("action_plans")
      .update(updateField)
      .eq("id", planId)
      .select(); // Fetch the updated action plan data

    if (error) {
      console.error("Error approving action plan:", error);
      return;
    }

    // Only add to plan_monitoring if the president approves
    if (currentUserRole === "president" && data && data.length > 0) {
      const actionPlan = data[0];

      const { error: monitoringError } = await supabase
        .from("plan_monitoring")
        .insert({
          action_plan_id: actionPlan.id,
          profile_id: actionPlan.profile_id, // Assuming this field links to the user
          department_id: actionPlan.department_id, // Ensure the department_id is available
        });

      if (monitoringError) {
        console.error("Error inserting into plan_monitoring:", monitoringError);
      }
    }

    // Refresh the action plans list
    await fetchActionPlans();
  } catch (error) {
    console.error("Unexpected error while approving action plan:", error);
  } finally {
    isLoading = false;
  }
};


  const exportToPDF = () => {
    const userName = actionPlans[0]?.user_name || "Unknown";
    const departmentName = actionPlans[0]?.department_name || "Unknown";

    const doc = new jsPDF("landscape");

    doc.setFont("times", "normal");
		doc.setFontSize(12);

    const title = `${departmentName} Action Plans for Objective: ${objective?.name || "N/A"}`;
    const goalName = strategicGoal
      ? `Strategic Goal: ${strategicGoal.name}`
      : "No Strategic Goal Assigned";

    // Title and Header Information
    doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
    doc.text(title, 14, 15);
    doc.text(goalName, 14, 20);
		doc.setFontSize(12);
		doc.text("SY 2024-2025", 14, 25);
    doc.setFontSize(12);
    

    const columns = [
      "Actions Taken",
      "KPI",
      "Target Output",
      "Key Person Responsible",
    ];
    const rows = displayedActionPlans.map((plan) => [
      plan.actions_taken,
      plan.kpi,
      plan.target_output,
      plan.key_person_responsible,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    const pageHeight = doc.internal.pageSize.height;
    const signatureStartY = pageHeight - 30;

    // User Signature
    doc.text(`${userName} (sgnd)`, 14, signatureStartY - 5);
    doc.text("_________________________", 14, signatureStartY);
    doc.text(`${departmentName} Department Head`, 14, signatureStartY + 5);

    // Corporate Planning Officer
    doc.text(`${adminName || "N/A"} (sgnd)`, 100, signatureStartY - 5);
    doc.text("_________________________", 100, signatureStartY);
    doc.text("Corporate Planning Officer", 100, signatureStartY + 5);

    // Vice President
    if (displayedActionPlans.some((plan) => plan.is_approved_vp)) {
      doc.text(`${vicePresidentName || "N/A"} (sgnd)`, 180, signatureStartY - 5);
    } else {
      doc.text(`${vicePresidentName || "N/A"}`, 180, signatureStartY - 5);
    }
    doc.text("_________________________", 180, signatureStartY);
    doc.text("Vice President", 180, signatureStartY + 5);

    // President
    if (displayedActionPlans.some((plan) => plan.is_approved_president)) {
      doc.text(`${presidentName || "N/A"} (sgnd)`, 260, signatureStartY - 5);
    } else {
      doc.text(`${presidentName || "N/A"}`, 260, signatureStartY - 5);
    }
    doc.text("_________________________", 260, signatureStartY);
    doc.text("President", 260, signatureStartY + 5);

    doc.save("ActionPlans.pdf");
  };
</script>

<div class="min-h-screen p-8">
  <h1 class="text-2xl font-bold mb-4">Action Plans</h1>

  <!-- Department Filter -->
  <div class="mb-4 flex gap-4">
    <select
      class="select select-bordered"
      bind:value={selectedDepartment}
      on:change={applyFilters}
    >
      <option value="all">All Departments</option>
      {#each departments as department}
        <option value={department.name}>{department.name}</option>
      {/each}
    </select>

    <button class="btn btn-primary" on:click={() => { filterType = "all"; applyFilters(); }}>
      All
    </button>
    <button class="btn btn-secondary" on:click={() => { filterType = "approved"; applyFilters(); }}>
      Approved
    </button>
    <button class="btn btn-error" on:click={() => { filterType = "notApproved"; applyFilters(); }}>
      Not Approved
    </button>
  </div>

  <!-- Export to PDF -->
  {#if displayedActionPlans.length > 0}
    <button class="btn btn-secondary mb-4" on:click={exportToPDF}>
      Export to PDF
    </button>
  {/if}

  <!-- Table for Action Plans -->
  {#if isLoading}
    <div>Loading action plans...</div>
  {:else if displayedActionPlans.length > 0}
    <div class="overflow-x-auto">
      <table class="table w-full shadow-lg rounded-lg">
        <thead>
          <tr>
            <th>Department</th>
            <th>Actions Taken</th>
            <th>KPI</th>
            <th>Target Output</th>
            <th>Key Person Responsible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each displayedActionPlans as plan}
            <tr>
              <td>{plan.department_name}</td>
              <td>{plan.actions_taken}</td>
              <td>{plan.kpi}</td>
              <td>{plan.target_output}</td>
              <td>{plan.key_person_responsible}</td>
              <td class="flex space-x-2">
                <button
                  class="btn btn-sm btn-success text-white"
                  on:click={() => approveActionPlan(plan.id)}
                  disabled={
                    isLoading || // Disable while loading
                    (currentUserRole === "admin" && plan.is_approved) || 
                    (currentUserRole === "vice_president" && (!plan.is_approved || plan.is_approved_vp)) || 
                    (currentUserRole === "president" && (!plan.is_approved_vp || plan.is_approved_president))
                  }
                >
                  {isLoading 
                    ? "Processing..." 
                    : currentUserRole === "admin"
                    ? plan.is_approved
                      ? "Admin Approved"
                      : "Approve as Admin"
                    : currentUserRole === "vice_president"
                    ? plan.is_approved_vp
                      ? "VP Approved"
                      : "Approve as VP"
                    : currentUserRole === "president"
                    ? plan.is_approved_president
                      ? "President Approved"
                      : "Approve as President"
                    : "Approve"}
                </button>
                <button class="btn btn-sm btn-error text-white" on:click={() => deleteActionPlan(plan.id)}>
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div>No action plans found for this objective.</div>
  {/if}
</div>
