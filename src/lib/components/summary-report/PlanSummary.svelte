<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { Download, Loader2 } from "lucide-svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";
	import { scale } from "svelte/transition";

	// Define types for our data structure
	type PlanMonitoring = {
		evaluation: string;
		statement: string;
		is_accomplished: boolean;
		time_completed: string;
	};

	type ActionPlan = {
		id: number;
		actions_taken: string;
		kpi: string;
		target_output: string;
		budget: number;
		key_person_responsible: string;
		plan_monitoring: PlanMonitoring;
	};

	type StrategicObjective = {
		id: number;
		name: string;
		strategic_initiatives: string;
		kpi: string;
		persons_involved: string;
		target: string;
		eval_measures: string;
		action_plans: ActionPlan[];
	};

	type StrategicGoal = {
		id: number;
		name: string;
		description: string;
		kpi: string;
		strategic_objectives: StrategicObjective[];
	};

	// Create reactive variables
	let plansData: StrategicGoal[] = $state([]);
	let loading = $state(true);

	// Fetch hierarchical data for plans
        const fetchPlansData = async () => {
    try {
        loading = true;

        // Fetch plans, objectives, and action plans
    const { data: plansDataRaw, error: plansError } = await supabase
        .from("strategic_goals")
        .select(`
            id,
            name,
            description,
            kpi,
            strategic_objectives (
            id,
            name,
            strategic_initiatives,
            kpi,
            persons_involved,
            target,
            eval_measures,
            action_plans (
                id,
                actions_taken,
                kpi,
                target_output,
                budget,
                key_person_responsible
            )
            )
        `);

        if (plansError) {
        console.error("Error fetching plans data:", plansError.message);
        return;
        }

        // Fetch plan monitoring data
        const { data: monitoringData, error: monitoringError } = await supabase
        .from("plan_monitoring")
        .select(`
            action_plan_id,
            evaluation,
            statement,
            is_accomplished,
            time_completed
        `);

        if (monitoringError) {
        console.error("Error fetching plan monitoring data:", monitoringError.message);
        return;
        }

        // Match plan monitoring data to action plans
        plansData = plansDataRaw.map((goal) => ({
        ...goal,
        strategic_objectives: goal.strategic_objectives.map((objective) => ({
            ...objective,
            action_plans: objective.action_plans.map((actionPlan) => ({
            ...actionPlan,
            plan_monitoring: monitoringData.find(
                (monitor) => monitor.action_plan_id === actionPlan.id
            ) || null, // Attach the corresponding plan_monitoring or null if not found
            })),
        })),
        }));
    } catch (error) {
        console.error("Unexpected error fetching plans data:", error);
    } finally {
        loading = false;
    }
    };


	// Generate PDF
	const generatePDF = () => {
		const doc = new jsPDF("landscape");
		doc.setFont("times", "normal");

		// Header
		doc.setFontSize(12);
		doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
		doc.text("Strategic Plans Report", 14, 16);
		doc.setFontSize(10);
		doc.text("SY 2024-2025", 14, 22);

		let yPosition = 28;

		plansData.forEach((goal, goalIndex) => {
			doc.setFont("times", "bold");
			doc.text(`Strategic Goal ${goalIndex + 1}: ${goal.name}`, 14, yPosition);
			doc.setFont("times", "normal");
			yPosition += 6;

			goal.strategic_objectives.forEach((objective, objectiveIndex) => {
				doc.text(`Objective ${goalIndex + 1}.${objectiveIndex + 1}: ${objective.name}`, 16, yPosition);
				yPosition += 6;

				const actionPlans = objective.action_plans.map((plan, planIndex) => [`${goalIndex + 1}.${objectiveIndex + 1}.${planIndex + 1}`, plan.actions_taken, plan.kpi, plan.target_output, plan.budget, plan.key_person_responsible, plan.plan_monitoring?.evaluation || "N/A", plan.plan_monitoring?.statement || "N/A", plan.plan_monitoring?.is_accomplished ? "Achieved" : "Pending", plan.plan_monitoring?.time_completed || "N/A"]);

				if (actionPlans.length > 0) {
					autoTable(doc, {
						startY: yPosition,
						head: [["#", "Action Plan", "KPI", "Target Output", "Budget", "Key Person Responsible", "Actions Taken to Achieve Action Plan", "Statement", "Accomplished", "Time Completed"]],
						body: actionPlans,
						theme: "grid",
						styles: { font: "times", fontSize: 10 },
						headStyles: { fillColor: [41, 128, 185] },
						margin: { left: 14 },
					});

					yPosition = doc.autoTable.previous.finalY + 10;
				}

				if (yPosition > doc.internal.pageSize.height - 30) {
					doc.addPage();
					yPosition = 28;
				}
			});

			yPosition += 10;
		});

		doc.save("Strategic_Plans_Report.pdf");
	};

	// Fetch data on mount
	fetchPlansData();
