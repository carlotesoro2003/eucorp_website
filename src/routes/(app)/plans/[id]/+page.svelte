<script lang="ts">
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { Search, FileDown, Pencil, Plus, ChevronLeft, ArrowUpDown, Download, Trash2, Check, Target } from "lucide-svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";
	import EditObjectiveForm from "$lib/components/strategic-objectives/EditObjectiveForm.svelte";
	import AddObjectiveForm from "$lib/components/strategic-objectives/AddObjectiveForm.svelte";
	import {Eye} from "lucide-svelte";

	/** Types definitions */
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
		hasActionPlans?: boolean;
		notApproved?: number;
	}

	interface StrategicGoal {
		id: number;
		goal_no: number;
		name: string;
		lead: string;
	}

	/** State variables */
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let sortField: keyof StrategicObjective = $state("name");
	let sortDirection: "asc" | "desc" = $state("asc");
	let goalId: number | null = $state(null);
	let goal: StrategicGoal | null = $state(null);
	let objectives: StrategicObjective[] = $state([]);
	let isLoading: boolean = $state(true);
	let editingObjective: StrategicObjective | null = $state(null);
	let showAddForm: boolean = $state(false);
	let isSaving: boolean = $state(false);
	let adminName: string | null = $state(null);
	let vicePresidentName: string | null = $state(null);
	let presidentName: string | null = $state(null);

	/** Derived values */
	const filteredObjectives = $derived(
		objectives
			.filter((objective) => {
				const searchFields = `${objective.name} ${objective.strategic_initiatives} ${objective.kpi} ${objective.persons_involved}`.toLowerCase();
				return searchFields.includes(searchQuery.toLowerCase());
			})
			.sort((a, b) => {
				const aValue = String(a[sortField]);
				const bValue = String(b[sortField]);
				return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			})
	);

	const paginatedObjectives = $derived(filteredObjectives.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const totalPages = $derived(Math.ceil(filteredObjectives.length / itemsPerPage));

	/** Sort objectives */
	const toggleSort = (field: keyof StrategicObjective) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
	};

	/** Save objective */
	const handleSave = async (data: Partial<StrategicObjective>) => {
		isSaving = true;
		try {
			if (editingObjective) {
				const { error } = await supabase.from("strategic_objectives").update(data).eq("id", editingObjective.id);

				if (error) throw error;
			} else {
				const { error } = await supabase.from("strategic_objectives").insert({ ...data, strategic_goal_id: goalId });

				if (error) throw error;
			}

			await fetchGoalDetails();
			editingObjective = null;
			showAddForm = false;
		} catch (error) {
			console.error("Error saving objective:", error);
		} finally {
			isSaving = false;
		}
	};

	/** Handle objective click */
	const handleObjectiveClick = (objectiveId: number) => {
		if (goalId !== null) {
			goto(`/plans/${goalId}/${objectiveId}`);
		}
	};

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
	const fetchGoalDetails = async () => {
		if (goalId === null) return;
		isLoading = true;

		try {
			const { data: goalData, error: goalError } = await supabase
				.from("strategic_goals")
				.select("id, name, goal_no, lead_id")
				.eq("id", goalId)
				.single();

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
				const { data: leadData, error: leadError } = await supabase
					.from("leads")
					.select("name")
					.eq("id", goalData.lead_id)
					.single();

				if (leadError) {
					console.error("Error fetching lead name:", leadError);
				} else if (leadData) {
					goal.lead = leadData.name;
				}
			}

			// Fetch objectives and include action plan status
			const { data: objectiveData, error: objectiveError } = await supabase
				.from("strategic_objectives")
				.select(`
					id,
					name,
					strategic_initiatives,
					kpi,
					persons_involved,
					target,
					eval_measures,
					action_plans (
						is_approved
					)
				`)
				.eq("strategic_goal_id", goalId);

			if (objectiveError) {
				throw new Error("Failed to fetch objectives");
			}

			objectives = (objectiveData || []).map((objective) => {
				const actionPlans = objective.action_plans || [];
				const notApproved = actionPlans.filter((plan) => plan.is_approved === false).length;
				const hasActionPlans = actionPlans.length > 0;

				return {
					...objective,
					notApproved,
					hasActionPlans,
					allApproved: hasActionPlans && notApproved === 0,
				};
			});
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
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
	// Add state for delete loading
let isDeleting = $state(false);

// Update delete handler
const handleDelete = async (objective: StrategicObjective) => {
    if (!confirm('Are you sure you want to delete this objective?')) return;
    
    isDeleting = true;
    try {
        const { error } = await supabase
            .from("strategic_objectives")
            .delete()
            .eq("id", objective.id);

        if (error) throw error;
        
        await fetchGoalDetails();
        alert('Objective deleted successfully');
    } catch (error) {
        console.error("Error deleting objective:", error);
        alert('Failed to delete objective');
    } finally {
        isDeleting = false;
    }
};
	/** Initialize data */
	onMount(() => {
		goalId = $page.params.id ? parseInt($page.params.id) : null;
		fetchGoalDetails();
		fetchAdminName();
		fetchVPAndPresidentNames();
	});
</script>

<div class="container mx-auto p-4">
	{#if isLoading}
		<div class="flex justify-center items-center min-h-[200px]">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
					<h1 class="text-2xl font-bold">Strategic Objectives for Goal {goal?.goal_no}</h1>
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
			</div>

			{#if showAddForm}
				<div class="bg-card rounded-lg p-4 border border-border">
					<AddObjectiveForm {isSaving} onSave={handleSave} onCancel={() => (showAddForm = false)} />
				</div>
			{/if}

			{#if editingObjective}
				<div class="bg-card rounded-lg p-4 border border-border">
					<EditObjectiveForm objective={editingObjective} {isSaving} onSave={handleSave} onCancel={() => (editingObjective = null)} />
				</div>
			{/if}

			<!-- Search and Actions -->
				<div class="flex flex-col md:flex-row justify-between items-center gap-4">
					<div class="relative flex-3 w-full md:max-w-[300px]">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
						<input type="text" bind:value={searchQuery} placeholder="Search objectives..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="flex gap-2">
						<button onclick={exportToPDF} class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center whitespace-nowrap">
							<Download size={20} />
							Export
						</button>
						<button onclick={() => (showAddForm = true)} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center whitespace-nowrap">
							<Plus size={20} />
							Add Objectives
						</button>
						
					</div>
				</div>

			{#if objectives.length > 0}

				<!-- Table -->
				<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
					<table class="min-w-full table-auto">
						<thead class="bg-muted/50">
							<tr>
								<th class="px-4 py-3 text-left">
									<button onclick={() => toggleSort("name")} class="flex items-center gap-1 hover:text-primary">
										Strategic Objectives
										<ArrowUpDown size={16} class={sortField === "name" ? "text-primary" : ""} />
									</button>
								</th>
								<th class="px-4 py-3 text-left">Strategic Initiatives</th>
								<th class="px-4 py-3 text-left">KPI</th>
								<th class="px-4 py-3 text-left">Persons Involved</th>
								<th class="px-4 py-3 text-left">Target</th>
								<th class="px-4 py-3 text-left">Evaluation Measures</th>
								<th class="px-4 py-3 text-left">Action Plans</th>
								<th class="px-4 py-3 text-center w-[200px]">Plan Status</th>
								<th class="px-4 py-3 text-center w-[200px]">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each paginatedObjectives as objective}
								<tr class="hover:bg-muted/50">
									<td class="px-4 py-3">{objective.name}</td>
									<td class="px-4 py-3">{objective.strategic_initiatives}</td>
									<td class="px-4 py-3">{objective.kpi}</td>
									<td class="px-4 py-3">{objective.persons_involved}</td>
									<td class="px-4 py-3">{objective.target}</td>
									<td class="px-4 py-3">{objective.eval_measures}</td>
									<td class="px-4 py-3">
										<button onclick={() => handleObjectiveClick(objective.id)} class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-md" title="View plans">
											<Eye size={18} /> View
										</button>
									</td>
										<td class="px-4 py-3 text-center">
										{#if !objective.hasActionPlans}
											<span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg" title="No plans added">
												N/A
											</span>
										{:else if (objective.notApproved > 0)}
											<span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-lg" title="{objective.notApproved} plans not approved">
												<Target size={16} />
												{objective.notApproved} 
											</span>
										{:else}
											<span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-lg" title="All plans approved">
												<Check size={16} />
											</span>
										{/if}
									</td>
									<td class="px-4 py-3">
										<div class="flex justify-center gap-2">
											<button onclick={() => (editingObjective = objective)} class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
												<Pencil size={18} />
											</button>
											<button
												onclick={() => handleDelete(objective)}
												class="p-1.5 hover:bg-muted rounded-lg text-red-400 hover:text-red-500 disabled:opacity-50"
												disabled={isDeleting}
											>
												<Trash2 size={18} />
											</button>
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
						Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredObjectives.length)} of {filteredObjectives.length} results
					</div>
					<div class="flex gap-2 items-center">
						<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
							<option value={5}>5 per page</option>
							<option value={10}>10 per page</option>
							<option value={25}>25 per page</option>
							<option value={50}>50 per page</option>
						</select>
						<button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button>
						
						<button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
					</div>
				</div>
			{:else}
				<div class="text-center py-12 bg-card rounded-lg border border-border">
					<p class="text-muted-foreground mb-4">No objectives found for this goal.</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
