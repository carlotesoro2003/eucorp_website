<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { X, AlertCircle, CheckCircle2, Clock, Eye, RefreshCw } from "lucide-svelte";

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
	let isLoading: boolean = $state(false);
	let showDialog: boolean = $state(false);
	let dialogStatement: string = $state("");
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

	/** Open dialog with statement */
	function openDialog(statement: string) {
		dialogStatement = statement;
		showDialog = true;
	}

	/** Fetch user profile */
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
		isLoading = true;
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
	async function evaluateGoal(id: number, goal: string, evaluation: string) {
		goals = goals.map((g) => (g.id === id ? { ...g, isLoading: true } : g));

		try {
			const response = await fetch("/api/evaluate-goal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ target: goal, evaluation }),
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
					evaluation,
					statement: aiEvaluation,
					is_accomplished: isAchieved,
				})
				.eq("opt_id", id);

			if (error) {
				console.error("[ERROR] Error updating opt_monitoring:", error);
			} else {
				goals = goals.map((g) =>
					g.id === id
						? {
								...g,
								achieved: isAchieved ? "Achieved" : "Not Achieved",
								isLoading: false,
								timeCompleted,
								aiStatement: aiEvaluation,
							}
						: g
				);
			}
		} catch (error) {
			console.error("[ERROR] Error evaluating goal:", error);
			goals = goals.map((g) => (g.id === id ? { ...g, isLoading: false } : g));
		}
	}

	/** Evaluate all goals */
	async function evaluateAllGoals() {
		const monitoringData = goals.map((goal) => ({
			opt_statement: goal.statement,
			kpi: goal.goal,
			achieved: goal.achieved === "Achieved",
			evaluation: goal.evaluation,
		}));

		try {
			const response = await fetch("/api/generate-summary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ monitoringData }),
			});

			const data = await response.json();

			if (!response.ok || data.error) {
				throw new Error(data.error || "Failed to generate summary.");
			}
		} catch (error) {
			console.error("Error generating summary:", error);
		}
	}

	/** Handle input change */
	function handleInput(id: number, field: "evaluation", value: string) {
		goals = goals.map((g) => (g.id === id ? { ...g, [field]: value } : g));
	}

	/** Auto resize textarea */
	function autoResize(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = "auto";
		textarea.style.width = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
		textarea.style.width = `${textarea.scrollWidth + 20}px`;
	}

	onMount(async () => {
		await fetchUserProfile();
		await fetchOpportunities();
	});
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex justify-between items-center">
				<h1 class="text-2xl font-semibold text-gray-900">Mid-Year Opportunity Monitoring</h1>
				<button onclick={evaluateAllGoals} class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
					<RefreshCw class="w-4 h-4 mr-2" />
					Evaluate All
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if isLoading}
			<div class="flex items-center justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
				<span class="ml-3 text-gray-600">Loading opportunities...</span>
			</div>
		{:else if goals.length === 0}
			<div class="text-center py-12 bg-white rounded-lg shadow">
				<AlertCircle class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-lg font-medium text-gray-900">No opportunities found</h3>
				<p class="mt-1 text-sm text-gray-500">No opportunities have been added to your monitoring list yet.</p>
			</div>
		{:else}
			<div class="bg-white shadow-lg rounded-lg overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statement</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target (KPI)</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions Taken</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each goals as { id, statement, goal, evaluation, achieved, isLoading: goalLoading, timeCompleted, aiStatement }}
								<tr>
									<td class="px-6 py-4 whitespace-normal text-sm text-gray-900">{statement}</td>
									<td class="px-6 py-4 whitespace-normal text-sm text-gray-500">{goal}</td>
									<td class="px-6 py-4">
										<textarea class="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" placeholder="Enter your evaluation..." value={evaluation} onchange={(e) => handleInput(id, "evaluation", (e.target as HTMLTextAreaElement).value)} oninput={autoResize} disabled={achieved === "Achieved"}></textarea>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${achieved === "Achieved" ? "bg-green-100 text-green-800" : achieved === "Not Achieved" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
										>
											{#if goalLoading}
												<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
											{:else if achieved === "Achieved"}
												<CheckCircle2 class="w-4 h-4 mr-1" />
												Achieved
											{:else if achieved === "Not Achieved"}
												<X class="w-4 h-4 mr-1" />
												Not Achieved
											{:else}
												<Clock class="w-4 h-4 mr-1" />
												Pending
											{/if}
										</span>
										{#if timeCompleted}
											<div class="text-xs text-gray-500 mt-1">
												{new Date(timeCompleted).toLocaleDateString()}
											</div>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm">
										{#if aiStatement}
											<button onclick={() => openDialog(aiStatement)} class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
												<Eye class="w-4 h-4 mr-1" />
												View
											</button>
										{:else}
											<span class="text-gray-500">-</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm">
										<div class="flex space-x-2">
											{#if achieved !== "Achieved"}
												<button onclick={() => evaluateGoal(id, goal, evaluation)} class="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={!evaluation || goalLoading}>Evaluate</button>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</main>

	<!-- Dialog -->
	{#if showDialog}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-medium text-gray-900">AI Evaluation Statement</h3>
					<button onclick={() => (showDialog = false)} class="text-gray-400 hover:text-gray-500 focus:outline-none">
						<X class="w-5 h-5" />
					</button>
				</div>
				<div class="mt-2">
					<p class="text-sm text-gray-500 whitespace-pre-wrap">{dialogStatement}</p>
				</div>
				<div class="mt-6">
					<button onclick={() => (showDialog = false)} class="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
				</div>
			</div>
		</div>
	{/if}
</div>
