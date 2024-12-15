<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  import { page } from "$app/stores";
  import { Pencil, Search, ArrowUpDown, Save, X, Trash2, ChevronLeft } from "lucide-svelte"; 
  import { fade, slide } from "svelte/transition";


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

	type SortField = "department_name" | "actions_taken" | "kpi" | "target_output" | "key_person_responsible";
	type SortDirection = "asc" | "desc";

  let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let sortField: SortField = $state("department_name");
	let sortDirection: SortDirection = $state("asc");

  

  let actionPlans: ActionPlan[] = [];
  let displayedActionPlans: ActionPlan[] = $state([]);
  let departments: { id: string; name: string }[] = $state([]);
  let selectedDepartment: string | "all" = $state("all");
  let filterType: "all" | "approved" | "notApproved" = $state("all");
  let editingPlan: ActionPlan | null = $state(null);


  let objective: StrategicObjective | null = null;
  let strategicGoal: StrategicGoal | null = null;
  let objective_id: number | null = null;
  let isLoading = $state(false);

  let adminName: string | null = null;
  let vicePresidentName: string | null = null;
  let presidentName: string | null = null;
  let currentUserRole: string | null = $state(null);

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
  if (!objective_id) {
    console.error("Objective ID is missing.");
    return;
  }

  const { data: plansData, error: plansError } = await supabase
    .from("action_plans")
    .select(`
      *,
      profiles (
        first_name,
        last_name,
        departments (name)
      )
    `)
    .eq("objective_id", objective_id); // Filter by objective_id

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

      // Collect all Vice Presidents and Presidents
      const vicePresidents = data
        .filter((user) => user.role === "vice_president")
        .map((vp) => `${vp.first_name} ${vp.last_name}`);
      const presidents = data
        .filter((user) => user.role === "president")
        .map((president) => `${president.first_name} ${president.last_name}`);

      // Join names with commas for display
      vicePresidentName = vicePresidents.length ? vicePresidents.join(", ") : "N/A";
      presidentName = presidents.length ? presidents.join(", ") : "N/A";
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
    console.log("Action plan approved successfully.");
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

    // Vice President section
    doc.text(
      vicePresidentName.includes("(sgnd)")
        ? `${vicePresidentName}`
        : `${vicePresidentName} (sgnd)`,
      180,
      signatureStartY - 5
    );
    doc.text("_________________________", 180, signatureStartY);
    doc.text("Vice President(s)", 180, signatureStartY + 5);

    // President section
    doc.text(
      presidentName.includes("(sgnd)")
        ? `${presidentName}`
        : `${presidentName} (sgnd)`,
      260,
      signatureStartY - 5
    );
    doc.text("_________________________", 260, signatureStartY);
    doc.text("President(s)", 260, signatureStartY + 5);


    doc.save("ActionPlans.pdf");
  };

  const filteredAndSortedPlans = $derived(
		displayedActionPlans
			.filter((plan) => {
				const searchFields = `${plan.department_name} ${plan.actions_taken} ${plan.kpi} ${plan.target_output} ${plan.key_person_responsible}`.toLowerCase();
				return searchFields.includes(searchQuery.toLowerCase());
			})
			.sort((a, b) => {
				const aValue = a[sortField].toString().toLowerCase();
				const bValue = b[sortField].toString().toLowerCase();
				return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			})
	);

	const paginatedPlans = $derived(filteredAndSortedPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const totalPages = $derived(Math.ceil(filteredAndSortedPlans.length / itemsPerPage));

	/** Toggle sort direction and field */
	const toggleSort = (field: SortField) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
	};

  const approveAllActionPlans = async () => {
    isLoading = true;

    try {
        // Determine the field to update based on the user role
        let updateField = {};
        if (currentUserRole === "admin") {
            updateField = { is_approved: true };
        } else if (currentUserRole === "vice_president") {
            updateField = { is_approved_vp: true };
        } else if (currentUserRole === "president") {
            updateField = { is_approved_president: true };
        } else {
            isLoading = false;
            return; // Exit if the user does not have a valid role
        }

        // Fetch all displayed action plans with the department_id
        const actionPlanIds = displayedActionPlans.map((plan) => plan.id);
        const { data: plansData, error: fetchError } = await supabase
            .from("action_plans")
            .select("id, profile_id, department_id")
            .in("id", actionPlanIds);

        if (fetchError) {
            console.error("Error fetching action plans with department_id:", fetchError);
            isLoading = false;
            return;
        }

        // Update approval fields for all displayed action plans
        const { error: updateError } = await supabase
            .from("action_plans")
            .update(updateField)
            .in("id", actionPlanIds);

        if (updateError) {
            console.error("Error approving all action plans:", updateError);
            isLoading = false;
            return;
        }

        // If the President approves, add to plan_monitoring
        if (currentUserRole === "president" && plansData) {
            const monitoringEntries = plansData.map((plan) => ({
                action_plan_id: plan.id,
                profile_id: plan.profile_id,
                department_id: plan.department_id, // Include department_id
            }));

            const { error: monitoringError } = await supabase
                .from("plan_monitoring")
                .insert(monitoringEntries);

            if (monitoringError) {
                console.error("Error inserting into plan_monitoring:", monitoringError);
            }
        }

        // Refresh the action plans list
        await fetchActionPlans();
        console.log("All action plans approved successfully.");
    } catch (error) {
        console.error("Unexpected error while approving all action plans:", error);
    } finally {
        isLoading = false;
    }
};


