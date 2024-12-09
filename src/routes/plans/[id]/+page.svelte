<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { Search, FileDown, Edit2, Plus, ChevronLeft } from "lucide-svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";

	/** Types */
	interface StrategicObjective {
		id: number;
		name: string;
		strategic_initiatives: string;
		kpi: string;
		persons_involved: string;
		target: string;
		eval_measures: string;
		strategic_goal_id: number;
		profile_id: string;
	}

	interface StrategicGoal {
		id: number;
		goal_no: number;
		name: string;
		lead: string;
	}

	/** State */
	let searchQuery: string = $state("");
	let goal: StrategicGoal | null = $state(null);
	let objectives: StrategicObjective[] = $state([]);
	let isLoading: boolean = $state(false);
	let goalId: number | null = $state(null);
	let adminName: string | null = $state(null);
	let vicePresidentName: string | null = $state(null);
	let presidentName: string | null = $state(null);
	let editingObjective: StrategicObjective | null = $state(null);
	let updatedObjective: StrategicObjective = $state({} as StrategicObjective);

	/** Fetch admin name */
	const fetchAdminName = async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session || !session.user) return;

			const { data: profileData, error } = await supabase.from("profiles").select("first_name, last_name").eq("id", session.user.id).single();

			if (error) {
				console.error("Error fetching admin name:", error);
			} else if (profileData) {
				adminName = `${profileData.first_name} ${profileData.last_name}`;
			}
		} catch (error) {
			console.error("Error fetching admin details:", error);
		}
	};

	/** Fetch VP and President names */
	const fetchVPAndPresidentNames = async () => {
		try {
			const { data, error } = await supabase.from("profiles").select("first_name, last_name, role").in("role", ["vice_president", "president"]);

			if (error) {
				console.error("Error fetching VP and President names:", error);
				return;
			}

			const vp = data?.find((user) => user.role === "vice_president");
			const president = data?.find((user) => user.role === "president");

			vicePresidentName = vp ? `${vp.first_name} ${vp.last_name}` : "N/A";
			presidentName = president ? `${president.first_name} ${president.last_name}` : "N/A";
		} catch (error) {
			console.error("Error fetching VP and President details:", error);
		}
	};

	/** Fetch goal details */
	const fetchGoalDetails = async (): Promise<void> => {
		if (goalId === null) return;
		isLoading = true;

		try {
			const { data: goalData, error: goalError } = await supabase.from("strategic_goals").select("id, name, goal_no, lead_id").eq("id", goalId).single();

			if (goalError || !goalData) {
				throw new Error("Failed to fetch goal details");
			}

			goal = {
				id: goalData.id,
				name: goalData.name,
				goal_no: goalData.goal_no,
				lead: "",
			};

			if (goalData.lead_id) {
				const { data: leadData, error: leadError } = await supabase.from("leads").select("name").eq("id", goalData.lead_id).single();

				if (leadError) {
					console.error("Error fetching lead name:", leadError);
				} else if (leadData) {
					goal.lead = leadData.name;
				}
			}

			const { data: objectiveData, error: objectiveError } = await supabase.from("strategic_objectives").select("*").eq("strategic_goal_id", goalId);

			if (objectiveError) {
				throw new Error("Failed to fetch objectives");
			}

			objectives = objectiveData || [];
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	};

	/** Update objective */
	const updateObjective = async () => {
		if (editingObjective) {
			const { error } = await supabase.from("strategic_objectives").update(updatedObjective).eq("id", editingObjective.id);

			if (error) {
				console.error("Error updating objective:", error);
			} else {
				fetchGoalDetails();
				editingObjective = null;
			}
		}
	};

	/** Handle objective click */
	const handleObjectiveClick = (objectiveId: number) => {
		if (goalId !== null) {
			goto(`/plans/${goalId}/${objectiveId}`);
		}
	};

	/** Export to PDF */
	const exportToPDF = () => {
		const doc = new jsPDF("landscape", "mm", "a4");
		doc.setFontSize(18);
		doc.text("Strategic Objectives", 14, 20);

		if (goal) {
			doc.setFontSize(12);
			doc.text(`Goal Name: ${goal.name}`, 14, 30);
			doc.text(`Lead: ${goal.lead}`, 14, 37);
		}

		const rows = objectives.map((obj) => [obj.name, obj.strategic_initiatives, obj.kpi, obj.persons_involved, obj.target, obj.eval_measures]);

		const headers = ["Strategic Objectives", "Strategic Initiatives", "KPI", "Persons Involved", "Target", "Evaluation Measures"];

		autoTable(doc, {
			head: [headers],
			body: rows,
			startY: 58,
			theme: "grid",
			styles: { fontSize: 10 },
		});

		const pageHeight = doc.internal.pageSize.height;
		const signatureStartY = pageHeight - 30;

		doc.setFontSize(12);
		const nameToDisplay = adminName || "Admin Name";
		const vcToDisplay = vicePresidentName || "Vice President Name";
		const presidentToDisplay = presidentName || "President Name";

		doc.text(`${nameToDisplay}(sgnd)`, 14, signatureStartY - 5);
		doc.text("_________________________", 14, signatureStartY);
		doc.text("Corporate Planning Officer", 14, signatureStartY + 5);

		doc.text(`${vcToDisplay}`, 100, signatureStartY - 5);
		doc.text("_________________________", 100, signatureStartY);
		doc.text("Vice President", 100, signatureStartY + 5);

		doc.text(`${presidentToDisplay}`, 180, signatureStartY - 5);
		doc.text("_________________________", 180, signatureStartY);
		doc.text("President", 180, signatureStartY + 5);

		doc.save("StrategicObjectives.pdf");
	};

	/** Initialize data */
	onMount(() => {
		$: goalId = $page.params.id ? parseInt($page.params.id) : null;
		fetchGoalDetails();
		fetchAdminName();
		fetchVPAndPresidentNames();
	});

	/** Filtered objectives */
	const filteredObjectives = $derived(
		objectives.filter((objective) => {
			const searchFields = `${objective.name} ${objective.strategic_initiatives} ${objective.kpi} ${objective.persons_involved}`.toLowerCase();
			return searchFields.includes(searchQuery.toLowerCase());
		})
	);
</script>

<div class="container mx-auto p-4">
	{#if isLoading}
		<div class="flex justify-center items-center min-h-[200px]">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else}
		<div class="flex flex-col gap-6">
			<!-- Header -->
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<a href="/plans" class="flex items-center gap-2 text-muted-foreground mb-2 hover:text-foreground">
						<ChevronLeft size={20} />
						Back to Goals
					</a>
					<h1 class="text-3xl font-bold">Strategic Objectives for Goal {goal?.goal_no}</h1>
					{#if goal}
						<div class="mt-2 text-muted-foreground">
							<p>
								<span class="font-medium text-foreground">Goal Name:</span>
								{goal.name}
							</p>
							<p>
								<span class="font-medium text-foreground">Lead:</span>
								{goal.lead}
							</p>
						</div>
					{/if}
				</div>
				<div class="flex flex-col sm:flex-row gap-2">
					<a href="/plans/strategicPlans" class="btn btn-primary flex items-center gap-2">
						<Plus size={20} />
						Add Objectives
					</a>
					<button onclick={exportToPDF} class="btn btn-secondary flex items-center gap-2">
						<FileDown size={20} />
						Export PDF
					</button>
				</div>
			</div>

			{#if objectives.length > 0}
				<!-- Search -->
				<div class="relative">
					<Search
						class="absolute left

-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
						size={20}
					/>
					<input type="text" bind:value={searchQuery} placeholder="Search objectives..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>

				<!-- Table -->
				<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
					<table class="min-w-full table-auto">
						<thead class="bg-muted/50">
							<tr>
								<th class="px-4 py-3 text-left">Strategic Objectives</th>
								<th class="px-4 py-3 text-left">Strategic Initiatives</th>
								<th class="px-4 py-3 text-left">KPI</th>
								<th class="px-4 py-3 text-left">Persons Involved</th>
								<th class="px-4 py-3 text-left">Target</th>
								<th class="px-4 py-3 text-left">Evaluation Measures</th>
								<th class="px-4 py-3 text-center">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each filteredObjectives as objective}
								<tr>
									{#if editingObjective?.id === objective.id}
										<td class="px-4 py-3">
											<textarea bind:value={updatedObjective.name} class="textarea textarea-bordered w-full" rows="3"></textarea>
										</td>
										<td class="px-4 py-3">
											<textarea bind:value={updatedObjective.strategic_initiatives} class="textarea textarea-bordered w-full" rows="3"></textarea>
										</td>
										<td class="px-4 py-3">
											<textarea bind:value={updatedObjective.kpi} class="textarea textarea-bordered w-full" rows="3"></textarea>
										</td>
										<td class="px-4 py-3">
											<textarea bind:value={updatedObjective.persons_involved} class="textarea textarea-bordered w-full" rows="3"></textarea>
										</td>
										<td class="px-4 py-3">
											<textarea bind:value={updatedObjective.target} class="textarea textarea-bordered w-full" rows="3"></textarea>
										</td>
										<td class="px-4 py-3">
											<textarea bind:value={updatedObjective.eval_measures} class="textarea textarea-bordered w-full" rows="3"></textarea>
										</td>
										<td class="px-4 py-3">
											<div class="flex flex-col gap-2">
												<button onclick={updateObjective} class="btn btn-primary btn-sm">Save</button>
												<button onclick={() => (editingObjective = null)} class="btn btn-ghost btn-sm">Cancel</button>
											</div>
										</td>
									{:else}
										<td class="px-4 py-3">{objective.name}</td>
										<td class="px-4 py-3">{objective.strategic_initiatives}</td>
										<td class="px-4 py-3">{objective.kpi}</td>
										<td class="px-4 py-3">{objective.persons_involved}</td>
										<td class="px-4 py-3">{objective.target}</td>
										<td class="px-4 py-3">{objective.eval_measures}</td>
										<td class="px-4 py-3">
											<div class="flex justify-center gap-2">
												<button onclick={() => handleObjectiveClick(objective.id)} class="btn btn-primary btn-sm">View Plans</button>
												<button
													onclick={() => {
														editingObjective = objective;
														updatedObjective = { ...objective };
													}}
													class="btn btn-ghost btn-sm"
												>
													<Edit2 size={18} />
												</button>
											</div>
										</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="text-center py-12 bg-card rounded-lg border border-border">
					<p class="text-muted-foreground mb-4">No objectives found for this goal.</p>
					<a href="/plans/strategicPlans" class="btn btn-primary">Add Strategic Objectives</a>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.textarea {
		resize: none;
		overflow: hidden;
	}
</style>
