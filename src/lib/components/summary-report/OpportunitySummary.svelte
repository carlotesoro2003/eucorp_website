<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { Download, Loader2 } from "lucide-svelte";
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";
    import {Search} from "lucide-svelte";

    // Define types for data structure
    type OpportunityMonitoring = {
        opt_id: number;
        opt_statement: string;
        kpi: string;
        planned_actions: string;
        time_completed: string | null;
        evaluation: string;
        statement: string | null;
        is_accomplished: boolean;
        department_name: string;
    };

    let opportunities: OpportunityMonitoring[] = $state([]);
    let departments: string[] = $state([]);
    let selectedDepartment: string = $state("All Departments");
    let selectedStatus: string = $state("all"); // Status filter
    let searchQuery: string = $state(""); // Search query
    let loading = $state(true);

    // Fetch opt_monitoring and join with opportunities and departments
    const fetchOpportunitiesData = async () => {
        try {
            loading = true;

            // Fetch opportunities with monitoring and department data
            const { data: monitoringData, error: monitoringError } = await supabase
                .from("opt_monitoring")
                .select(`
                    opt_id,
                    time_completed,
                    evaluation,
                    statement,
                    is_accomplished,
                    opportunities (
                        opt_statement,
                        kpi,
                        planned_actions,
                        departments (name)
                    )
                `);

            if (monitoringError) {
                console.error("Error fetching monitoring data:", monitoringError.message);
                return;
            }

            opportunities = monitoringData.map((monitoring) => ({
                opt_id: monitoring.opt_id,
                opt_statement: monitoring.opportunities?.opt_statement || "No Statement",
                kpi: monitoring.opportunities?.kpi || "No KPI",
                planned_actions: monitoring.opportunities?.planned_actions || "No Actions Taken",
                time_completed: monitoring.time_completed,
                evaluation: monitoring.evaluation || "No Evaluation",
                statement: monitoring.statement || "No Statement",
                is_accomplished: monitoring.is_accomplished || false,
                department_name: monitoring.opportunities?.departments?.name || "No Department",
            }));

            // Fetch unique departments
            const departmentSet = new Set(opportunities.map((opportunity) => opportunity.department_name));
            departments = Array.from(departmentSet).sort();
            departments.unshift("All Departments"); // Add "all" option
        } catch (error) {
            console.error("Error fetching opportunities data:", error);
        } finally {
            loading = false;
        }
    };

    // Filter opportunities by department, status, and search query
    const filteredOpportunities = $derived(
        opportunities.filter(
            (opportunity) =>
                (selectedDepartment === "All Departments" || opportunity.department_name === selectedDepartment) &&
                (selectedStatus === "all" ||
                    (selectedStatus === "true" && opportunity.is_accomplished) ||
                    (selectedStatus === "false" && !opportunity.is_accomplished)) &&
                (opportunity.opt_statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    opportunity.kpi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    opportunity.planned_actions.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF("landscape");
        doc.setFont("times", "normal");

        // Header
        doc.setFontSize(12);
        doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
        doc.text("Opportunities Monitoring Report", 14, 16);
        doc.setFontSize(10);
        doc.text("SY 2024-2025", 14, 22);

        let yPosition = 28;

        // Separate by department if "all" is selected
        const groupedOpportunities = selectedDepartment === "All Departments"
            ? opportunities.reduce((acc, opportunity) => {
                    if (!acc[opportunity.department_name]) acc[opportunity.department_name] = [];
                    acc[opportunity.department_name].push(opportunity);
                    return acc;
            }, {})
            : { [selectedDepartment]: filteredOpportunities };

        for (const [department, ops] of Object.entries(groupedOpportunities)) {
            doc.setFont("times", "bold");
            doc.text(`Department: ${department}`, 14, yPosition);
            yPosition += 10;

            ops.forEach((opportunity, index) => {
                doc.setFont("times", "bold");
                doc.text(`Opportunity ${index + 1}: ${opportunity.opt_statement}`, 14, yPosition);
                doc.setFont("times", "normal");
                yPosition += 6;

                const rows = [
                    [
                        opportunity.kpi,
                        opportunity.planned_actions,
                        opportunity.evaluation,
                        opportunity.statement,
                        opportunity.is_accomplished ? "Yes" : "No",
                        opportunity.time_completed || "Pending",
                    ],
                ];

                autoTable(doc, {
                    startY: yPosition,
                    head: [
                        ["KPI", "Planned Actions", "Actions Taken to Achieve Opportunity", "Statement", "Accomplished", "Time Completed"],
                    ],
                    body: rows,
                    theme: "grid",
                    styles: { font: "times", fontSize: 10 },
                    headStyles: { fillColor: [41, 128, 185] },
                    margin: { left: 14 },
                });

                yPosition = doc.autoTable.previous.finalY + 10;

                if (yPosition > doc.internal.pageSize.height - 30) {
                    doc.addPage();
                    yPosition = 28;
                }
            });
        }

        doc.save("Opportunities_Report.pdf");
    };

    // Fetch data on mount
    fetchOpportunitiesData();
</script>

<div class="w-full min-h-screen ">
    <div class="max-w-7xl mx-auto p-6">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold  flex items-center gap-2">
                <!-- <Download class="w-6 h-6 text-blue-600" /> -->
                Opportunities Summary Report
            </h1>
            <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mt-4">
                <div class="relative flex-1 w-full max-w-sm">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input type="text" bind:value={searchQuery} placeholder="Search opportunities..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <select
                        bind:value={selectedDepartment}
                        class="px-3 py-2  bg-secondary   rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                    
                        {#each departments as department}
                            <option value={department}>{department}</option>
                        {/each}
                    </select>
                    <select
                        bind:value={selectedStatus}
                        class="px-3 py-2   bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="all">All Status</option>
                        <option value="true">Accomplished</option>
                        <option value="false">Still Pending</option>
                    </select>
                    <button
                        onclick={generatePDF}
                        class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial"
                        disabled={loading}
                    >
                        <Download class="w-4 h-4" />
                        Export PDF
                    </button>
                </div>
            </div>
        </div>

        {#if loading}
            <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        {:else if filteredOpportunities.length > 0}
            <div class="space-y-8">
                {#each filteredOpportunities as opportunity}
                    <div class="bg-card rounded-lg p-4 border border-border  shadow-sm">
                        <h2 class="text-xl font-semibold mb-4 text-primary">
                            Opportunity: {opportunity.opt_statement}
                        </h2>

                        <div class="grid gap-4 md:grid-cols-2 mb-4">
                            <div class="p-3  rounded">
                                <span class="text-sm font-medium ">KPI:</span>
                                <p class="mt-1">{opportunity.kpi}</p>
                            </div>
                            <div class="p-3  rounded">
                                <span class="text-sm font-medium ">Planned Actions:</span>
                                <p class="mt-1">{opportunity.planned_actions}</p>
                            </div>
                        </div>

                        <div class="mt-4 pt-4 mx-4 border-t border-gray-200">
                            <h5 class="text-md font-medium  mb-3">Monitoring Details</h5>
                            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <span class="text-sm font-medium">Actions Taken to Achieve Opportunity</span>
                                    <p class="mt-1 text-sm">{opportunity.evaluation}</p>
                                </div>
                                <div>
                                    <span class="text-sm font-medium">Statement</span>
                                    <p class="mt-1 text-sm">{opportunity.statement}</p>
                                </div>
                                <div>
                                    <span class="text-sm font-medium">Accomplished</span>
                                    <p class="mt-1 text-sm">
                                        <span class={opportunity.is_accomplished ? "text-green-600" : "text-red-600"}>
                                            {opportunity.is_accomplished ? "Yes" : "No"}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <span class="text-sm font-medium">Time Completed</span>
                                    <p class="mt-1 text-sm">{opportunity.time_completed ? new Date(opportunity.time_completed).toLocaleString() : "Pending"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-12 bg-card rounded-lg shadow">
                <p class="text-muted-foreground">No opportunities found.</p>
            </div>
        {/if}
    </div>
</div>
