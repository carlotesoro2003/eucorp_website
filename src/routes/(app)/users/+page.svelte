<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { onMount } from "svelte";
  import { supabase, supabaseAdmin } from "$lib/supabaseClient";
  import Table from '$lib/components/user-table/Table.svelte';

  

  let users: Array<{
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    department_id?: string;
    department_name?: string;
    profile_pic: string | null;
    is_verified: boolean;
  }> = [];

  let departments: Array<{ id: string; name: string }> = [];
  let selectedUser: (typeof users)[0] | null = null;
  let selectedDepartmentId: string | null = null;
  let selectedRole: string = "";
  let showAlert = false;
  let alertMessage = "";
  let alertType = "success"; // "success", "error", "info", etc.
  let saving = false;
  let loading = true;
  let approvingUserId: string | null = null; // Tracks the user being approved
  let deletingUserId: string | null = null; // Tracks the user being deleted

  // Fetch users and departments
  onMount(async () => {
    await fetchDepartments();
    await fetchUsers();
    loading = false;
  });

  async function fetchDepartments() {
    const { data: deptData, error } = await supabase
      .from("departments")
      .select("id, name");

    if (error) {
      displayAlert("Error fetching departments: " + error.message, "error");
    } else {
      departments = deptData || [];
    }
  }

  async function fetchUsers() {
    const { data: userData, error } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, role, department_id, profile_pic, is_verified"
      );

    if (error) {
      displayAlert("Error fetching users: " + error.message, "error");
    } else {
      users = (userData || []).map((user) => ({
        ...user,
        department_name:
          departments.find((dept) => dept.id === user.department_id)?.name ||
          "N/A",
      }));
    }
  }

  const displayAlert = (message: string, type: string) => {
    alertMessage = message;
    alertType = type;
    showAlert = true;

    setTimeout(() => {
      showAlert = false;
    }, 3000); // Auto-hide after 3 seconds
  };

  const editUser = (user: (typeof users)[0]) => {
    selectedUser = { ...user };
    selectedDepartmentId = user.department_id || null;
    selectedRole = user.role || "";
  };

  const saveProfile = async () => {
  if (selectedUser) {
    // Define roles that do not require a department
    const rolesWithoutDepartment = ["admin", "vice_president", "president"];

    // Validate role and department
    if (
      !selectedRole || // Role is required
      (!rolesWithoutDepartment.includes(selectedRole) && !selectedDepartmentId) // Department is required for other roles
    ) {
      displayAlert("Role or department selection is missing.", "error");
      return;
    }

    saving = true;

    // Update the profile in Supabase
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        department_id: rolesWithoutDepartment.includes(selectedRole)
          ? undefined // Set department to undefined for roles that don't require it
          : selectedDepartmentId,
        role: selectedRole,
      })
      .eq("id", selectedUser.id);

    if (error) {
      displayAlert("Error updating profile: " + error.message, "error");
    } else {
      // Update the local users array
      const updatedUserIndex = users.findIndex(
        (user) => user.id === selectedUser?.id
      );
      if (updatedUserIndex >= 0) {
        users[updatedUserIndex] = {
          ...users[updatedUserIndex],
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          department_id: selectedDepartmentId || undefined,
          role: selectedRole,
        };
      }
      displayAlert("Profile updated successfully!", "success");
      selectedUser = null; // Reset selected user
    }

    saving = false; // Stop saving state
  }
};


  const approveUser = async (userId: string) => {
    approvingUserId = userId; // Start spinner for this user
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", userId);

      if (error) {
        displayAlert("Failed to approve user: " + error.message, "error");
      } else {
        displayAlert("User approved successfully!", "success");
        users = users.map((user) =>
          user.id === userId ? { ...user, is_verified: true } : user
        );
      }
    } catch (err) {
      displayAlert("An unexpected error occurred.", "error");
    } finally {
      approvingUserId = null; // Stop spinner
    }
  };

  const deleteUser = async (userId: string) => {
    deletingUserId = userId;
    try {
      // Delete the user from Supabase Authentication
      const { error: authError } =
        await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authError) {
        displayAlert(
          "Error deleting user from authentication: " + authError.message,
          "error"
        );
        return;
      }

      // Delete the user from the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        displayAlert("Error deleting user profile: " + profileError.message, "error");
      } else {
        users = users.filter((user) => user.id !== userId);
        displayAlert("User deleted successfully!", "success");
      }
    } catch (err) {
      displayAlert("An unexpected error occurred.", "error");
    } finally {
      deletingUserId = null;
    }
  };
</script>

<main class="container mx-auto min-h-screen p-4">
  <Table />
</main>