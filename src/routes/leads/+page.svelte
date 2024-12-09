<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import Table from "$lib/components/leads-table/Table.svelte";

    interface Leads {
        id: number;
        name: string;
    }

    let leads: Leads[] = [];
    let isLoading = false;
    let isSaving = false;
    let errorMessage: string | null = null;
    let successMessage: string | null = null;

    // Variables for dialog and form fields
    let showDialog = false;
    let isEditing = false;
    let formLead: Leads = { id: 0, name: "" };

    // Fetch all leads
    const fetchLeads = async () => {
        isLoading = true;
        const { data, error } = await supabase
            .from("leads")
            .select("*");

        if (error) {
            console.error("Error fetching leads:", error);
            errorMessage = "Failed to fetch leads.";
        } else {
            leads = data;
            errorMessage = null;
        }

        isLoading = false;
    };

    // Create or update lead
    const saveLead = async () => {
        isSaving = true;
        const { data, error } = isEditing
            ? await supabase.from("leads").update({ name: formLead.name }).eq("id", formLead.id)
            : await supabase.from("leads").insert([{ name: formLead.name }]);

        if (error) {
            console.error("Error saving lead:", error);
            errorMessage = "Failed to save lead.";
        } else {
            successMessage = isEditing ? "Lead updated successfully!" : "Lead added successfully!";
            errorMessage = null;
            await fetchLeads();
            closeDialog();
        }
        isSaving = false;
    };

    // Delete lead
    const deleteLead = async (id: number) => {
        isSaving = true;
        const { error } = await supabase.from("leads").delete().eq("id", id);

        if (error) {
            console.error("Error deleting lead:", error);
            errorMessage = "Failed to delete lead.";
        } else {
            successMessage = "Lead deleted successfully!";
            errorMessage = null;
            await fetchLeads();
        }
        isSaving = false;
    };

    // Open dialog for creating a new lead
    const openDialogForNewLead = () => {
        formLead = { id: 0, name: "" };
        isEditing = false;
        showDialog = true;
    };

    // Open dialog for editing an existing lead
    const openDialogForEdit = (lead: Leads) => {
        formLead = { ...lead };
        isEditing = true;
        showDialog = true;
    };

    // Close dialog
    const closeDialog = () => {
        formLead = { id: 0, name: "" };
        isEditing = false;
        showDialog = false;
    };

    // Initialize leads on mount
    onMount(() => {
        fetchLeads();
    });
</script>

<main class="container mx-auto min-h-screen p-4">
    <Table />
  </main>