/** Handle row edit */
const onEditRow = (plan: ActionPlan) => {
		editingPlan = { ...plan };
	};

	/** Handle cancel edit */
	const onCancelEdit = () => {
		editingPlan = null;
	};

	/** Handle save edit */
	const onSaveEdit = async () => {
		if (!editingPlan) return;

		try {
			const { error } = await supabase
				.from("action_plans")
				.update({
					actions_taken: editingPlan.actions_taken,
					kpi: editingPlan.kpi,
					target_output: editingPlan.target_output,
					key_person_responsible: editingPlan.key_person_responsible,
				})
				.eq("id", editingPlan.id);

			if (error) throw error;

			// Refresh action plans
			await fetchActionPlans();
			// Clear editing state
			editingPlan = null;
		} catch (error) {
			console.error("Error updating action plan:", error);
		}
	};

  let showEditModal = $state(false);
    let selectedAction: ActionPlan | null = $state(null);
    let isSubmitting = $state(false);
    let error = $state<string | null>(null);

    // Handle edit click
    const handleEdit = (action: ActionPlan) => {
        selectedAction = { ...action };
        showEditModal = true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!selectedAction) return;
        isSubmitting = true;
        error = null;

        try {
            const { data, error: updateError } = await supabase
                .from('action_plan')
                .update({
                    actions_taken: selectedAction.actions_taken,
                    kpi: selectedAction.kpi,
                    target_output: selectedAction.target_output,
                    key_person_responsible: selectedAction.key_person_responsible
                })
                .eq('id', selectedAction.id)
                .select();

            if (updateError) throw updateError;

            // Update local data
            actionPlans = actionPlans.map(plan => 
                plan.id === selectedAction.id ? { ...plan, ...selectedAction } : plan
            );

            showEditModal = false;
        } catch (e) {
            error = 'Failed to update action plan';
            console.error(e);
        } finally {
            isSubmitting = false;
        }
    };




