	
<script lang="ts">
	import { onMount } from "svelte";
	import "tailwindcss/tailwind.css";
	import { supabase } from "$lib/supabaseClient";
	import { CheckCircle, XCircle, Loader2, Eye, ArrowUpDown } from "lucide-svelte";
	import Filters from "./PlanComponent/Filters.svelte";

	interface ActionPlan {
		id: number;
		actions_taken: string;
		kpi: string;
		objective_id: number;
		strategic_goal_name: string;
		objective_name: string;
		is_accomplished: boolean;
		evaluation: string | null;
		statement: string | null;
		time_completed: string | null;
		isLoading: boolean;
	}

	// State variables
	let actionPlans: ActionPlan[] = [];
	let profileId: string | null = null;
	let showDialog = false;
	let dialogStatement = "";
	let isLoadingPage = true;
	let searchTerm = "";
	let sortBy = "strategic_goal_name";
	let sortAsc = true;
	let showFilters = false;
	let selectedStatus = "all";
	let selectedGoal = "all";

	// Get unique strategic goals for filter
	$: uniqueGoals = ["all", ...new Set(actionPlans.map((plan) => plan.strategic_goal_name))];

	// Computed properties with filters
	$: filteredAndSortedPlans = actionPlans
		.filter((plan) => {
			const matchesSearch =
				plan.strategic_goal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				plan.objective_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				plan.actions_taken.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus =
				selectedStatus === "all"
					? true
					: selectedStatus === "achieved"
					? plan.is_accomplished
					: !plan.is_accomplished;

			const matchesGoal = selectedGoal === "all" || plan.strategic_goal_name === selectedGoal;

			return matchesSearch && matchesStatus && matchesGoal;
		})
		.sort((a, b) => {
			const compareValue = sortAsc ? 1 : -1;
			return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
		});

	/** Sort table data */
	function toggleSort(column: string) {
		if (sortBy === column) {
			sortAsc = !sortAsc;
		} else {
			sortBy = column;
			sortAsc = true;
		}
	}

	/** Open dialog with statement */
	function openDialog(statement: string) {
		dialogStatement = statement;
		showDialog = true;
	}

	/** Auto resize textarea */
	const autoResize = (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	/** Fetch user profile */
	const fetchUserProfile = async () => {
		try {
			const { data: { session }, error } = await supabase.auth.getSession();
			if (error || !session) throw error;
			profileId = session.user.id;
		} catch (error) {
			console.error("Error fetching session:", error);
		}
	};

	/** Fetch plan monitoring data */
	const fetchPlanMonitoringData = async (planIds: number[]) => {
		try {
			const { data, error } = await supabase
				.from("plan_monitoring")
				.select("action_plan_id, is_accomplished, evaluation, statement, time_completed")
				.in("action_plan_id", planIds);

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
				.select(
					`
					id,
					actions_taken,
					kpi,
					objective_id,
					strategic_objectives (
						name,
						strategic_goals (name)
					),
					is_approved
				`
				)
				.in("profile_id", profileIdList)
				.eq("is_approved", true);

			if (error) throw error;

			const plans = data.map((plan: any) => ({
				id: plan.id,
				actions_taken: plan.actions_taken,
				kpi: plan.kpi,
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
	const evaluateActionPlan = async (id: number, kpi: string, evaluation: string) => {
		actionPlans = actionPlans.map((plan) => (plan.id === id ? { ...plan, isLoading: true } : plan));

		try {
			const response = await fetch("/api/evaluate-goal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ target: kpi, evaluation }),
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
					evaluation,
					statement: aiEvaluation,
					is_accomplished: isAccomplished,
					time_completed: timeCompleted,
				})
				.eq("action_plan_id", id);

			if (error) throw error;

			actionPlans = actionPlans.map((plan) =>
				plan.id === id
					? {
							...plan,
							is_accomplished: isAccomplished,
							evaluation,
							statement: aiEvaluation,
							time_completed: timeCompleted,
							isLoading: false,
						}
					: plan
			);
		} catch (error) {
			console.error("Error evaluating action plan:", error);
			actionPlans = actionPlans.map((plan) => (plan.id === id ? { ...plan, isLoading: false } : plan));
		}
	};

	onMount(async () => {
		await fetchUserProfile();
		await fetchActionPlans();
	});
</script>

<div class="min-h-screen flex flex-col bg-gray-100">
	<!-- Fixed Header with responsive design -->
	<header class="sticky top-0 z-40 bg-white border-b shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<h1 class="text-2xl font-medium text-gray-800">Plans Monitoring</h1>
				<div class="flex items-center gap-2">
					<div class="relative flex-1 sm:flex-none">
						<input type="search" bind:value={searchTerm} placeholder="Search plans..." class="w-full sm:w-64 pl-3 pr-8 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
						<span class="absolute right-2 top-2.5 text-gray-400">🔍</span>
					</div>
				</div>
			</div>
			<div class="mt-4">
				<Filters {uniqueGoals} bind:selectedStatus bind:selectedGoal />
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			{#if isLoadingPage}
				<div class="flex justify-center items-center h-64">
					<Loader2 class="animate-spin h-10 w-10 text-indigo-500" />
				</div>
			{:else if filteredAndSortedPlans.length > 0}
				<div class="bg-white rounded-lg shadow">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onclick={() => toggleSort("strategic_goal_name")}>
									<div class="flex items-center gap-2">
										Strategic Goal
										<ArrowUpDown class="h-4 w-4" />
									</div>
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Objective</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action Plans</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">KPI</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions Taken</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
								<th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each filteredAndSortedPlans as plan}
								<tr class="hover:bg-gray-50">
									<td class="px-4 py-4 text-sm text-gray-800 break-words">{plan.strategic_goal_name}</td>
									<td class="px-4 py-4 text-sm text-gray-800 break-words">{plan.objective_name}</td>
									<td class="px-4 py-4 text-sm text-gray-600 break-words">{plan.actions_taken}</td>
									<td class="px-4 py-4 text-sm text-gray-600 break-words">{plan.kpi}</td>
									<td class="px-4 py-4">
										<textarea
											class="w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
											placeholder="Enter evaluation..."
											value={plan.evaluation}
											oninput={(e) => {
												actionPlans = actionPlans.map((p) => (p.id === plan.id ? { ...p, evaluation: (e.target as HTMLTextAreaElement).value } : p));
												autoResize(e);
											}}
											style="resize: vertical; min-height: 60px;"
											rows="2"
											disabled={plan.is_accomplished}
										/>
									</td>
									<td class="px-4 py-4">
										<span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${plan.is_accomplished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
											{#if plan.is_accomplished}
												<CheckCircle class="w-4 h-4 mr-1" />
												Achieved
											{:else}
												<XCircle class="w-4 h-4 mr-1" />
												Pending
											{/if}
										</span>
									</td>
									<td class="px-4 py-4 text-center">
										<div class="flex items-center justify-center gap-2">
											{#if plan.statement}
												<button onclick={() => openDialog(plan.statement || "")} class="inline-flex items-center px-3 py-1 text-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md">
													<Eye class="w-4 h-4 mr-1" />
													View
												</button>
											{/if}
											{#if plan.isLoading}
												<Loader2 class="animate-spin h-5 w-5 text-indigo-500" />
											{:else if !plan.is_accomplished}
												<button onclick={() => evaluateActionPlan(plan.id, plan.kpi, plan.evaluation || "")} class="inline-flex items-center px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50" disabled={!plan.evaluation || plan.isLoading}>Evaluate</button>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="text-center py-12 bg-white rounded-lg shadow">
					<p class="text-gray-500">No action plans found.</p>
				</div>
			{/if}
		</div>
	</main>

	<!-- Dialog -->
	{#if showDialog}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Evaluation Statement</h2>
				<div class="bg-gray-50 rounded-lg p-4 text-gray-700 mb-6 max-h-[60vh] overflow-y-auto break-words">
					{dialogStatement}
				</div>
				<button onclick={() => (showDialog = false)} class="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Close</button>
			</div>
		</div>
	{/if}
</div>