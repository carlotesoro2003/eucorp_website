<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { Plus, PencilIcon, X, TriangleAlert, TrendingUp } from "lucide-svelte";
	import RatingForm from "$lib/components/riskManagement-table/RatingForm.svelte";
	import TableRow from "$lib/components/riskManagement-table/TableRow.svelte";

	/** Types definitions */
	interface LikelihoodRating {
		id: number;
		name: string;
		symbol: string;
	}

	interface Severity {
		id: number;
		name: string;
		value: number;
	}

	interface RiskControlRating {
		id: number;
		name: string;
		symbol: string;
	}

	interface RiskMonitoringRating {
		id: number;
		status: string;
	}

	/** State variables */
	let likelihoodRating: LikelihoodRating[] = $state([]);
	let severity: Severity[] = $state([]);
	let riskControlRating: RiskControlRating[] = $state([]);
	let riskMonitoringRating: RiskMonitoringRating[] = $state([]);
	let isLoading: boolean = $state(false);
	let errorMessage: string | null = $state(null);
	let selectedDataType: string = $state("likelihoodRating");
	let showForm: boolean = $state(false);
	let editingItem: any = $state(null);

	/** Fetch likelihood rating */
	const fetchLikelihoodRating = async () => {
		try {
			isLoading = true;
			const { data, error } = await supabase.from("likelihood_rating").select("*");
			if (error) throw error;
			likelihoodRating = data;
		} catch (error: any) {
			console.error("Error fetching likelihood rating:", error);
			errorMessage = "Failed to fetch likelihood rating.";
		} finally {
			isLoading = false;
		}
	};

	/** Fetch severity */
	const fetchSeverity = async () => {
		try {
			isLoading = true;
			const { data, error } = await supabase.from("severity").select("*");
			if (error) throw error;
			severity = data;
		} catch (error: any) {
			console.error("Error fetching severity:", error);
			errorMessage = "Failed to fetch severity.";
		} finally {
			isLoading = false;
		}
	};

	/** Fetch risk control rating */
	const fetchRiskControlRating = async () => {
		try {
			isLoading = true;
			const { data, error } = await supabase.from("risk_control_rating").select("*");
			if (error) throw error;
			riskControlRating = data;
		} catch (error: any) {
			console.error("Error fetching risk control rating:", error);
			errorMessage = "Failed to fetch risk control rating.";
		} finally {
			isLoading = false;
		}
	};

	/** Fetch risk monitoring rating */
	const fetchRiskMonitoringRating = async () => {
		try {
			isLoading = true;
			const { data, error } = await supabase.from("risk_monitoring_rating").select("*");
			if (error) throw error;
			riskMonitoringRating = data;
		} catch (error: any) {
			console.error("Error fetching risk monitoring rating:", error);
			errorMessage = "Failed to fetch risk monitoring rating.";
		} finally {
			isLoading = false;
		}
	};

	/** Handle save */
	const handleSave = async (formData: any) => {
		try {
			isLoading = true;
			const tableName = getTableName();

			if (editingItem) {
				const { error } = await supabase.from(tableName).update(formData).eq("id", editingItem.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from(tableName).insert(formData);
				if (error) throw error;
			}

			await fetchData();
			closeForm();
		} catch (error: any) {
			console.error(error);
			errorMessage = `Failed to ${editingItem ? "update" : "create"} ${selectedDataType}`;
		} finally {
			isLoading = false;
		}
	};

	/** Delete item */
	const deleteItem = async (id: number) => {
		if (!confirm("Are you sure you want to delete this item?")) return;

		try {
			isLoading = true;
			const tableName = getTableName();
			const { error } = await supabase.from(tableName).delete().eq("id", id);
			if (error) throw error;
			await fetchData();
		} catch (error: any) {
			console.error(error);
			errorMessage = "Failed to delete item";
		} finally {
			isLoading = false;
		}
	};

	/** Get table name based on selected type */
	const getTableName = () => {
		switch (selectedDataType) {
			case "likelihoodRating":
				return "likelihood_rating";
			case "severity":
				return "severity";
			case "riskControlRating":
				return "risk_control_rating";
			case "riskMonitoringRating":
				return "risk_monitoring_rating";
			default:
				throw new Error("Invalid table name");
		}
	};

	/** Close form */
	const closeForm = () => {
		showForm = false;
		editingItem = null;
	};

	/** Edit item */
	const editItem = (item: any) => {
		editingItem = item;
		showForm = true;
	};

	/** Fetch data based on selected type */
	const fetchData = async () => {
		switch (selectedDataType) {
			case "likelihoodRating":
				await fetchLikelihoodRating();
				break;
			case "severity":
				await fetchSeverity();
				break;
			case "riskControlRating":
				await fetchRiskControlRating();
				break;
			case "riskMonitoringRating":
				await fetchRiskMonitoringRating();
				break;
		}
	};

	onMount(() => {
		fetchData();
	});

	// Watch for selectedDataType changes
	$effect(() => {
		fetchData();
	});
</script>

<div class="min-h-screen container">
	<div class="mb-6">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div class="flex items-center gap-2">
				<TrendingUp class="w-8 h-8 text-primary" />
				<h1 class="text-2xl font-bold">Ratings Management</h1>
			</div>
		</div>
	  
		<!-- Dropdown and Button on the same line -->
		<div class="flex justify-between py-3 items-center">
		  <div class="flex items-center">
			<label for="dataSelect" class="text-lg font-semibold mr-4">Select Data Type:</label>
			<div class="relative w-64">
			  <select
				id="dataSelect"
				bind:value={selectedDataType}
				class="w-full px-4 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring border border-border rounded-lg appearance-none"
			  >
				<option value="likelihoodRating">Likelihood Rating</option>
				<option value="severity">Severity</option>
				<option value="riskControlRating">Risk Control Rating</option>
				<option value="riskMonitoringRating">Risk Monitoring Rating</option>
			  </select>
			  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
				<svg
				  class="w-5 h-5 text-gray-500"
				  xmlns="http://www.w3.org/2000/svg"
				  fill="none"
				  viewBox="0 0 24 24"
				  stroke="currentColor"
				>
				  <path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7"
				  />
				</svg>
			  </div>
			</div>
		  </div>
		  <button
			onclick={() => {
			  editingItem = null;
			  showForm = true;
			}}
			class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
		  >
			<Plus size={20} />
			Add New
		  </button>
		</div>
	  </div>
	  

	<!-- Loading Indicator -->
	{#if isLoading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else}
		<!-- Tables -->
	<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
		<!-- Likelihood Rating Table -->
		{#if selectedDataType === "likelihoodRating"}
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-6 py-4 text-left">Name</th>
						<th class="px-6 py-4 text-left">Symbol</th>
						<th class="px-6 py-4 text-left">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each likelihoodRating as item}
						<TableRow {item} onEdit={editItem} onDelete={deleteItem} type="likelihoodRating" />
					{/each}
				</tbody>
			</table>
		{/if}

		<!-- Severity Table -->
		{#if selectedDataType === "severity"}
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-6 py-4 text-left">Name</th>
						<th class="px-6 py-4 text-left">Value</th>
						<th class="px-6 py-4 text-left">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each severity as item}
						<TableRow {item} onEdit={editItem} onDelete={deleteItem} type="severity" />
					{/each}
				</tbody>
			</table>
		{/if}

		<!-- Risk Control Rating Table -->
		{#if selectedDataType === "riskControlRating"}
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-6 py-4 text-left">Name</th>
						<th class="px-6 py-4 text-left">Symbol</th>
						<th class="px-6 py-4 text-left">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each riskControlRating as item}
						<TableRow {item} onEdit={editItem} onDelete={deleteItem} type="riskControlRating" />
					{/each}
				</tbody>
			</table>
		{/if}

		<!-- Risk Monitoring Rating Table -->
		{#if selectedDataType === "riskMonitoringRating"}
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-6 py-4 text-left">Status</th>
						<th class="px-6 py-4 text-left">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each riskMonitoringRating as item}
						<TableRow {item} onEdit={editItem} onDelete={deleteItem} type="riskMonitoringRating" />
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
	{/if}

	<!-- Error Message -->
	<!-- {#if errorMessage}
		<div class="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
			<p>{errorMessage}</p>
		</div>
	{/if} -->

	
</div>

<!-- Form Modal -->
{#if showForm}
	<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
		<div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border">
			<button onclick={closeForm} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">
				<X size={20} />
			</button>
			<RatingForm type={selectedDataType} item={editingItem} onSave={handleSave} onCancel={closeForm} />
		</div>
	</div>
{/if}
