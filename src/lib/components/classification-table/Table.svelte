<script lang="ts">
	import { Plus, Search } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import UserForm from "$lib/components/classification-table/UserForm.svelte";
	import ClassificationCard from "$lib/components/classification-table/ClassificationCard.svelte";

	// Types
	interface Classification {
		id: number | null;
		name: string;
	}

	// State variables
	let classifications: Classification[] = $state([]);
	let currentClassification: Classification = $state({ id: null, name: "" });
	let showDialog: boolean = $state(false);
	let isEditing: boolean = $state(false);
	let searchQuery: string = $state("");
	let showAlert: boolean = $state(false);
	let alertMessage: string = $state("");
	let alertType: string = $state("success");
	let isLoading: boolean = $state(false);

	// Pagination state
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(6);

	// Derived values for search and pagination
	const filteredClassifications = $derived(classifications.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())));

	const paginatedClassifications = $derived(filteredClassifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const totalPages = $derived(Math.ceil(filteredClassifications.length / itemsPerPage));

	/** Fetch all classifications */
	const fetchClassifications = async () => {
		isLoading = true;
		const { data, error } = await supabase.from("classification").select("id, name");
		if (error) {
			showAlertMessage("Error fetching classifications.", "error");
		} else {
			classifications = data || [];
		}
		isLoading = false;
	};

	/** Show alert message */
	const showAlertMessage = (message: string, type: string = "success") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => (showAlert = false), 3000);
	};

	/** Open dialog for edit or create */
	const openDialog = (classification: Classification = { id: null, name: "" }) => {
		currentClassification = { ...classification };
		isEditing = classification.id !== null;
		showDialog = true;
	};

	/** Close dialog */
	const closeDialog = () => {
		showDialog = false;
		currentClassification = { id: null, name: "" };
	};

	/** Handle form submission */
	const handleSubmit = async (classification: Classification) => {
		if (isEditing && classification.id !== null) {
			const { error } = await supabase.from("classification").update({ name: classification.name }).eq("id", classification.id);

			if (error) {
				showAlertMessage("Error updating classification.", "error");
				return false;
			}
			showAlertMessage("Classification updated successfully.");
		} else {
			const { error } = await supabase.from("classification").insert({ name: classification.name });

			if (error) {
				showAlertMessage("Error adding classification.", "error");
				return false;
			}
			showAlertMessage("Classification added successfully.");
		}

		await fetchClassifications();
		closeDialog();
		return true;
	};

	/** Delete classification */
	const deleteClassification = async (id: number) => {
		const { error } = await supabase.from("classification").delete().eq("id", id);

		if (error) {
			showAlertMessage("Error deleting classification.", "error");
		} else {
			showAlertMessage("Classification deleted successfully.");
			await fetchClassifications();
		}
	};

	// Reset page when search changes
	$effect(() => {
		if (searchQuery) {
			currentPage = 1;
		}
	});

	// Fetch classifications on mount
	$effect(() => {
		fetchClassifications();
	});
</script>

<div class="flex flex-col gap-4 container mx-auto ">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<h2 class="text-2xl font-bold">Classifications Management</h2>
	</div>

	<!-- Alert -->
	{#if showAlert}
		<div class="p-4 rounded-lg {alertType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<!-- Filters section -->
	<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
		<div class="relative flex-1 w-full md:max-w-[300px]">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
			<input type="text" bind:value={searchQuery} placeholder="Search classifications..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
		</div>
		<button onclick={() => openDialog()} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center whitespace-nowrap w-full md:w-auto">
			<Plus size={20} />
			Add Classification
		</button>
	</div>

	{#if isLoading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else}
		<!-- Cards Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each paginatedClassifications as classification}
			<ClassificationCard {classification} onEdit={openDialog} onDelete={deleteClassification} />
		{/each}
	</div>

	<!-- Pagination -->
	<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
		<div class="text-sm text-muted-foreground">
			Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClassifications.length)} of {filteredClassifications.length} results
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
	

	<!-- Form Dialog -->
	{#if showDialog}
		<UserForm {isEditing} classification={currentClassification} onClose={closeDialog} onSubmit={handleSubmit} />
	{/if}
</div>
