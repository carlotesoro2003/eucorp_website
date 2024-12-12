<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { Search, ArrowUpDown, Loader2, Eye, XCircle, CheckCircle, X, Lightbulb } from "lucide-svelte";
	import { fade, slide } from "svelte/transition";

	interface MonitoringOpportunity {
		opt_id: number;
		opt_statement: string;
		kpi: string;
		planned_actions: string;
		time_completed: string | null;
		evaluation: string;
		statement: string | null;
	}

	// State variables
	let opportunities: MonitoringOpportunity[] = $state([]);
	let profileId: string | null = $state(null);
	let isLoading: boolean = $state(true);
	let showDialog: boolean = $state(false);
	let dialogStatement: string = $state("");
	let showEvaluationModal: boolean = $state(false);
	let selectedGoal: any = $state(null);
	let evaluationText: string = $state("");
	let searchTerm: string = $state("");
	let sortBy: "opt_statement" | "kpi" = $state("opt_statement");
	let sortAsc: boolean = $state(true);
	let selectedStatus: string = $state("all");

	/** Pagination state */
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);

	let goals: {
		id: number;
		statement: string;
		goal: string;
		evaluation: string;
		achieved: string | null;
		isLoading: boolean;
		timeCompleted: string | null;
		aiStatement: string | null;
	}[] = $state([]);

	/** Derived values */
	const filteredGoals = $derived(
		goals.filter((goal) => {
			const matchesSearch = goal.statement.toLowerCase().includes(searchTerm.toLowerCase()) || goal.goal.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = selectedStatus === "all" ? true : selectedStatus === "achieved" ? goal.achieved === "Achieved" : goal.achieved !== "Achieved";
			return matchesSearch && matchesStatus;
		})
	);

	const sortedAndPaginatedGoals = $derived(
		filteredGoals
			.sort((a, b) => {
				const compareValue = sortAsc ? 1 : -1;
				const aValue = sortBy === "opt_statement" ? a.statement : a.goal;
				const bValue = sortBy === "opt_statement" ? b.statement : b.goal;
				return aValue > bValue ? compareValue : -compareValue;
			})
			.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(filteredGoals.length / itemsPerPage));

	/** Sort table data */
	const toggleSort = (column: typeof sortBy) => {
		if (sortBy === column) {
			sortAsc = !sortAsc;
		} else {
			sortBy = column;
			sortAsc = true;
		}
	};

	/** Open dialog with statement */
	function openDialog(statement: string) {
		dialogStatement = statement;
		showDialog = true;
	}

	/** Open evaluation modal */
	function openEvaluationModal(goal: any) {
		selectedGoal = goal;
		evaluationText = goal.evaluation;
		showEvaluationModal = true;
	}

	/** Close evaluation modal */
	function closeEvaluationModal() {
		showEvaluationModal = false;
		selectedGoal = null;
		evaluationText = "";
	}

	/** Rest of your existing functions */
	const fetchUserProfile = async () => {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();
		if (error || !session) {
			console.error("Error fetching session:", error);
			return;
		}

		const { user } = session;
		const { data: profileData, error: profileError } = await supabase.from("profiles").select("id").eq("id", user.id).single();

		if (profileError || !profileData) {
			console.error("Error fetching profile:", profileError);
			return;
		}

		profileId = profileData.id;
	};

	/** Fetch opportunities */
	const fetchOpportunities = async () => {
		try {
			const { data: userProfile, error: profileError } = await supabase.from("profiles").select("department_id").eq("id", profileId).single();

			if (profileError || !userProfile?.department_id) {
				console.error("Error fetching user profile or department:", profileError);
				return;
			}

			const deptId = userProfile.department_id;

			const { data: profileIds, error: profileIdsError } = await supabase.from("profiles").select("id").eq("department_id", deptId);

			if (profileIdsError) {
				console.error("Error fetching profile IDs:", profileIdsError);
				return;
			}

			const profileIdList = profileIds.map((profile) => profile.id);

			const { data, error } = await supabase
				.from("opt_monitoring")
				.select(
					`
                    opt_id,
                    time_completed,
                    evaluation,
                    statement,
                    opportunities (opt_statement, kpi, planned_actions)
                `
				)
				.in("profile_id", profileIdList);

			if (error) {
				console.error("Error fetching opportunities:", error);
				return;
			}

			opportunities = data.map((monitoringItem: any) => ({
				opt_id: monitoringItem.opt_id,
				opt_statement: monitoringItem.opportunities?.opt_statement || "No Statement",
				kpi: monitoringItem.opportunities?.kpi || "No KPI",
				planned_actions: monitoringItem.opportunities?.planned_actions || "No Actions Taken",
				time_completed: monitoringItem.time_completed,
				evaluation: monitoringItem.evaluation || "",
				statement: monitoringItem.statement || null,
			}));

			goals = opportunities.map((opportunity) => ({
				id: opportunity.opt_id,
				statement: opportunity.opt_statement,
				goal: opportunity.kpi,
				evaluation: opportunity.evaluation || "",
				achieved: opportunity.time_completed ? "Achieved" : null,
				isLoading: false,
				timeCompleted: opportunity.time_completed,
				aiStatement: opportunity.statement || null,
			}));
		} catch (error) {
			console.error("Error fetching opportunities:", error);
		} finally {
			isLoading = false;
		}
	};

	/** Evaluate a single goal */
	async function evaluateGoal() {
		if (!selectedGoal) return;

		goals = goals.map((g) => (g.id === selectedGoal.id ? { ...g, isLoading: true } : g));

		try {
			const response = await fetch("/api/evaluate-goal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					target: selectedGoal.goal,
					evaluation: evaluationText,
				}),
			});

			const data = await response.json();

			if (!response.ok || data.error) {
				throw new Error(data.error || "Failed to evaluate goal.");
			}

			const aiEvaluation = data.aiEvaluation;

			if (typeof aiEvaluation !== "string") {
				throw new TypeError("AI evaluation response is not a valid string.");
			}

			const negativeKeywords = ["not achieved", "unsuccessful", "failed", "incomplete", "fell short", "below target", "did not meet", "not", "not been achieved"];
			const isAchieved = !negativeKeywords.some((neg) => aiEvaluation.toLowerCase().includes(neg));
			const timeCompleted = isAchieved ? new Date().toISOString() : null;

			const { error } = await supabase
				.from("opt_monitoring")
				.update({
					time_completed: timeCompleted,
					evaluation: evaluationText,
					statement: aiEvaluation,
					is_accomplished: isAchieved,
				})
				.eq("opt_id", selectedGoal.id);

			if (error) {
				console.error("[ERROR] Error updating opt_monitoring:", error);
			} else {
				goals = goals.map((g) =>
					g.id === selectedGoal.id
						? {
								...g,
								achieved: isAchieved ? "Achieved" : "Not Achieved",
								isLoading: false,
								timeCompleted,
								aiStatement: aiEvaluation,
								evaluation: evaluationText,
							}
						: g
				);
				closeEvaluationModal();
			}
		} catch (error) {
			console.error("[ERROR] Error evaluating goal:", error);
			goals = goals.map((g) => (g.id === selectedGoal.id ? { ...g, isLoading: false } : g));
		}
	}

	onMount(async () => {
		await fetchUserProfile();
		await fetchOpportunities();
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto min-h-screen bg-background text-foreground">
	<!-- Fixed Header with responsive design -->
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<Lightbulb class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Opportunities Monitoring</h1>
		</div>
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="relative flex-1 sm:flex-none max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="search" bind:value={searchTerm} placeholder="Search opportunities..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<select bind:value={selectedStatus} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-[200px]">
				<option value="all">All Status</option>
				<option value="achieved">Achieved</option>
				<option value="pending">Pending</option>
			</select>
		</div>
	</div>

	<!-- Main content -->
	<div class="flex-1">
		{#if isLoading}
			<div class="flex items-center justify-center min-h-screen">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else if sortedAndPaginatedGoals.length > 0}
			<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
				<table class="min-w-full table-auto">
					<thead class="bg-muted/50">
						<tr>
							<th class="px-4 py-3 text-left">
								<button onclick={() => toggleSort("opt_statement")} class="flex items-center gap-1">
									Statement
									<ArrowUpDown size={16} class={sortBy === "opt_statement" ? "text-primary" : ""} />
								</button>
							</th>
							<th class="px-4 py-3 text-left">
								<button onclick={() => toggleSort("kpi")} class="flex items-center gap-1">
									Target (KPI)
									<ArrowUpDown size={16} class={sortBy === "kpi" ? "text-primary" : ""} />
								</button>
							</th>
							<th class="px-4 py-3 text-left">Actions Taken</th>
							<th class="px-4 py-3 text-left">Status</th>
							<th class="px-4 py-3 text-center">View Statement</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each sortedAndPaginatedGoals as goal}
							<tr class="hover:bg-muted/50">
								<td class="px-4 py-3">{goal.statement}</td>
								<td class="px-4 py-3">{goal.goal}</td>
								<td class="px-4 py-3">
									{#if goal.achieved === "Achieved"}
										{goal.evaluation || "No evaluation"}
									{:else}
										<button onclick={() => openEvaluationModal(goal)} class="shrink-0 inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">Evaluate</button>
									{/if}
								</td>
								<td class="px-4 py-3">
									<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium {goal.achieved === 'Achieved' ? 'bg-green-100 text-green-800' : goal.achieved === 'Not Achieved' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
										{#if goal.isLoading}
											<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
										{:else if goal.achieved === "Achieved"}
											<CheckCircle size={14} />
											Achieved
										{:else if goal.achieved === "Not Achieved"}
											<XCircle size={14} />
											Not Achieved
										{:else}
											<XCircle size={14} />
											Pending
										{/if}
									</span>
									{#if goal.timeCompleted}
										<div class="text-xs text-muted-foreground mt-1">
											{new Date(goal.timeCompleted).toLocaleDateString()}
										</div>
									{/if}
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center justify-center">
										{#if goal.aiStatement}
											<button onclick={() => openDialog(goal.aiStatement || "")} class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-md">
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
					Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredGoals.length)} of {filteredGoals.length} results
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
				<p class="text-muted-foreground">No opportunities found.</p>
			</div>
		{/if}
	</div>

	<!-- Evaluation Modal -->
	{#if showEvaluationModal}
		<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div transition:slide={{ duration: 200 }} class="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4">
				<div class="flex items-center justify-between p-4 border-b border-border">
					<h2 class="text-lg font-semibold">Evaluate Opportunity</h2>
					<button onclick={closeEvaluationModal} class="p-1 hover:bg-muted rounded-full">
						<X size={20} />
					</button>
				</div>
				<div class="p-4">
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Statement</label>
						<p class="text-muted-foreground">{selectedGoal?.statement}</p>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Target (KPI)</label>
						<p class="text-muted-foreground">{selectedGoal?.goal}</p>
					</div>
					<div class="mb-6">
						<label class="block text-sm font-medium mb-1">Evaluation</label>
						<textarea bind:value={evaluationText} class="w-full h-32 px-3 py-2 text-sm bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Enter your evaluation..." />
					</div>
					<div class="flex justify-end gap-3">
						<button onclick={closeEvaluationModal} class="px-4 py-2 text-sm hover:bg-muted rounded-md">Cancel</button>
						<button onclick={evaluateGoal} class="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md" disabled={!evaluationText || selectedGoal?.isLoading}>
							{selectedGoal?.isLoading ? "Evaluating..." : "Submit"}
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
