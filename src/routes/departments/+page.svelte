<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import Table from '$lib/components/department-table/Table.svelte';
  
    let departments: Array<{ id: number; name: string; full_name: string }> = [];
    let showDialog = false;
    let isEditing = false;
  
    let currentDepartment: { id: number | null; name: string; full_name: string } = { id: null, name: '', full_name: '' };
    let alertMessage = '';
    let alertType = 'success';
    let showAlert = false;
    let isSaving = false;
    let isDeleting = false;
  
    onMount(async () => {
      await fetchDepartments();
    });
    
  
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from('departments').select('id, name, full_name');
      if (error) {
        showAlertMessage('Error fetching departments', 'error');
      } else {
        departments = data;
      }
    };
  
    const showAlertMessage = (message: string, type: string = 'success') => {
      alertMessage = message;
      alertType = type;
      showAlert = true;
      setTimeout(() => (showAlert = false), 3000);
    };
  
    const openDialog = (department: { id: number | null; name: string; full_name: string } = { id: null, name: '', full_name: '' }) => {
      currentDepartment = { ...department };
      isEditing = department.id !== null;
      showDialog = true;
    };
  
    const closeDialog = () => {
      showDialog = false;
      currentDepartment = { id: null, name: '', full_name: '' };
    };
  
    const saveDepartment = async () => {
      isSaving = true;
      if (isEditing && currentDepartment.id !== null) {
        const { error } = await supabase.from('departments').update({
          name: currentDepartment.name,
          full_name: currentDepartment.full_name,
        }).eq('id', currentDepartment.id);
  
        if (error) {
          showAlertMessage('Error updating department', 'error');
        } else {
          showAlertMessage('Department updated successfully');
          await fetchDepartments();
          closeDialog();
        }
      } else {
        const { error } = await supabase.from('departments').insert({
          name: currentDepartment.name,
          full_name: currentDepartment.full_name,
        });
  
        if (error) {
          showAlertMessage('Error adding department', 'error');
        } else {
          showAlertMessage('Department added successfully');
          await fetchDepartments();
          closeDialog();
        }
      }
      isSaving = false;
    };
  
    const deleteDepartment = async (id: number) => {
      isDeleting = true;
      const { error } = await supabase.from('departments').delete().eq('id', id);
  
      if (error) {
        showAlertMessage('Error deleting department', 'error');
      } else {
        showAlertMessage('Department deleted successfully');
        await fetchDepartments();
      }
      isDeleting = false;
    };
  </script>
  
  <main class="container mx-auto min-h-screen p-4">
    <Table />
  </main>