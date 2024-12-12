<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { Search, ArrowUpDown, Loader2, Eye, XCircle, CheckCircle, X } from "lucide-svelte";
	import { fade, slide } from "svelte/transition";

	/** Types */
	type ActionPlan = {
		id: number;
		actions_taken: string;
		kpi: string;
		target_output: string;
		objective_id: number;
		strategic_goal_name: string;
		objective_name: string;
		is_accomplished: boolean;
		evaluation: string | null;
		statement: string | null;
		time_completed: string | null;
		isLoading: boolean;
	};

	/** State Variables */
	let searchTerm: string = $state("");
	let sortBy: "strategic_goal_name" | "objective_name" = $state("strategic_goal_name");
	let sortAsc: boolean = $state(true);
	let selectedStatus: string = $state("all");
	let selectedGoal: string = $state("all");
	let showEvaluationModal: boolean = $state(false);
	let selectedPlan: ActionPlan | null = $state(null);
	let evaluationText: string = $state("");
	let showDialog: boolean = $state(false);
	let dialogStatement: string = $state("");
	let isLoadingPage: boolean = $state(true);
	let actionPlans: ActionPlan[] = $state([]);
	let profileId: string | null = $state(null);

	/** Pagination state */
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);

	/** Derived Values */
	const uniqueGoals = $derived(["all", ...new Set(actionPlans.map((plan) => plan.strategic_goal_name))]);

	const filteredPlans = $derived(
		actionPlans.filter((plan) => {
			const matchesSearch = plan.strategic_goal_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.objective_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.actions_taken.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = selectedStatus === "all" ? true : selectedStatus === "achieved" ? plan.is_accomplished : !plan.is_accomplished;
			const matchesGoal = selectedGoal === "all" || plan.strategic_goal_name === selectedGoal;
			return matchesSearch && matchesStatus && matchesGoal;
		})
	);

	const sortedAndPaginatedPlans = $derived(
		filteredPlans
			.sort((a, b) => {
				const compareValue = sortAsc ? 1 : -1;
				return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
			})
			.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(filteredPlans.length / itemsPerPage));

	/** Sort table data */
	const toggleSort = (column: typeof sortBy) => {
		if (sortBy === column) {
			sortAsc = !sortAsc;
		} else {
			sortBy = column;
			sortAsc = true;
		}
	};

	/** Rest of the existing functions */
	const openEvaluationModal = (plan: ActionPlan) => {
		selectedPlan = plan;
		evaluationText = plan.evaluation || "";
		showEvaluationModal = true;
	};

	const closeEvaluationModal = () => {
		showEvaluationModal = false;
		selectedPlan = null;
		evaluationText = "";
	};

	const openDialog = (statement: string) => {
		dialogStatement = statement;
		showDialog = true;
	};
	/** Fetch user profile */
	const fetchUserProfile = async () => {
		try {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error || !session) throw error;
			profileId = session.user.id;
		} catch (error) {
			console.error("Error fetching session:", error);
		}
	};

	/** Fetch plan monitoring data */
	const fetchPlanMonitoringData = async (planIds: number[]) => {
		try {
			const { data, error } = await supabase.from("plan_monitoring").select("action_plan_id, is_accomplished, evaluation, statement, time_completed").in("action_plan_id", planIds);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error fetching monitoring data:", error);
			return [];
		}
	};

	/** Fetch action plans */
	const fetchActionPlans = async () => {
		try {
			const { data: userProfile, error: profileError } = await supabase
				.from("profiles")
				.select("department_id")
				.eq("id", profileId)
				.single();

			if (profileError || !userProfile?.department_id) throw profileError;

			const { data: profileIds, error: profileIdsError } = await supabase
				.from("profiles")
				.select("id")
				.eq("department_id", userProfile.department_id);

			if (profileIdsError) throw profileIdsError;

			const profileIdList = profileIds.map((profile) => profile.id);

			const { data, error } = await supabase
				.from("action_plans")
				.select(`
					id,
					actions_taken,
					kpi,
					target_output,
					objective_id,
					strategic_objectives (
						name,
						strategic_goals (name)
					),
					is_approved
				`)
				.in("profile_id", profileIdList)
				.eq("is_approved", true);

			if (error) throw error;

			const plans = data.map((plan: any) => ({
				id: plan.id,
				actions_taken: plan.actions_taken,
				kpi: plan.kpi,
				target_output: plan.target_output || "No Target Output",
				objective_id: plan.objective_id,
				strategic_goal_name: plan.strategic_objectives?.strategic_goals?.name || "No Goal Assigned",
				objective_name: plan.strategic_objectives?.name || "No Objective Assigned",
				is_accomplished: false,
				evaluation: null,
				statement: null,
				time_completed: null,
				isLoading: false,
			}));

			const monitoringData = await fetchPlanMonitoringData(plans.map((p) => p.id));

			actionPlans = plans.map((plan) => {
				const monitoring = monitoringData.find((m) => m.action_plan_id === plan.id);
				return {
					...plan,
					is_accomplished: monitoring?.is_accomplished || false,
					evaluation: monitoring?.evaluation || null,
					statement: monitoring?.statement || null,
					time_completed: monitoring?.time_completed || null,
				};
			});
		} catch (error) {
			console.error("Error fetching action plans:", error);
		} finally {
			isLoadingPage = false;
		}
	};


	/** Evaluate action plan using AI */
	const evaluateActionPlan = async () => {
		if (!selectedPlan) return;

		actionPlans = actionPlans.map((plan) => (plan.id === selectedPlan?.id ? { ...plan, isLoading: true } : plan));

		try {
			const response = await fetch("/api/evaluate-goal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ target: selectedPlan.target_output, evaluation: evaluationText }),
			});

			const data = await response.json();
			if (!response.ok || data.error) throw new Error(data.error || "Failed to evaluate action plan.");

			const aiEvaluation = data.aiEvaluation;
			if (typeof aiEvaluation !== "string") throw new TypeError("AI evaluation response is not valid.");

			const negativeKeywords = ["not achieved", "unsuccessful", "failed", "incomplete", "fell short", "below target", "did not meet", "not"];
			const isAccomplished = !negativeKeywords.some((neg) => aiEvaluation.toLowerCase().includes(neg));
			const timeCompleted = isAccomplished ? new Date().toISOString() : null;

			const { error } = await supabase
				.from("plan_monitoring")
				.update({
					evaluation: evaluationText,
					statement: aiEvaluation,
					is_accomplished: isAccomplished,
					time_completed: timeCompleted,
				})
				.eq("action_plan_id", selectedPlan.id);

			if (error) throw error;

			actionPlans = actionPlans.map((plan) =>
				plan.id === selectedPlan?.id
					? {
							...plan,
							is_accomplished: isAccomplished,
							evaluation: evaluationText,
							statement: aiEvaluation,
							time_completed: timeCompleted,
							isLoading: false,
						}
					: plan
			);

			closeEvaluationModal();
		} catch (error) {
			console.error("Error evaluating action plan:", error);
			actionPlans = actionPlans.map((plan) => (plan.id === selectedPlan?.id ? { ...plan, isLoading: false } : plan));
		}
	};

	onMount(async () => {
		await fetchUserProfile();
		await fetchActionPlans();
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto min-h-screen bg-background text-foreground">
	<!-- Fixed Header with responsive design -->
	<div class="flex flex-col gap-4">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<h1 class="text-2xl font-bold">Plans Monitoring</h1>
			
		</div>
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="relative flex-1 sm:flex-none max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="search" bind:value={searchTerm} placeholder="Search plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<select bind:value={selectedStatus} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-[200px]">
				<option value="all">All Status</option>
				<option value="achieved">Achieved</option>
				<option value="pending">Pending</option>
			</select>
			<select bind:value={selectedGoal} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-[200px]">
				{#each uniqueGoals as goal}
					<option value={goal}>{goal === "all" ? "All Goals" : goal}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Main content -->
	<div class="flex-1">
		{#if isLoadingPage}
		<div class="flex items-center justify-center min-h-screen ">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		  </div>
		{:else if sortedAndPaginatedPlans.length > 0}
			<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
				<table class="min-w-full table-auto">
					<thead class="bg-muted/50">
						<tr>
							<th class="px-4 py-3 text-left">
								<button onclick={() => toggleSort("strategic_goal_name")} class="flex items-center gap-1">
									Strategic Goal
									<ArrowUpDown size={16} class={sortBy === "strategic_goal_name" ? "text-primary" : ""} />
								</button>
							</th>
							<th class="px-4 py-3 text-left">
								<button onclick={() => toggleSort("objective_name")} class="flex items-center gap-1">
									Objective
									<ArrowUpDown size={16} class={sortBy === "objective_name" ? "text-primary" : ""} />
								</button>
							</th>
							<th class="px-4 py-3 text-left">Action Plans</th>
							<th class="px-4 py-3 text-left">KPI</th>
							<th class="px-4 py-3">Target Output</th>
                            <th>Actions Taken</th>
							<th class="px-4 py-3 text-left">Status</th>
							<th class="px-4 py-3 text-center">View Statement</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each sortedAndPaginatedPlans as plan}
							<tr class="hover:bg-muted/50">
								<td class="px-4 py-3">{plan.strategic_goal_name}</td>
								<td class="px-4 py-3">{plan.objective_name}</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-2">
										<p class="line-clamp-2">{plan.actions_taken}</p>
										
									</div>
								</td>
								<td class="px-4 py-3">{plan.kpi}</td>
								<td class="px-4 py-3">{plan.target_output}</td>
                                <td class="px-4 py-3"> 
                                    {#if plan.isLoading}
											<Loader2 class="animate-spin h-5 w-5 text-primary ml-2" />
										{:else if !plan.is_accomplished}
											<button onclick={() => openEvaluationModal(plan)} class="shrink-0 inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">Evaluate</button>
										{/if}
                                </td>
								<td class="px-4 py-3">
									<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium {plan.is_accomplished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
										{#if plan.is_accomplished}
											<CheckCircle size={14} />
											Achieved
										{:else}
											<XCircle size={14} />
											Pending
										{/if}
									</span>
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center justify-center">
										{#if plan.statement}
											<button onclick={() => openDialog(plan.statement || "")} class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-md">
												<Eye size={16} />
												View
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
				<div class="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPlans.length)} of {filteredPlans.length} results
				</div>
				<div class="flex flex-col sm:flex-row items-center gap-4">
					<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto">
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
		{:else}
			<div class="text-center py-12 bg-card rounded-lg shadow">
				<p class="text-muted-foreground">No action plans found.</p>
			</div>
		{/if}
	</div>

	<!-- Evaluation Modal -->
	{#if showEvaluationModal}
		<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div transition:slide={{ duration: 200 }} class="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4">
				<div class="flex items-center justify-between p-4 border-b border-border">
					<h2 class="text-lg font-semibold">Actions Taken</h2>
					<button onclick={closeEvaluationModal} class="p-1 hover:bg-muted rounded-full">
						<X size={20} />
					</button>
				</div>
				<div class="p-4">
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Action Plan</label>
						<p class="text-muted-foreground">{selectedPlan?.actions_taken}</p>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">KPI</label>
						<p class="text-muted-foreground">{selectedPlan?.kpi}</p>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Target Output</label>
						<p class="text-muted-foreground">{selectedPlan?.target_output}</p>
					</div>
					<div class="mb-6">
						<label class="block text-sm font-medium mb-1">Actions Taken to Achieve Action Plan</label>
						<textarea bind:value={evaluationText} class="w-full h-32 px-3 py-2 text-sm bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Enter your actions..." />
					</div>
					<div class="flex justify-end gap-3">
						<button onclick={closeEvaluationModal} class="px-4 py-2 text-sm hover:bg-muted rounded-md">Cancel</button>
						<button onclick={evaluateActionPlan} class="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md" disabled={!evaluationText || selectedPlan?.isLoading}>
							{selectedPlan?.isLoading ? "Evaluating..." : "Submit"}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Dialog -->
	{#if showDialog}
		<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div transition:slide={{ duration: 200 }} class="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4">
				<div class="flex items-center justify-between p-4 border-b border-border">
					<h2 class="text-lg font-semibold">Evaluation Statement</h2>
					<button onclick={() => (showDialog = false)} class="p-1 hover:bg-muted rounded-full">
						<X size={20} />
					</button>
				</div>
				<div class="p-4">
					<div class="bg-muted rounded-lg p-4 text-muted-foreground max-h-[60vh] overflow-y-auto break-words">
						{dialogStatement}
					</div>
					<div class="flex justify-end mt-4">
						<button onclick={() => (showDialog = false)} class="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">Close</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
