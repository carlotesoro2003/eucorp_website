<script lang="ts">
	 import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { Plus, PencilIcon, Trash2, X, CalendarRange, School, Search } from "lucide-svelte";

    /** Types definitions */
    interface SchoolYear {
        id: number;
        school_year: string;
        start_date: string;
        end_date: string;
        mid_year?: string;
    }

    /** Form data interface */
    interface FormData {
        school_year: string;
        start_date: string;
        end_date: string;
        mid_year?: string;
    }

    /** State variables */
    let schoolYears: SchoolYear[] = $state([]);
    let isLoading: boolean = $state(false);
    let errorMessage: string | null = $state(null);
    let showForm: boolean = $state(false);
    let editingItem: SchoolYear | null = $state(null);
    let searchQuery: string = $state("");
    let formData: FormData = $state({
        school_year: "",
        start_date: "",
        end_date: "",
        mid_year: ""
    });

    /** Get minimum date for end date based on start date */
    const getMinEndDate = () => editingItem.start_date || new Date().toISOString().split('T')[0];

    /** Derived filtered school years based on search query */
    const filteredSchoolYears = $derived(
        schoolYears.filter((year) => 
            year.school_year.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );


	/** Fetch school years */
	const fetchSchoolYears = async () => {
		try {
			isLoading = true;
			errorMessage = null;
			const { data, error } = await supabase.from("school_years").select("*").order("start_date", { ascending: true });
			if (error) throw error;
			schoolYears = data;
		} catch (error: any) {
			console.error("Error fetching school years:", error);
			errorMessage = "Failed to fetch school years.";
		} finally {
			isLoading = false;
		}
	};

	/** Calculate mid-year */
	const calculateMidYear = (startDate: string, endDate: string): string => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const midYear = new Date((start.getTime() + end.getTime()) / 2);
		return midYear.toISOString().split("T")[0]; // Format as YYYY-MM-DD
	};

	/** Handle save */
	const handleSave = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!editingItem) return;

		try {
			isLoading = true;
			errorMessage = null;

			const mid_year = calculateMidYear(editingItem.start_date, editingItem.end_date);
			const formData = {
				school_year: editingItem.school_year,
				start_date: editingItem.start_date,
				end_date: editingItem.end_date,
				mid_year,
			};

			if (editingItem.id) {
				const { error } = await supabase.from("school_years").update(formData).eq("id", editingItem.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("school_years").insert(formData);
				if (error) throw error;
			}

			await fetchSchoolYears();
			closeForm();
		} catch (error: any) {
			console.error(error);
			errorMessage = `Failed to ${editingItem.id ? "update" : "create"} school year.`;
		} finally {
			isLoading = false;
		}
	};

	/** Delete school year */
	const deleteItem = async (id: number) => {
		if (!confirm("Are you sure you want to delete this school year?")) return;

		try {
			isLoading = true;
			errorMessage = null;
			const { error } = await supabase.from("school_years").delete().eq("id", id);
			if (error) throw error;
			await fetchSchoolYears();
		} catch (error: any) {
			console.error("Error deleting school year:", error);
			errorMessage = "Failed to delete school year.";
		} finally {
			isLoading = false;
		}
	};

	/** Close form and reset editing item */
	const closeForm = () => {
		showForm = false;
		editingItem = null;
	};

	/** Edit item */
	const editItem = (item: SchoolYear) => {
		editingItem = { ...item };
		showForm = true;
	};

	/** Open create form */
	const openCreateForm = () => {
		editingItem = {
			id: 0,
			school_year: "",
			start_date: "",
			end_date: "",
		};
		showForm = true;
	};

	/** Format date to local string */
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString();
	};

	onMount(() => {
		fetchSchoolYears();
	});
</script>


	<div class="container px-6 py-6 mx-auto">
  <!-- Header -->
  <div class="flex flex-col gap-6 mb-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-2">
        <School class="w-8 h-8 text-primary" />
        <h1 class="text-2xl font-bold">School Years Management</h1>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between gap-4 w-full">
      <!-- Search input -->
      <div class="relative flex-1 w-full md:max-w-[300px]">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search school years..."
          class="pl-10 sm:max-w-md px-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <!-- Add New Year button -->
      <div class="flex gap-2 w-full md:w-auto md:justify-end">
        <button
          onclick={openCreateForm}
          class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Year</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Error Message -->
  {#if errorMessage}
    <div class="mb-6" transition:fade>
      <div class="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
        <X size={20} />
        <p>{errorMessage}</p>
      </div>
    </div>
  {/if}

  <!-- Loading Indicator -->
  {#if isLoading}
    <div class="flex justify-center p-8" transition:fade>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  {:else if filteredSchoolYears.length === 0}
    <div class="text-center py-12 bg-card rounded-lg border border-border" transition:fade>
      <CalendarRange size={48} class="mx-auto text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">No School Years Found</h3>
      <p class="text-muted-foreground">Start by adding a new school year.</p>
    </div>
  {:else}
    <!-- School Years Table -->
    <div class="overflow-x-auto bg-card rounded-lg shadow border border-border" transition:fade>
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-6 py-4 text-left font-medium">School Year</th>
            <th class="px-6 py-4 text-left font-medium">Start Date</th>
            <th class="px-6 py-4 text-left font-medium">End Date</th>
            <th class="px-6 py-4 text-left font-medium">Mid Year</th>
            <th class="px-6 py-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#each filteredSchoolYears as item}
            <tr class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 font-medium">{item.school_year}</td>
              <td class="px-6 py-4">{formatDate(item.start_date)}</td>
              <td class="px-6 py-4">{formatDate(item.end_date)}</td>
              <td class="px-6 py-4">{item.mid_year ? formatDate(item.mid_year) : "-"}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <button onclick={() => editItem(item)} class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit">
                    <PencilIcon size={18} />
                  </button>
                  <button onclick={() => deleteItem(item.id)} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>



<!-- Form Modal -->
{#if showForm}
	<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" transition:fade>
		<div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border shadow-lg" transition:scale={{ duration: 200 }}>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-xl font-semibold">
					{editingItem?.id ? "Edit School Year" : "Create School Year"}
				</h2>
				<button onclick={closeForm} class="p-1 hover:bg-muted rounded-lg transition-colors" title="Close">
					<X size={20} />
				</button>
			</div>

			<form onsubmit={handleSave}>
				<div class="space-y-4">
					<div>
						<label for="school_year" class="block text-sm font-medium mb-1">School Year</label>
						<input id="school_year" type="text" bind:value={editingItem.school_year} class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="2023-2024" required />
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<label for="start_date" class="text-sm font-medium">Start Date</label>
							<input
								type="date"
								id="start_date"
								bind:value={editingItem.start_date}
								class="w-full px-3 py-2 border rounded-md"
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="end_date" class="text-sm font-medium">End Date</label>
							<input
								type="date"
								id="end_date"
								bind:value={editingItem.end_date}
								min={getMinEndDate()}
								class="w-full px-3 py-2 border rounded-md"
								required
							/>
						</div>
					</div>
				</div>

				<div class="flex justify-end gap-4 mt-6">
					<button type="button" onclick={closeForm} class="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
					<button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={isLoading}>
						{isLoading ? "Saving..." : "Save"}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
