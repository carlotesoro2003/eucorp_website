<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";

  interface Risk {
    id: string;
    rrn: string;
    risk_statement: string;
    classification: number | null;
    actions: string;
    key_persons: string;
    budget: number;
    profile_id: string;
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

  let risks: Risk[] = [];
  let displayedRisks: Risk[] = [];
  let riskAssessments: RiskAssessment[] = [];
  let classification: Classification[] = [];
  interface LikelihoodRating {
    id: number;
    name: string;
  }

  let likelihoodRatings: LikelihoodRating[] = [];
  interface Severity {
    id: number;
    value: string;
  }

  let severities: Severity[] = [];
  interface RiskControlRating {
    id: number;
    name: string;
  }

  let riskControlRatings: RiskControlRating[] = [];
  interface RiskMonitoringRating {
    id: number;
    status: string;
  }

  let riskMonitoringRatings: RiskMonitoringRating[] = [];
  let departments: Department[] = [];
  let selectedDepartment: string | "all" = "all";

  let isLoading = true;
  let isApproving = false;
  let deletingRiskId: string | null = null;

  let userRole: string | null = null;
  let adminName: string | null = null;
  let vicePresidentName: string | null = null;
  let presidentName: string | null = null;

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

    // If the President approved the risk, add it to the risk_monitoring table
    if (userRole === "president" && data && data.length > 0) {
      const approvedRisk = data[0];

      // Fetch the associated risk assessments
      const { data: assessments, error: assessmentError } = await supabase
        .from("risk_assessment")
        .select("*")
        .eq("risk_id", approvedRisk.id);

      if (assessmentError) {
        console.error("Error fetching risk assessments:", assessmentError);
        return;
      }

      // Prepare the data for insertion into the risk_monitoring table
      const riskMonitoringEntries = assessments.map((assessment) => ({
        risk_id: approvedRisk.id,
        likelihood_rating_id: assessment.lr,
        severity_id: assessment.s,
        control_rating_id: assessment.rcr,
        monitoring_rating_id: assessment.rmr,
        department_id: approvedRisk.department_id, 
      }));

      // Insert the data into the risk_monitoring table
      const { error: monitoringError } = await supabase
        .from("risk_monitoring")
        .insert(riskMonitoringEntries);
      if (monitoringError) {
        console.error("Error inserting into risk_monitoring:", monitoringError);
      }
      console.log("Risk Monitoring Entries:", riskMonitoringEntries);
    }

    // Refresh the list of risks
    await fetchRisks();
  } catch (error) {
    console.error("Unexpected error while approving risk:", error);
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
    "Likelihood",
    "Severity",
    "Control Rating",
    "Monitoring Rating",
    "Approval Status",
    "Department",
  ];

  const rows = displayedRisks.flatMap((risk) => {
    const assessments = riskAssessments.filter((a) => a.risk_id === risk.id);
    if (assessments.length === 0) {
      return [
        [
          risk.risk_statement,
          classification.find((cls) => cls.id === risk.classification)?.name || "N/A",
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          risk.is_approved
            ? "Admin Approved"
            : risk.is_approved_vp
            ? "VP Approved"
            : risk.is_approved_president
            ? "President Approved"
            : "Pending",
          risk.department_name || "N/A",
        ],
      ];
    }

    return assessments.map((a) => [
      risk.risk_statement,
      classification.find((cls) => cls.id === risk.classification)?.name || "N/A",
      likelihoodRatings.find((lr) => lr.id === a.lr)?.name || "N/A",
      severities.find((s) => s.id === a.s)?.value || "N/A",
      riskControlRatings.find((rcr) => rcr.id === a.rcr)?.name || "N/A",
      riskMonitoringRatings.find((rmr) => rmr.id === a.rmr)?.status || "N/A",
      risk.is_approved
        ? "Admin Approved"
        : risk.is_approved_vp
        ? "VP Approved"
        : risk.is_approved_president
        ? "President Approved"
        : "Pending",
      risk.department_name || "N/A",
    ]);
  });

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

  // Save the PDF file
  doc.save("Risk_Report.pdf");
};


  onMount(async () => {
    await fetchCurrentUserRole();
    await fetchDepartments();
    await fetchRisks();
    await fetchRiskAssessments();
    await fetchClassification();
    await fetchLikelihoodRatings();
    await fetchSeverities();
    await fetchRiskControlRatings();
    await fetchRiskMonitoringRatings();
    await fetchAdminName();
    await fetchVPAndPresidentNames();
  });
</script>

<div class="container mx-auto p-6">
  <h2 class="text-2xl font-bold mb-6">Risk Management</h2>

  <div class="flex gap-4 mb-4">
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
    <button class="btn btn-secondary" on:click={exportToPDF}>
      Export to PDF
    </button>
  </div>

  {#if isLoading}
    <div>Loading risks...</div>
  {:else if displayedRisks.length === 0}
    <div>No risks available.</div>
  {:else}
    <table class="table w-full">
      <thead>
        <tr>
          <th>Risk Statement</th>
          <th>Classification</th>
          <th>Actions</th>
          <th>Key Persons</th>
          <th>Budget</th>
          <th>Risk Assessments</th>
          <th>Approval Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each displayedRisks as risk}
          <tr>
            <td>{risk.rrn}</td>
            <td>{risk.risk_statement}</td>
            <td>
              {classification.find((cls) => cls.id === risk.classification)?.name || "N/A"}
            </td>
            <td>{risk.actions}</td>
            <td>{risk.key_persons}</td>
            <td>{risk.budget}</td>
            <td>
              {#each riskAssessments.filter((a) => a.risk_id === risk.id) as assessment}
                <div>
                  <strong>Likelihood:</strong> 
                  {likelihoodRatings.find((lr) => lr.id === assessment.lr)?.name || "N/A"}<br />
                  <strong>Severity:</strong> 
                  {severities.find((s) => s.id === assessment.s)?.value || "N/A"}<br />
                  <strong>Control Rating:</strong> 
                  {riskControlRatings.find((rcr) => rcr.id === assessment.rcr)?.name || "N/A"}<br />
                  <strong>Monitoring Rating:</strong> 
                  {riskMonitoringRatings.find((rmr) => rmr.id === assessment.rmr)?.status || "N/A"}
                </div>
              {/each}
            </td>
            <td class="flex gap-2">
              <button
                class="btn btn-sm btn-success"
                on:click={() => approveRisk(risk.id)}
                disabled={
                  isApproving ||
                  (userRole === "admin" && risk.is_approved) || // Admin cannot re-approve
                  (userRole === "vice_president" && (!risk.is_approved || risk.is_approved_vp)) || // VP cannot approve without Admin approval or if already approved
                  (userRole === "president" && (!risk.is_approved_vp || risk.is_approved_president)) 
                }
              >
                {userRole === "admin"
                  ? risk.is_approved
                    ? "Admin Approved"
                    : "Approve as Admin"
                  : userRole === "vice_president"
                  ? risk.is_approved_vp
                    ? "VP Approved"
                    : "Approve as VP"
                  : userRole === "president"
                  ? risk.is_approved_president
                    ? "President Approved"
                    : "Approve as President"
                  : "Approve"}
              </button>
              <button
                class="btn btn-sm btn-error"
                on:click={() => deleteRisk(risk.id)}
                disabled={deletingRiskId === risk.id}
              >
                {deletingRiskId === risk.id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
