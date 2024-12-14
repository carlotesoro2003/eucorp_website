<script lang="ts">
	import { Building, Download, Plus, Search, X } from "lucide-svelte";
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import DepartmentForm from "$lib/components/department-table/DepartmentForm.svelte";
	import DepartmentCard from '$lib/components/department-table/DepartmentCard.svelte';
    import { fade } from "svelte/transition";

	// Types
	type Department = {
		id: number;
		name: string;
		full_name: string;
	};

	type SortDirection = "asc" | "desc";

	// State variables
	let departments: Department[] = $state([]);
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(6);
	let showForm: boolean = $state(false);
	let editingDepartment: Department | null = $state(null);
	let sortDirection: SortDirection = $state("asc");
	let alertMessage: string = $state("");
	let alertType: "success" | "error" = $state("success");
	let showAlert: boolean = $state(false);
	let isSaving: boolean = $state(false);
	let isDeleting: boolean = $state(false);
	let isLoading: boolean = $state(false);

	// Fetch departments on mount
	onMount(async () => {
		await fetchDepartments();
	});

	// Derived values
	const filteredDepartments = $derived(departments.filter((dept) => dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || dept.full_name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => (sortDirection === "asc" ? a.full_name.localeCompare(b.full_name) : b.full_name.localeCompare(a.full_name))));

	const paginatedDepartments = $derived(filteredDepartments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const totalPages = $derived(Math.ceil(filteredDepartments.length / itemsPerPage));

	/** Show alert message */
	const showAlertMessage = (message: string, type: "success" | "error" = "success") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => (showAlert = false), 3000);
	};

	/** Fetch departments */
	const fetchDepartments = async () => {
		isLoading = true;
		const { data, error } = await supabase.from("departments").select("id, name, full_name");
		if (error) {
			showAlertMessage("Error fetching departments", "error");
		} else {
			departments = data;
		}
		isLoading = false;
	};

	/** Export to CSV */
	const exportToCSV = () => {
		const headers = ["Name", "Full Name"];
		const csvContent = [headers.join(","), ...departments.map((dept) => [dept.name, dept.full_name].join(","))].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", "departments.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	/** Close form */
	const closeForm = () => {
		showForm = false;
		editingDepartment = null;
	};

	/** Handle form save */
	const handleSave = async (department: { id: number | null; name: string; full_name: string }) => {
		isSaving = true;
		if (department.id) {
			const { error } = await supabase
				.from("departments")
				.update({
					name: department.name,
					full_name: department.full_name,
				})
				.eq("id", department.id);

			if (error) {
				showAlertMessage("Error updating department", "error");
			} else {
				showAlertMessage("Department updated successfully");
				await fetchDepartments();
				closeForm();
			}
		} else {
			const { error } = await supabase.from("departments").insert({
				name: department.name,
				full_name: department.full_name,
			});

			if (error) {
				showAlertMessage("Error adding department", "error");
			} else {
				showAlertMessage("Department added successfully");
				await fetchDepartments();
				closeForm();
			}
		}
		isSaving = false;
	};

	/** Handle delete */
	const handleDelete = async (id: number) => {
		isDeleting = true;
		const { error } = await supabase.from("departments").delete().eq("id", id);

		if (error) {
			showAlertMessage("Error deleting department", "error");
		} else {
			showAlertMessage("Department deleted successfully");
			await fetchDepartments();
		}
		isDeleting = false;
	};
</script>

<div class="flex flex-col gap-4 container mx-auto">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<Building class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Department Management</h1>
		</div>
	</div>

	{#if showAlert}
		<div class={`p-4 rounded-lg ${alertType === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
			{alertMessage}
		</div>
	{/if}

	<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
		<div class="relative flex-1 w-full md:max-w-[300px]">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
			<input type="text" bind:value={searchQuery} placeholder="Search departments..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
		</div>
		<div class="flex gap-2 w-full md:w-auto">
			<button onclick={exportToCSV} class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial">
				<Download size={20} />
				Export
			</button>
			<button
				onclick={() => {
					editingDepartment = null;
					showForm = true;
				}}
				class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial"
			>
				<Plus size={20} />
				Add Department
			</button>
		</div>
	</div>

	{#if isLoading}
	<div class="flex justify-center p-8">
		<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
	</div>
	{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each paginatedDepartments as department (department.id)}
			<DepartmentCard
				{department}
				{isDeleting}
				onEdit={() => {
					editingDepartment = department;
					showForm = true;
				}}
				onDelete={handleDelete}
			/>
		{/each}
	</div>

	<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
		<div class="text-sm text-muted-foreground">
			Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDepartments.length)} of {filteredDepartments.length} results
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

	{#if showForm}
		<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border">
				<button onclick={closeForm} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">
					<X size={20} />
				</button>
				<DepartmentForm department={editingDepartment} {isSaving} onSave={handleSave} />
			</div>
		</div>
	{/if}
	{/if}
	
</div>