</script>

<div class="w-full min-h-screen bg-gray-50 text-gray-900">
	<div class="max-w-7xl mx-auto p-6">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-2xl font-bold text-gray-800">Strategic Planning Summary Report</h1>
			<button onclick={generatePDF} class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={loading}>
				<Download class="w-4 h-4" />
				Export PDF
			</button>
		</div>

		{#if loading}
			<div class="flex justify-center items-center p-12" transition:scale>
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="space-y-8">
				{#each plansData as goal}
					<div class="bg-white rounded-xl shadow-sm p-6" transition:scale>
						<h2 class="text-xl font-semibold text-gray-800 mb-4">
							Strategic Goal: {goal.name}
						</h2>
						<p class="text-gray-600 mb-6">{goal.description}</p>

						<div class="space-y-6">
							{#each goal.strategic_objectives as objective}
								<div class="border-l-4 border-blue-600 pl-4">
									<h3 class="font-medium text-gray-800 mb-3">
										Strategic Objective: {objective.name}
									</h3>

									<div class="grid gap-4 md:grid-cols-2 mb-4">
										<div class="p-3 bg-gray-50 rounded">
											<span class="text-sm font-medium text-gray-600">KPI:</span>
											<p class="mt-1">{objective.kpi}</p>
										</div>
										<div class="p-3 bg-gray-50 rounded">
											<span class="text-sm font-medium text-gray-600">Target:</span>
											<p class="mt-1">{objective.target}</p>
										</div>
									</div>

									<div class="space-y-4">
										{#each objective.action_plans as plan}
											<div class="bg-gray-50 rounded-lg p-4">
												<h4 class="font-medium text-gray-800 mb-2">
													Action Plan: {plan.actions_taken}
												</h4>

												<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
													<div>
														<span class="text-sm text-gray-600">KPI</span>
														<p class="mt-1 font-medium">{plan.kpi}</p>
													</div>
													<div>
														<span class="text-sm text-gray-600">Target Output</span>
														<p class="mt-1 font-medium">{plan.target_output}</p>
													</div>
													<div>
														<span class="text-sm text-gray-600">Budget</span>
														<p class="mt-1 font-medium">${plan.budget}</p>
													</div>
													<div>
														<span class="text-sm text-gray-600">Responsible</span>
														<p class="mt-1 font-medium">{plan.key_person_responsible}</p>
													</div>
												</div>

												{#if plan.plan_monitoring}
													<div class="mt-4 pt-4 border-t border-gray-200">
														<h5 class="text-sm font-medium text-gray-600 mb-3">Monitoring Details</h5>
														<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
															<div>
																<span class="text-sm text-gray-600">Actions Taken to Achieve Action Plan</span>
																<p class="mt-1">{plan.plan_monitoring.evaluation}</p>
															</div>
															<div>
																<span class="text-sm text-gray-600">Statement</span>
																<p class="mt-1">{plan.plan_monitoring.statement}</p>
															</div>
															<div>
																<span class="text-sm text-gray-600">Status</span>
																<p class="mt-1">
																	<span class={plan.plan_monitoring.is_accomplished ? "text-green-600" : "text-red-600"}>
																		{plan.plan_monitoring.is_accomplished ? "Accomplished" : "Pending"}
																	</span>
																</p>
															</div>
															<div>
																<span class="text-sm text-gray-600">Completed</span>
                                                                <p class="mt-1">{new Date(plan.plan_monitoring.time_completed).toLocaleString()}</p>
															</div>
														</div>
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
