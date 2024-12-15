  <script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";
    import TableRow from "$lib/components/admin-risks-table/RiskTableRow.svelte";
    import { Download, Search, Trash2, ArrowUpDown, X, TriangleAlert } from "lucide-svelte";

    interface Risk {
      id: string;
      rrn: string;
      risk_statement: string;
      classification: number | null;
      actions: string;
      key_persons: string;
      budget: number;
      profile_id: string;
      department_id: string;
      is_approved: boolean;
      is_approved_vp: boolean;
      is_approved_president: boolean;
      user_name: string | null;
      department_name: string | null;
    }

    interface Classification {
      id: number;
      name: string;
    }

    interface RiskAssessment {
      id: number;
      risk_id: string;
      lr: number | null;
      s: number | null;
      rcr: number | null;
      rmr: number | null;
    }

    interface Department {
      id: string;
      name: string;
    }

    let displayedRisks: Risk[] = [];
    interface LikelihoodRating {
      id: number;
      name: string;
    }

    interface Severity {
      id: number;
      value: string;
    }

    interface RiskControlRating {
      id: number;
      name: string;
    }

    interface RiskMonitoringRating {
      id: number;
      status: string;
    }

    let selectedDepartment: string | "all" = "all";

    let isLoading = true;
    let isApproving = false;
    let deletingRiskId: string | null = null;

    let searchQuery: string = $state("");
    let currentPage: number = $state(1);
    let itemsPerPage: number = $state(5);
    let showMobileFilters: boolean = $state(false);
    let sortField: string = $state("rrn");
    let sortDirection: "asc" | "desc" = $state("asc");
    let departmentFilter: string = $state("all");

    let risks: Risk[] = $state([]);
    let departments: any[] = $state([]);
    let riskAssessments: any[] = $state([]);
    let classification: any[] = $state([]);
    let likelihoodRatings: any[] = $state([]);
    let severities: any[] = $state([]);
    let riskControlRatings: any[] = $state([]);
    let riskMonitoringRatings: any[] = $state([]);
    let loading: boolean = $state(true);
    let userRole: string | null = $state(null);
    let adminName: string | null = $state(null);
    let vicePresidentName: string | null = $state(null);
    let presidentName: string | null = $state(null);
    let approvingId: string | null = $state(null);
    let deletingId: string | null = $state(null);

    let classificationFilter: number | "all" = $state("all");
    let budgetRange: { min: number | null; max: number | null } = $state({
      min: null,
      max: null,
    });



    const fetchCurrentUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }

      userRole = profile.role;

      if (userRole === "admin") {
        adminName = `${profile.first_name} ${profile.last_name}`;
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


    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("id, name");

      if (error) {
        console.error("Error fetching departments:", error);
        return;
      }

      departments = data || [];
    };

    const fetchRisks = async () => {
      isLoading = true;

      const { data, error } = await supabase
        .from("risks")
        .select(`*, profiles (first_name, last_name, departments (name))`);

      if (error) {
        console.error("Error fetching risks:", error);
        return;
      }

      risks = data.map((risk: any) => ({
        ...risk,
        user_name: `${risk.profiles?.first_name || ""} ${risk.profiles?.last_name || ""}`,
        department_name: risk.profiles?.departments?.name || "N/A",
      }));

      applyFilters();
      isLoading = false;
    };

    const fetchRiskAssessments = async () => {
      const { data, error } = await supabase.from("risk_assessment").select("*");

      if (error) {
        console.error("Error fetching risk assessments:", error);
        return;
      }

      riskAssessments = data || [];
    };

    const fetchClassification = async () => {
      const { data, error } = await supabase.from("classification").select("*");
      if (!error) classification = data || [];
    };

    const fetchLikelihoodRatings = async () => {
      const { data, error } = await supabase.from("likelihood_rating").select("*");
      if (!error) likelihoodRatings = data || [];
    };

    const fetchSeverities = async () => {
      const { data, error } = await supabase.from("severity").select("*");
      if (!error) severities = data || [];
    };

    const fetchRiskControlRatings = async () => {
      const { data, error } = await supabase.from("risk_control_rating").select("*");
      if (!error) riskControlRatings = data || [];
    };

    const fetchRiskMonitoringRatings = async () => {
      const { data, error } = await supabase.from("risk_monitoring_rating").select("*");
      if (!error) riskMonitoringRatings = data || [];
    };

    

  const approveRisk = async (id: string) => {
    isApproving = true;

    let updateField = {};
    if (userRole === "admin") {
      updateField = { is_approved: true };
    } else if (userRole === "vice_president") {
      updateField = { is_approved_vp: true };
    } else if (userRole === "president") {
      updateField = { is_approved_president: true };
    }

    try {
      // Update the approval status of the risk
      const { data, error } = await supabase.from("risks").update(updateField).eq("id", id).select();

      if (error) {
        console.error("Error approving risk:", error);
        return;
      }

      // Add to risk_monitoring only if President approved
      if (userRole === "president" && data && data.length > 0) {
        const approvedRisk = data[0];

        if (approvedRisk.is_approved_president) {
          // Check if the risk is already in risk_monitoring
          const { data: existingEntries, error: checkError } = await supabase
            .from("risk_monitoring")
            .select("id")
            .eq("risk_id", approvedRisk.id);

          if (checkError) {
            console.error("Error checking existing risk_monitoring entry:", checkError);
            return;
          }

          // Add only if no existing entry
          if (!existingEntries || existingEntries.length === 0) {
            const { data: assessments, error: assessmentError } = await supabase
              .from("risk_assessment")
              .select("*")
              .eq("risk_id", approvedRisk.id);

            if (assessmentError) {
              console.error("Error fetching risk assessments:", assessmentError);
              return;
            }

            const riskMonitoringEntries = assessments.map((assessment) => ({
              risk_id: approvedRisk.id,
              likelihood_rating_id: assessment.lr,
              severity_id: assessment.s,
              control_rating_id: assessment.rcr,
              monitoring_rating_id: assessment.rmr,
              department_id: approvedRisk.department_id,
            }));

            const { error: insertError } = await supabase
              .from("risk_monitoring")
              .insert(riskMonitoringEntries);

            if (insertError) {
              console.error("Error inserting into risk_monitoring:", insertError);
            }
          }
        }
      }

      // Refresh the list of risks
      await fetchRisks();
    } catch (error) {
      console.error("Unexpected error while approving risk:", error);
    } finally {
      isApproving = false;
    }
  };


  const approveAllRisks = async () => {
    isApproving = true;

    try {
      // Determine the field to update based on the user's role
      let updateField = {};
      if (userRole === "admin") {
        updateField = { is_approved: true };
      } else if (userRole === "vice_president") {
        updateField = { is_approved_vp: true };
      } else if (userRole === "president") {
        updateField = { is_approved_president: true };
      } else {
        console.error("Invalid role for approval.");
        isApproving = false;
        return;
      }

      // Update approval for all displayed risks
      const riskIds = displayedRisks.map((risk) => risk.id);

      const { data: updatedRisks, error } = await supabase
        .from("risks")
        .update(updateField)
        .in("id", riskIds)
        .select();

      if (error) throw error;

      // Add risks to the `risk_monitoring` table if President is approving
      if (userRole === "president" && updatedRisks) {
        for (const risk of updatedRisks) {
          if (risk.is_approved_president) {
            // Check if the risk is already in risk_monitoring
            const { data: existingEntries, error: checkError } = await supabase
              .from("risk_monitoring")
              .select("id")
              .eq("risk_id", risk.id);

            if (checkError) {
              console.error("Error checking existing risk_monitoring entry:", checkError);
              continue;
            }

            // Add only if no existing entry
            if (!existingEntries || existingEntries.length === 0) {
              const { data: assessments, error: assessmentError } = await supabase
                .from("risk_assessment")
                .select("*")
                .eq("risk_id", risk.id);

              if (assessmentError) {
                console.error("Error fetching risk assessments:", assessmentError);
                continue;
              }

              const monitoringEntries = assessments.map((assessment) => ({
                risk_id: risk.id,
                likelihood_rating_id: assessment.lr,
                severity_id: assessment.s,
                control_rating_id: assessment.rcr,
                monitoring_rating_id: assessment.rmr,
                department_id: risk.department_id,
              }));

              const { error: insertError } = await supabase
                .from("risk_monitoring")
                .insert(monitoringEntries);

              if (insertError) {
                console.error("Error inserting into risk_monitoring:", insertError);
              }
            }
          }
        }
      }

      // Refresh the risks list
      await fetchRisks();
      console.log("All risks approved successfully.");
    } catch (error) {
      console.error("Error approving all risks:", error);
    } finally {
      isApproving = false;
    }
  };





    const deleteRisk = async (id: string) => {
      deletingRiskId = id;

      const { error } = await supabase.from("risks").delete().eq("id", id);

      if (error) {
        console.error("Error deleting risk:", error);
      } else {
        await fetchRisks();
      }

      deletingRiskId = null;
    };

    const applyFilters = () => {
      if (selectedDepartment === "all") {
        displayedRisks = risks;
      } else {
        displayedRisks = risks.filter(
          (risk) => risk.department_name === selectedDepartment
        );
      }
    };



    const exportToPDF = () => {
    const doc = new jsPDF("landscape");
    const title = "Risk Report";
    const columns = [
      "Risk Statement",
      "Classification",
      "Budget",
      "Likelihood",
      "Severity",
      "Control Rating",
      "Monitoring Rating",
      "Approval Status",
      "Department",
      
    ];

    

      // Use filteredItems instead of displayedRisks to respect all active filters
      const rows = filteredItems.flatMap((risk) => {
        const assessments = riskAssessments.filter((a) => a.risk_id === risk.id);
        if (assessments.length === 0) {
          return [[risk.risk_statement, classification.find((cls) => cls.id === risk.classification)?.name || "N/A",risk.budget || "N/A", "N/A", "N/A", "N/A", "N/A", risk.is_approved ? "Admin Approved" : risk.is_approved_vp ? "VP Approved" : risk.is_approved_president ? "President Approved" : "Pending", risk.department_name || "N/A"]];
        }

        return assessments.map((a) => [risk.risk_statement, classification.find((cls) => cls.id === risk.classification)?.name || "N/A", risk.budget || "N/A", likelihoodRatings.find((lr) => lr.id === a.lr)?.name || "N/A", severities.find((s) => s.id === a.s)?.value || "N/A", riskControlRatings.find((rcr) => rcr.id === a.rcr)?.name || "N/A", riskMonitoringRatings.find((rmr) => rmr.id === a.rmr)?.status || "N/A", risk.is_approved ? "Admin Approved" : risk.is_approved_vp ? "VP Approved" : risk.is_approved_president ? "President Approved" : "Pending", risk.department_name || "N/A"]);
      });

      // Add title with active filters information
      doc.setFontSize(14);
      doc.text(title, 14, 15);

      // Add filter information
      doc.setFontSize(10);
      let filterText = [];
      if (searchQuery) filterText.push(`Search: "${searchQuery}"`);
      if (departmentFilter !== "all") filterText.push(`Department: ${departmentFilter}`);
      if (classificationFilter !== "all") {
        const classificationName = classification.find((c) => c.id === classificationFilter)?.name;
        filterText.push(`Classification: ${classificationName}`);
      }
      if (budgetRange.min) filterText.push(`Min Budget: ${budgetRange.min}`);
      if (budgetRange.max) filterText.push(`Max Budget: ${budgetRange.max}`);

      if (filterText.length > 0) {
        doc.text(`Filters applied: ${filterText.join(" | ")}`, 14, 22);
      }

      // Add the table with adjusted starting position if filters are shown
      // autoTable(doc, {
      // 	head: [columns],
      // 	body: rows,
      // 	startY: filterText.length > 0 ? 30 : 25,
      // 	theme: "grid",
      // 	styles: { fontSize: 10 },
      // 	headStyles: { fillColor: [41, 128, 185] },
      // });

      

    // Add the title
    doc.setFontSize(14);
    doc.text(title, 14, 15);

    // Add the table
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      
    });

    // Prepare space for signatures
    const pageHeight = doc.internal.pageSize.height;
    const signatureStartY = pageHeight - 40; // Adjust to start above the margin

    // Calculate column positions for even spacing
    const columnWidth = doc.internal.pageSize.width / 4;
    const positions = [14, columnWidth, columnWidth * 2, columnWidth * 3];

    // Signatures Layout
    doc.setFontSize(10);

    const firstRisk = displayedRisks[0];
    const userName = firstRisk?.user_name || "Unknown";
    const departmentName = firstRisk?.department_name || "Unknown";

    // User Signature (Department Head)
    doc.text(`${userName || "Unknown"} (sgnd)`, positions[0], signatureStartY - 5);
    doc.text("_________________________", positions[0], signatureStartY);
    doc.text(`${departmentName || "Unknown"} Department Head`, positions[0], signatureStartY + 5);

    // Admin (Corporate Planning Officer)
    doc.text(`${adminName || "N/A"} (sgnd)`, positions[1], signatureStartY - 5);
    doc.text("_________________________", positions[1], signatureStartY);
    doc.text("Corporate Planning Officer", positions[1], signatureStartY + 5);

    // Vice President
    doc.text(
      `${vicePresidentName || "N/A"} (sgnd)`,
      positions[2],
      signatureStartY - 5
    );
    doc.text("_________________________", positions[2], signatureStartY);
    doc.text("Vice President", positions[2], signatureStartY + 5);

    // President
    doc.text(
      `${presidentName || "N/A"} (sgnd)`,
      positions[3],
      signatureStartY - 5
    );
    doc.text("_________________________", positions[3], signatureStartY);
    doc.text("President", positions[3], signatureStartY + 5);

    const exportDate = new Date().toLocaleString();
      const totalExported = rows.length;
      const totalBudget = filteredItems.reduce((sum, risk) => sum + (risk.budget || 0), 0);
      doc.setFontSize(8);
      doc.text(`Exported on: ${exportDate} | Total Records: ${totalExported} | Total Budget: P${totalBudget}`, 14, doc.internal.pageSize.height - 10);

      doc.save("Risk_Report.pdf");

    // Save the PDF file
    doc.save("Risk_Report.pdf");
  };


  const init = async () => {
      await fetchCurrentUserRole();
      await fetchAdminName();
      await fetchDepartments();
      await fetchRisks();
      await fetchRiskAssessments();
      await fetchClassification();
      await fetchLikelihoodRatings();
      await fetchSeverities();
      await fetchRiskControlRatings();
      await fetchRiskMonitoringRatings();
      await fetchVPAndPresidentNames();
      loading = false;
    };


    

    const toggleSort = (field: string) => {
      if (sortField === field) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortField = field;
        sortDirection = "asc";
      }
    };

    // Derived values
    const filteredItems = $derived(
      risks
        .filter((risk) => {
          const searchFields = `${risk.rrn} ${risk.risk_statement} ${risk.department_name}`.toLowerCase();
          const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
          const matchesDepartment = departmentFilter === "all" || risk.department_name === departmentFilter;
          const matchesClassification = classificationFilter === "all" || risk.classification === classificationFilter;
          const matchesBudget = (!budgetRange.min || risk.budget >= budgetRange.min) && (!budgetRange.max || risk.budget <= budgetRange.max);

          return matchesSearch && matchesDepartment && matchesClassification && matchesBudget;
        })
        .sort((a, b) => {
          const aValue = String(a[sortField]);
          const bValue = String(b[sortField]);
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        })
    );


    // Function to get min and max budget from risks
    const getBudgetRange = (): { min: number; max: number } => {
      const budgets = risks.map((risk) => risk.budget).filter((budget) => budget != null);
      return {
        min: Math.min(...budgets),
        max: Math.max(...budgets),
      };
    };


    const paginatedItems = $derived(filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));

    init();
  </script>

  <div class="flex flex-col gap-4 container mx-auto p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-2">
        <TriangleAlert class="w-8 h-8 text-primary" />
        <h1 class="text-2xl font-bold">Risk Management</h1>
      </div>
    </div>

    <!-- Mobile filters toggle -->
    <button onclick={() => (showMobileFilters = !showMobileFilters)} class="md:hidden w-full px-4 py-2 bg-secondary rounded-lg text-left flex justify-between items-center">
      Filters
      <ArrowUpDown size={16} class={showMobileFilters ? "rotate-180" : ""} />
    </button>

    <!-- Filters section -->
    <div class={`flex flex-col gap-4 ${showMobileFilters ? "block" : "hidden"} md:flex md:flex-row md:flex-wrap md:justify-between`}>
      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
        <div class="relative flex-2 md:w-[300px]">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input type="text" bind:value={searchQuery} placeholder="Search risks..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select bind:value={departmentFilter} class="bg-secondary rounded-lg px-3 py-2 w-full md:w-[200px]">
          <option value="all">All Departments</option>
          {#each departments as department}
            <option value={department.name}>{department.name}</option>
          {/each}
        </select>
        <select bind:value={classificationFilter} class="bg-secondary rounded-lg px-3 py-2 w-full md:w-[200px]">
          <option value="all">All Classifications</option>
          {#each classification as cls}
            <option value={cls.id}>{cls.name}</option>
          {/each}
        </select>
      </div>
      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div class="flex items-center gap-2">
          <input type="number" bind:value={budgetRange.min} placeholder="Min Budget" class=" px-3 py-2 bg-secondary border-secondary rounded-lg  focus:outline-none focus:ring-2 focus:ring-ring w-[150px]" />
          <span class="text-muted-foreground">to</span>
          <input type="number" bind:value={budgetRange.max} placeholder="Max Budget" class=" px-3 py-2 bg-secondary border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring w-[150px]" />
        </div>

        <!-- Export button -->
        <button onclick={exportToPDF} class="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80">
          <Download size={20} />
          Export
        </button>

        <!--Approve all button-->
        <button
          onclick={approveAllRisks}
          class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          disabled={
            isApproving ||
            displayedRisks.every(
              (risk) =>
                (userRole === "admin" && risk.is_approved) ||
                (userRole === "vice_president" && risk.is_approved_vp) ||
                (userRole === "president" && risk.is_approved_president)
            )
          }
        >
          {isApproving ? "Processing..." : "Approve All Risks"}
        </button>

      
      </div>
    </div>

    <!-- Loading state -->
    {#if loading}
      <div class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    {:else}
      <!-- Risks table -->
      <div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
        <table class="min-w-full table-auto">
          <thead class="bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left">
                <button onclick={() => toggleSort("rrn")} class="flex items-center gap-1 hover:text-primary">
                  RRN
                  <ArrowUpDown size={16} class={sortField === "rrn" ? "text-primary" : ""} />
                </button>
              </th>
              <th class="px-4 py-3 text-left">Risk Statement</th>
              <th class="px-4 py-3 text-left">Classification</th>
              <th class="px-4 py-3 text-left">Actions</th>
              <th class="px-4 py-3 text-left">Key Persons</th>
              <th class="px-4 py-3 text-left">Budget</th>
              <th class="px-4 py-3 text-left">Risk Assessments</th>
              <th class="px-4 py-3 text-left w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each paginatedItems as risk (risk.id)}
              <TableRow {risk} {userRole} {classification} {likelihoodRatings} {severities} {riskControlRatings} {riskMonitoringRatings} {riskAssessments} onDelete={deleteRisk} onApprove={approveRisk} {approvingId} {deletingId} />
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-2 py-1 w-full sm:w-auto">
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <div class="flex gap-2">
            <button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button>
            <button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
