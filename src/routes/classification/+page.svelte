<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import Table from "$lib/components/classification-table/Table.svelte";

    interface Classification {
        id: number | null;
        name: string;
    }

    let classifications: Classification[] = [];
    let currentClassification: Classification = { id: null, name: "" };
    let showDialog = false;
    let isEditing = false;
    let alertMessage = "";
    let alertType = "success";
    let showAlert = false;
    let isSaving = false;
    let isDeleting = false;

    const fetchClassifications = async () => {
        const { data, error } = await supabase.from("classification").select("id, name");
        if (error) {
            showAlertMessage("Error fetching classifications.", "error");
        } else {
            classifications = data || [];
        }
    };

    const showAlertMessage = (message: string, type: string = "success") => {
        alertMessage = message;
        alertType = type;
        showAlert = true;
        setTimeout(() => (showAlert = false), 3000);
    };

    const openDialog = (classification: Classification = { id: null, name: "" }) => {
        currentClassification = { ...classification };
        isEditing = classification.id !== null;
        showDialog = true;
    };

    const closeDialog = () => {
        showDialog = false;
        currentClassification = { id: null, name: "" };
    };

    const saveClassification = async () => {
        isSaving = true;

        if (isEditing && currentClassification.id !== null) {
            const { error } = await supabase
                .from("classification")
                .update({ name: currentClassification.name })
                .eq("id", currentClassification.id);

            if (error) {
                showAlertMessage("Error updating classification.", "error");
            } else {
                showAlertMessage("Classification updated successfully.");
                await fetchClassifications();
                closeDialog();
            }
        } else {
            const { error } = await supabase
                .from("classification")
                .insert({ name: currentClassification.name });

            if (error) {
                showAlertMessage("Error adding classification.", "error");
            } else {
                showAlertMessage("Classification added successfully.");
                await fetchClassifications();
                closeDialog();
            }
        }

        isSaving = false;
    };

    const deleteClassification = async (id: number) => {
        isDeleting = true;

        const { error } = await supabase.from("classification").delete().eq("id", id);

        if (error) {
            showAlertMessage("Error deleting classification.", "error");
        } else {
            showAlertMessage("Classification deleted successfully.");
            await fetchClassifications();
        }

        isDeleting = false;
    };

    onMount(async () => {
        await fetchClassifications();
    });
</script>

<main class="container mx-auto min-h-screen p-4">
    <Table />
  </main>