<script lang="ts">
	import { Search, ArrowUpDown, Plus, Edit, Trash2, Eye } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import StrategicGoalForm from "$lib/components/StrategicGoal/StrategicGoalForm.svelte";

	/** Types */
	type StrategicGoal = {
		id: number;
		goal_no: number;
		name: string;
		description: string;
		kpi: string;
		lead_id: number | null;
	};

	type Lead = {
		id: number;
		name: string;
	};

	type SortField = "goal_no" | "name" | "description" | "kpi";
	type SortDirection = "asc" | "desc";

	/** State */
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let showForm: boolean = $state(false);
	let sortField: SortField = $state("goal_no");
	let sortDirection: SortDirection = $state("asc");
	let leadFilter: number | "all" = $state("all");
	let loading: boolean = $state(true);
	let editingGoal: StrategicGoal | null = $state(null);
	let showAlert: boolean = $state(false);
	let alertMessage: string = $state("");
	let alertType: "success" | "error" = $state("success");

	/** Data state */
	let strategicGoals: StrategicGoal[] = $state([]);
	let leads: Lead[] = $state([]);

	/** Initialize data on component mount */
	onMount(() => {
		init();
	});

	const init = async () => {
		await fetchLeads();
		await fetchStrategicGoals();
		loading = false;
	};

	/** Fetch leads from database */
	const fetchLeads = async () => {
		const { data, error } = await supabase.from("leads").select("id, name");
		if (error) {
			displayAlert("Error fetching leads", "error");
		} else {
			leads = data as Lead[];
		}
	};

	/** Fetch strategic goals from database */
	const fetchStrategicGoals = async () => {
		const { data, error } = await supabase.from("strategic_goals").select("*").order("goal_no", { ascending: true });
		if (error) {
			displayAlert("Error fetching strategic goals", "error");
		} else {
			strategicGoals = data as StrategicGoal[];
		}
	};

	/** Calculate next goal number */
	const getNextGoalNumber = (): number => {
		return strategicGoals.length > 0 ? Math.max(...strategicGoals.map((goal) => goal.goal_no)) + 1 : 1;
	};

	/** Display alert message */
	const displayAlert = (message: string, type: "success" | "error") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	/** Get lead name by ID */
	const getLeadNameById = (leadId: number | null): string => {
		const lead = leads.find((l) => l.id === leadId);
		return lead ? lead.name : "No Lead Assigned";
	};

	/** Handle saving goal */
	const handleSave = async (formData: Partial<StrategicGoal>) => {
		if (editingGoal) {
			const { error } = await supabase.from("strategic_goals").update(formData).match({ id: editingGoal.id });

			if (error) {
				displayAlert("Error updating goal", "error");
			} else {
				displayAlert("Goal updated successfully", "success");
				await fetchStrategicGoals();
				closeForm();
			}
		} else {
			const newGoal = {
				...formData,
				goal_no: getNextGoalNumber(),
			};
			const { error } = await supabase.from("strategic_goals").insert([newGoal]);
			if (error) {
				displayAlert("Error creating goal", "error");
			} else {
				displayAlert("Goal created successfully", "success");
				await fetchStrategicGoals();
				closeForm();
			}
		}
	};

	/** Delete goal and reorder remaining goals */
	const deleteGoal = async (id: number) => {
		if (confirm("Are you sure you want to delete this goal?")) {
			loading = true;
			const { error } = await supabase.from("strategic_goals").delete().match({ id });

			if (error) {
				displayAlert("Error deleting goal", "error");
				loading = false;
				return;
			}

			// Fetch remaining goals for reordering
			const { data: remainingGoals, error: fetchError } = await supabase.from("strategic_goals").select("*").order("goal_no", { ascending: true });

			if (fetchError) {
				displayAlert("Error reordering goals", "error");
				loading = false;
				return;
			}

			// Reorder remaining goals
			for (let i = 0; i < remainingGoals.length; i++) {
				await supabase
					.from("strategic_goals")
					.update({ goal_no: i + 1 })
					.match({ id: remainingGoals[i].id });
			}

			displayAlert("Goal deleted and reordered successfully", "success");
			await fetchStrategicGoals();
			loading = false;
		}
	};

	/** Close form */
	const closeForm = () => {
		showForm = false;
		editingGoal = null;
	};

	/** Toggle sort */
	const toggleSort = (field: SortField) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
	};

	/** Derived values */
	const filteredItems = $derived(
		strategicGoals
			.filter((goal) => {
				const searchFields = `${goal.name} ${goal.description} ${goal.kpi}`.toLowerCase();
				const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
				const matchesLead = leadFilter === "all" || goal.lead_id === leadFilter;
				return matchesSearch && matchesLead;
			})
			.sort((a, b) => {
				const aValue = String(a[sortField]);
				const bValue = String(b[sortField]);
				return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			})
	);

	const paginatedItems = $derived(filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
	const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div class="alert alert-{alertType} shadow-lg mb-4">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<div class="mb-6">
		<h1 class="text-3xl font-bold">Strategic Goals</h1>
	</div>

	<div class="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
		<div class="flex flex-col md:flex-row gap-4 flex-1">
			<div class="relative flex-1 w-full md:max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search goals..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<select bind:value={leadFilter} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
				<option value="all">All Leads</option>
				{#each leads as lead}
					<option value={lead.id}>{lead.name}</option>
				{/each}
			</select>
		</div>
		<button onclick={() => (showForm = true)} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center whitespace-nowrap w-full md:w-auto">
			<Plus size={20} />
			Add Goal
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
		</div>
	{:else}
		<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("goal_no")} class="flex items-center gap-1">
								Goal No
								<ArrowUpDown size={16} class={sortField === "goal_no" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("name")} class="flex items-center gap-1">
								Name
								<ArrowUpDown size={16} class={sortField === "name" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden md:table-cell">Description</th>
						<th class="px-4 py-3 text-left hidden lg:table-cell">KPI</th>
						<th class="px-4 py-3 text-left">Lead</th>
						<th class="px-4 py-3 text-center">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedItems as goal (goal.id)}
						<tr>
							<td class="px-4 py-3">{goal.goal_no}</td>
							<td class="px-4 py-3">{goal.name}</td>
							<td class="px-4 py-3 hidden md:table-cell">{goal.description}</td>
							<td class="px-4 py-3 hidden lg:table-cell">{goal.kpi}</td>
							<td class="px-4 py-3">{getLeadNameById(goal.lead_id)}</td>
							<td class="px-4 py-3">
								<div class="flex justify-center gap-2">
									<button onclick={() => goto(`/plans/${goal.id}`)} class="btn btn-ghost btn-sm" title="View objectives">
										<Eye size={18} />
									</button>
									<button
										onclick={() => {
											editingGoal = goal;
											showForm = true;
										}}
										class="btn btn-ghost btn-sm"
										title="Edit goal"
									>
										<Edit size={18} />
									</button>
									<button onclick={() => deleteGoal(goal.id)} class="btn btn-ghost btn-sm text-error" title="Delete goal">
										<Trash2 size={18} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
			<div class="text-sm text-muted-foreground">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
			</div>
			<div class="flex flex-col sm:flex-row items-center gap-4">
				<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring">
					<option value={5}>5 per page</option>
					<option value={10}>10 per page</option>
					<option value={25}>25 per page</option>
				</select>
				<div class="flex gap-2">
					<button disabled={currentPage === 1} onclick={() => currentPage--} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button>
					<button disabled={currentPage === totalPages} onclick={() => currentPage++} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showForm}
		<StrategicGoalForm goal={editingGoal} {leads} onSave={handleSave} onClose={closeForm} />
	{/if}
</div>
