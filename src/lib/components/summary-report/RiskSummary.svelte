<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { Download, Loader2, Search, ArrowUpDown } from "lucide-svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";
	import { scale } from "svelte/transition";

	// Define types for data structure
	type RiskMonitoring = {
		department: string;
		rrn: string;
		risk_statement: string;
		likelihood_rating: string | null;
		severity: string | null;
		control_rating: string | null;
		monitoring_rating: string | null;
		status: string;
	};

	let risksSummary: RiskMonitoring[] = $state([]);
	let loading = $state(true);

	// Filters
	let searchQuery: string = $state("");
	let statusFilter: string = $state("all");
	let departmentFilter: string = $state("all");

	// Sorting
	let sortField: keyof RiskMonitoring = $state("rrn");
	let sortDirection: "asc" | "desc" = $state("asc");

	// Fetch risk monitoring data
	const fetchRiskMonitoringData = async () => {
		try {
			loading = true;
			const { data, error } = await supabase.from("risk_monitoring").select(`
				id,
				risks (
					rrn,
					risk_statement,
					departments (name)
				),
				likelihood_rating:likelihood_rating_id(name),
				severity:severity_id(name),
				control_rating:control_rating_id(name),
				monitoring_rating:monitoring_rating_id(status),
				is_achieved
			`);

			if (error) throw error;

			risksSummary = data.map((item: any) => ({
				department: item.risks?.departments?.name || "N/A",
				rrn: item.risks?.rrn || "N/A",
				risk_statement: item.risks?.risk_statement || "N/A",
				likelihood_rating: item.likelihood_rating?.name || "N/A",
				severity: item.severity?.name || "N/A",
				control_rating: item.control_rating?.name || "N/A",
				monitoring_rating: item.monitoring_rating?.status || "N/A",
				status: item.is_achieved ? "Achieved" : "Still Mitigating",
			}));
		} catch (error) {
			console.error("Error fetching risk monitoring data:", error);
		} finally {
			loading = false;
		}
	};

	/** Toggle Sort */
	const toggleSort = (field: keyof RiskMonitoring) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
	};

	/** Derived filtered and sorted data */
	const filteredRisks = $derived(
		risksSummary
			.filter((risk) => {
				const matchesSearch = `${risk.rrn} ${risk.risk_statement} ${risk.department}`.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesStatus = statusFilter === "all" || risk.status === statusFilter;
				const matchesDepartment = departmentFilter === "all" || risk.department === departmentFilter;
				return matchesSearch && matchesStatus && matchesDepartment;
			})
			.sort((a, b) => {
				const aValue = String(a[sortField]);
				const bValue = String(b[sortField]);
				return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			})
	);

	// Generate PDF
	const generatePDF = () => {
		const doc = new jsPDF("landscape");
		doc.setFont("times", "normal");
		doc.setFontSize(12);

		if (departmentFilter === "all") {
			const departments = [...new Set(filteredRisks.map((risk) => risk.department))];

			departments.forEach((department, deptIndex) => {
				doc.addPage();
				doc.text(`${deptIndex === 0 ? "" : "MANUEL S. ENVERGA UNIVERSITY FOUNDATION"}`, 14, 10);
				doc.text(`${department} Risk Report`, 14, 16);
				doc.text("Risk Summary Report", 14, 22);
				doc.setFontSize(10);
				let yPosition = 28;

				const departmentRisks = filteredRisks.filter((risk) => risk.department === department);

				departmentRisks.forEach((risk, index) => {
					doc.setFont("times", "bold");
					doc.text(`Risk ${index + 1}: ${risk.risk_statement}`, 14, yPosition);
					doc.setFont("times", "normal");
					yPosition += 6;

					const rows = [
						[
							risk.rrn,
                            risk.risk_statement,
							risk.likelihood_rating,
							risk.severity,
							risk.control_rating,
							risk.monitoring_rating,
							risk.status,
						],
					];

					autoTable(doc, {
						startY: yPosition,
						head: [["RRN", "Risk Statement", "Likelihood", "Severity", "Control", "Monitoring", "Status"]],
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
			});
		} else {
			// For a single department
			doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
			doc.text(`Department: ${departmentFilter}`, 14, 16);
			doc.text("Risk Monitoring Summary Report", 14, 22);
			doc.setFontSize(10);

			let yPosition = 28;

			filteredRisks.forEach((risk, index) => {
				doc.setFont("times", "bold");
				doc.text(`Risk ${index + 1}: ${risk.risk_statement}`, 14, yPosition);
				doc.setFont("times", "normal");
				yPosition += 6;

				const rows = [
					[
						risk.rrn,
                        risk.risk_statement,
						risk.likelihood_rating,
						risk.severity,
						risk.control_rating,
						risk.monitoring_rating,
						risk.status,
					],
				];

				autoTable(doc, {
					startY: yPosition,
					head: [["RRN", "Risk Statement","Likelihood", "Severity", "Control", "Monitoring", "Status"]],
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

		doc.save("RiskMonitoringSummary.pdf");
	};

	// Fetch data on mount
	fetchRiskMonitoringData();
</script>

<div class="w-full min-h-screen">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-2xl font-bold">Risks Summary Report</h1>
			<button onclick={generatePDF} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial" disabled={loading}>
				<Download class="w-4 h-4" />
				Export PDF
			</button>
		</div>

        <div class="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div class="relative flex-1 md:max-w-[300px]">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input type="text" bind:value={searchQuery} placeholder="Search risks..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <select bind:value={departmentFilter} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
                    <option value="all">All Departments</option>
                    {#each [...new Set(risksSummary.map((risk) => risk.department))] as department}
                        <option value={department}>{department}</option>
                    {/each}
                </select>
                <select bind:value={statusFilter} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
                    <option value="all">All Status</option>
                    <option value="Achieved">Achieved</option>
                    <option value="Still Mitigating">Still Mitigating</option>
                </select>
            </div>
        </div>

		{#if loading}
			<div class="flex justify-center items-center p-12" transition:scale>
                <!--Loading spinner-->
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else if filteredRisks.length > 0}
			<div class="space-y-8">
				{#each filteredRisks as risk}
					<div class="bg-card rounded-lg p-4 border border-border  shadow-sm" transition:scale>
						<h2 class="text-xl font-semibold  mb-4 text-primary">
							Risk: {risk.risk_statement}
						</h2>

						<div class="grid gap-4 md:grid-cols-2 mb-4">
							<div class="p-3  rounded">
								<span class="text-sm font-medium ">RRN:</span>
								<p class="mt-1">{risk.rrn}</p>
							</div>
							<div class="p-3 rounded">
								<span class="text-sm font-medium">Likelihood:</span>
								<p class="mt-1">{risk.likelihood_rating}</p>
							</div>
							<div class="p-3 rounded">
								<span class="text-sm font-medium">Severity:</span>
								<p class="mt-1">{risk.severity}</p>
							</div>
							<div class="p-3 rounded">
								<span class="text-sm font-medium">Control:</span>
								<p class="mt-1">{risk.control_rating}</p>
							</div>
						</div>

						<div class="mt-4 pt-4 mx-4 border-t border-gray-200">
							<h5 class="text-sm font-medium  mb-3">Monitoring Details</h5>
							<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<div>
									<span class="text-sm">Monitoring Rating</span>
									<p class="mt-1">{risk.monitoring_rating}</p>
								</div>
								<div>
									<span class="text-sm">Status</span>
									<p class="mt-1">{risk.status}</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12 bg-card rounded-lg shadow">
				<p class="text-muted-foreground">No risks found.</p>
			</div>
		{/if}
	</div>
</div>
