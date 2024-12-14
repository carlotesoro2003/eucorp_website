<script lang="ts">
	import { Pencil, Search, Trash2, Plus, X, ArrowUpDown, Group, UsersRound } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import LeadForm from "$lib/components/leads-table/LeadForm.svelte";
	import LeadCard from "$lib/components/leads-table/LeadCard.svelte";

	// Types
	interface Lead {
		id: number;
		name: string;
	}

	type SortDirection = "asc" | "desc";

	// State variables
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(6);
	let leads: Lead[] = $state([]);
	let showForm: boolean = $state(false);
	let editingLead: Lead | null = $state(null);
	let sortDirection: SortDirection = $state("asc");
	let isLoading: boolean = $state(false);
	let errorMessage: string | null = $state(null);
	let successMessage: string | null = $state(null);
	let isSaving: boolean = $state(false);

	// Derived values with sorting and filtering
	const filteredLeads = $derived(
		leads
			.filter((lead) => lead.name.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort((a, b) => {
				if (sortDirection === "asc") {
					return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
				} else {
					return b.name < a.name ? -1 : b.name > a.name ? 1 : 0;
				}
			})
	);

	const paginatedLeads = $derived(filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const totalPages = $derived(Math.ceil(filteredLeads.length / itemsPerPage));

	// Toggle sort direction
	const toggleSort = () => {
		sortDirection = sortDirection === "asc" ? "desc" : "asc";
	};

	// Fetch all leads
	const fetchLeads = async () => {
		isLoading = true;
		const { data, error } = await supabase.from("leads").select("*");

		if (error) {
			console.error("Error fetching leads:", error);
			errorMessage = "Failed to fetch leads.";
		} else {
			leads = data;
			errorMessage = null;
		}

		isLoading = false;
	};

	// Delete lead
	const deleteLead = async (id: number) => {
		const { error } = await supabase.from("leads").delete().eq("id", id);

		if (error) {
			console.error("Error deleting lead:", error);
			errorMessage = "Failed to delete lead.";
		} else {
			successMessage = "Lead deleted successfully!";
			errorMessage = null;
			await fetchLeads();
		}
	};

	// Edit lead
	const editLead = (lead: Lead) => {
		editingLead = lead;
		showForm = true;
	};

	// Close form
	const closeForm = () => {
		showForm = false;
		editingLead = null;
	};

	// Handle save
	const handleSave = async (lead: { name: string }) => {
		isSaving = true;
		const { error } = editingLead ? await supabase.from("leads").update({ name: lead.name }).eq("id", editingLead.id) : await supabase.from("leads").insert([{ name: lead.name }]);

		if (error) {
			console.error("Error saving lead:", error);
			errorMessage = "Failed to save lead.";
		} else {
			successMessage = editingLead ? "Lead updated successfully!" : "Lead added successfully!";
			errorMessage = null;
			await fetchLeads();
			closeForm();
		}
		isSaving = false;
	};

	// Initialize leads on mount
	$effect(() => {
		fetchLeads();
	});
</script>

<div class="flex flex-col gap-4 container mx-auto ">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<UsersRound class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Leads</h1>
		</div>
	</div>
	<!-- Success and Error Alerts -->
	{#if successMessage}
		<div class="bg-green-500/20 text-green-400 p-4 rounded-lg">{successMessage}</div>
	{/if}
	{#if errorMessage}
		<div class="bg-red-500/20 text-red-400 p-4 rounded-lg">{errorMessage}</div>
	{/if}

	<!-- Filters section -->
	<div class="flex flex-col md:flex-row items-center justify-between gap-4">
		<div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
			<div class="relative flex-1 md:w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search leads..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<button onclick={toggleSort} class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted whitespace-nowrap">
				Sort by Name
				<ArrowUpDown size={16} class={sortDirection === "asc" ? "" : "rotate-180"} />
			</button>
		</div>
		<button
			onclick={() => {
				editingLead = null;
				showForm = true;
			}}
			class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial whitespace-nowrap"
		>
			<Plus size={20} />
			Add Lead
		</button>
	</div>

	{#if isLoading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else if leads.length === 0}
		<div class="text-center p-8 bg-card rounded-lg border border-border">No leads found.</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each paginatedLeads as lead (lead.id)}
				<LeadCard {lead} onEdit={editLead} onDelete={deleteLead} />
			{/each}
		</div>

		<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
			<div class="text-sm text-muted-foreground text-center sm:text-left">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} results
			</div>
			<div class="flex flex-col sm:flex-row items-center gap-4">
				<select bind:value={itemsPerPage} class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto">
					<option value={6}>6 per page</option>
					<option value={12}>12 per page</option>
					<option value={24}>24 per page</option>
					<option value={48}>48 per page</option>
				</select>
				<div class="flex gap-2">
					<button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button>
					<button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showForm}
		<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border">
				<button onclick={closeForm} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">
					<X size={20} />
				</button>
				<LeadForm lead={editingLead} {isSaving} onSave={handleSave} />
			</div>
		</div>
	{/if}
</div>