</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- Header -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    
    <div class="flex items-center gap-2">
        <a href={`/plans/${objective?.id}`} class="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ChevronLeft size={20} />
        Back to Strategic Objectives
      </a>
      <h1 class="text-2xl font-bold">Action Plans</h1>
    </div>
  </div>

	<!-- Filters -->
	<div class="flex flex-col md:flex-row gap-4 mb-6">
		<div class="flex flex-col md:flex-row gap-4 flex-1">
			<!-- Search Input -->
			<div class="relative flex-1 w-full md:max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search action plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>

			<!-- Department Filter -->
			<select bind:value={selectedDepartment} onchange={applyFilters} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
				<option value="all">All Departments</option>
				{#each departments as department}
					<option value={department.name}>{department.name}</option>
				{/each}
			</select>

			<!-- Status Filter -->
			<select bind:value={filterType} onchange={applyFilters} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
				<option value="all">All Status</option>
				<option value="approved">Approved</option>
				<option value="notApproved">Not Approved</option>
			</select>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			{#if displayedActionPlans.length > 0}
				<button onclick={exportToPDF} class="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors">Export to PDF</button>
				<button onclick={approveAllActionPlans} disabled={isLoading || displayedActionPlans.every((plan) => (currentUserRole === "admin" && plan.is_approved) || (currentUserRole === "vice_president" && plan.is_approved_vp) || (currentUserRole === "president" && plan.is_approved_president))} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
					{isLoading ? "Processing..." : "Approve All"}
				</button>
			{/if}
		</div>
	</div>

	<!-- Table -->
	{#if isLoading}
		<div class="flex justify-center p-8" transition:fade>
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
		</div>
	{:else if paginatedPlans.length > 0}
		<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("department_name")} class="flex items-center gap-1">
								Department
								<ArrowUpDown size={16} class={sortField === "department_name" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("actions_taken")} class="flex items-center gap-1">
								Actions Taken
								<ArrowUpDown size={16} class={sortField === "actions_taken" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">KPI</th>
						<th class="px-4 py-3 text-left">Target Output</th>
						<th class="px-4 py-3 text-left">Key Person Responsible</th>
						<th class="px-4 py-3 text-center">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedPlans as plan}
						{#if editingPlan?.id === plan.id}
							<tr class="hover:bg-muted/50" transition:slide>
								<td class="px-4 py-3">{plan.department_name}</td>
								<td class="px-4 py-3">
									<input type="text" bind:value={editingPlan.actions_taken} class="w-full px-2 py-1 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring" />
								</td>
								<td class="px-4 py-3">
									<input type="text" bind:value={editingPlan.kpi} class="w-full px-2 py-1 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring" />
								</td>
								<td class="px-4 py-3">
									<input type="text" bind:value={editingPlan.target_output} class="w-full px-2 py-1 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring" />
								</td>
								<td class="px-4 py-3">
									<input type="text" bind:value={editingPlan.key_person_responsible} class="w-full px-2 py-1 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring" />
								</td>
								<td class="px-4 py-3">
									<div class="flex justify-center gap-2">
										<button onclick={onSaveEdit} class="p-1.5 hover:bg-muted rounded-lg text-green-500">
											<Save size={16} />
										</button>
										<button onclick={onCancelEdit} class="p-1.5 hover:bg-muted rounded-lg text-red-400">
											<X size={16} />
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr class="hover:bg-muted/50">
								<td class="px-4 py-3">{plan.department_name}</td>
								<td class="px-4 py-3">{plan.actions_taken}</td>
								<td class="px-4 py-3">{plan.kpi}</td>
								<td class="px-4 py-3">{plan.target_output}</td>
								<td class="px-4 py-3">{plan.key_person_responsible}</td>
								<td class="px-4 py-3">
									<div class="flex justify-center gap-2">
										<button onclick={() => approveActionPlan(plan.id)} disabled={isLoading || (currentUserRole === "admin" && plan.is_approved) || (currentUserRole === "vice_president" && (!plan.is_approved || plan.is_approved_vp)) || (currentUserRole === "president" && (!plan.is_approved_vp || plan.is_approved_president))} class="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 text-sm">
											{isLoading ? "Processing..." : currentUserRole === "admin" ? (plan.is_approved ? "Admin Approved" : "Approve as Admin") : currentUserRole === "vice_president" ? (plan.is_approved_vp ? "VP Approved" : "Approve as VP") : currentUserRole === "president" ? (plan.is_approved_president ? "President Approved" : "Approve as President") : "Approve"}
										</button>
                    <button
                    onclick={() => handleEdit(plan)}
                    class="text-muted-foreground hover:text-foreground"
                >
                    <Pencil size={16} />
                </button>
										<button onclick={() => deleteActionPlan(plan.id)} class="p-1.5 hover:bg-muted rounded-lg text-red-400">
											<Trash2 size={16} />
										</button>
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
			<div class="text-sm text-muted-foreground">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedPlans.length)} of {filteredAndSortedPlans.length} results
			</div>
			<div class="flex flex-col sm:flex-row items-center gap-4">
				<!-- Items per page -->
				<select bind:value={itemsPerPage} class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto">
					<option value={5}>5 per page</option>
					<option value={10}>10 per page</option>
					<option value={25}>25 per page</option>
					<option value={50}>50 per page</option>
				</select>
				<button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Previous</button>
				<button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Next</button>
			</div>
		</div>
	{:else}
  <div class="text-center py-12 bg-card rounded-lg border border-border">
    <p class="text-muted-foreground mb-4">No action plans found for this objective.</p>
  </div>
	{/if}

  {#if showEditModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" transition:fade>
        <div class="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-4" >
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Edit Action Plan</h2>
                <button onclick={() => showEditModal = false} class="text-muted-foreground hover:text-foreground">
                    <X size={24} />
                </button>
            </div>

            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            {/if}

            <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
                <div class="space-y-2">
                    <label for="actions_taken" class="text-sm font-medium">Actions Taken</label>
                    <textarea 
                        id="actions_taken"
                        bind:value={selectedAction.actions_taken}
                        class="w-full p-2 border rounded-md bg-secondary"
                        rows="3"
                    ></textarea>
                </div>

                <div class="space-y-2">
                    <label for="kpi" class="text-sm font-medium">KPI</label>
                    <textarea id="kpi"
                    bind:value={selectedAction.kpi}
                     class="w-full p-2 border rounded-md bg-secondary"
                        rows="3"
                    ></textarea>
                  
                </div>

                <div class="space-y-2">
                    <label for="target_output" class="text-sm font-medium">Target Output</label>
                    <textarea 
                      id="target_output" 
                      bind:value={selectedAction.target_output}
                        class="w-full p-2 border rounded-md bg-secondary"
                        rows = "2"></textarea> 
                  
                </div>

                <div class="space-y-2">
                    <label for="key_person" class="text-sm font-medium">Key Person Responsible</label>
                    <textarea 
                    id="key_person" 
                    bind:value={selectedAction.key_person_responsible}
                      class="w-full p-2 border rounded-md bg-secondary"
                      rows = "2"></textarea> 
                  
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onclick={() => showEditModal = false}
                        class="px-4 py-2 border rounded-md hover:bg-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {#if isSubmitting}
                            <span class="flex items-center gap-2">
                                Saving...
                            </span>
                        {:else}
                            Save Changes
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
</div>