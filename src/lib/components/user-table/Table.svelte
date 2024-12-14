	<script lang="ts">
		import { Download, Pencil, Search, Trash2, Plus, X, ArrowUpDown, School, Users2, User2 } from "lucide-svelte";
		import TableRow from "$lib/components/user-table/TableRow.svelte";
		import UserForm from "$lib/components/user-table/UserForm.svelte";
		import { supabase, supabaseAdmin } from "$lib/supabaseClient";
    import { fade } from "svelte/transition";

		/** User type definition */
		type User = {
			id: string;
			first_name: string;
			last_name: string;
			role: string;
			email: string;
			department_id?: string;
			department_name?: string;
			profile_pic: string | null;
			is_verified: boolean;
		};

		/** Department type definition */
		type Department = {
			id: string;
			name: string;
		};

		type SortField = "first_name" | "email" | "role" | "status";
		type SortDirection = "asc" | "desc";

		// State variables
		let searchQuery: string = $state("");
		let currentPage: number = $state(1);
		let itemsPerPage: number = $state(5);
		let showForm: boolean = $state(false);
		let editingUser: User | null = $state(null);
		let sortField: SortField = $state("first_name");
		let sortDirection: SortDirection = $state("asc");
		let statusFilter: string = $state("all");
		let roleFilter: string = $state("all");
		let showMobileFilters: boolean = $state(false);
		let showAlert: boolean = $state(false);
		let alertMessage: string = $state("");
		let alertType: string = $state("success");
		let saving: boolean = $state(false);
		let loading: boolean = $state(true);
		let approvingUserId: string | null = $state(null);
		let deletingUserId: string | null = $state(null);

		// Data state
		let users: User[] = $state([]);
		let departments: Department[] = $state([]);

		// Initialize data on component mount
		const init = async () => {
			await fetchDepartments();
			await fetchUsers();
			loading = false;
		};

		/** Fetch departments from database */
		async function fetchDepartments() {
			const { data: deptData, error } = await supabase.from("departments").select("id, name");

			if (error) {
				displayAlert("Error fetching departments: " + error.message, "error");
			} else {
				departments = deptData || [];
			}
		}

		/** Fetch users from database */
		async function fetchUsers() {
			const { data: userData, error } = await supabase.from("profiles").select("id, first_name, last_name, email, role, department_id, profile_pic, is_verified");

			if (error) {
				displayAlert("Error fetching users: " + error.message, "error");
			} else {
				users = (userData || []).map((user) => ({
					...user,
					department_name: departments.find((dept) => dept.id === user.department_id)?.name || "N/A",
				}));
			}
		}

		/** Display alert message */
		const displayAlert = (message: string, type: string) => {
			alertMessage = message;
			alertType = type;
			showAlert = true;

			setTimeout(() => {
				showAlert = false;
			}, 3000);
		};

		// Get unique roles for filter
		const uniqueRoles = $derived([...new Set(users.map((user) => user.role))]);

		// Derived values with sorting and filtering
		const filteredItems = $derived(
			users
				.filter((user) => {
					const searchFields = `${user.first_name} ${user.last_name} ${user.email} ${user.role}`.toLowerCase();
					const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
					const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? user.is_verified : !user.is_verified);
					const matchesRole = roleFilter === "all" || user.role === roleFilter;
					return matchesSearch && matchesStatus && matchesRole;
				})
				.sort((a, b) => {
					const aValue = sortField === "first_name" ? a.first_name : a[sortField];
					const bValue = sortField === "first_name" ? b.first_name : b[sortField];
					return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
				})
		);

		const paginatedItems = $derived(filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
		const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));

		/** Toggle sort direction and field */
		const toggleSort = (field: SortField) => {
			if (sortField === field) {
				sortDirection = sortDirection === "asc" ? "desc" : "asc";
			} else {
				sortField = field;
				sortDirection = "asc";
			}
		};

		/** Export items to CSV */
		const exportToCSV = () => {
			const headers = ["First Name", "Last Name", "Email", "Role", "Department", "Status"];
			const csvContent = [headers.join(","), ...users.map((user) => [user.first_name, user.last_name, user.email, user.role, user.department_name, user.is_verified ? "Verified" : "Not Verified"].join(","))].join("\n");

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);

			link.setAttribute("href", url);
			link.setAttribute("download", "users.csv");
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};

		/** Save user profile */
		const saveProfile = async (formData: Partial<User>) => {
			if (editingUser) {
				const rolesWithoutDepartment = ["admin", "vice_president", "president"];

				saving = true;

				const { error } = await supabase
					.from("profiles")
					.update({
						first_name: formData.first_name,
						last_name: formData.last_name,
						department_id: rolesWithoutDepartment.includes(formData.role || "") ? undefined : formData.department_id,
						role: formData.role,
					})
					.eq("id", editingUser.id);

				if (error) {
					displayAlert("Error updating profile: " + error.message, "error");
				} else {
					await fetchUsers();
					displayAlert("Profile updated successfully!", "success");
					closeForm();
				}

				saving = false;
			}
		};

		/** Delete user */
		const deleteUser = async (userId: string) => {
			deletingUserId = userId;
			try {
				const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
				if (authError) {
					displayAlert("Error deleting user from authentication: " + authError.message, "error");
					return;
				}

				const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);

				if (profileError) {
					displayAlert("Error deleting user profile: " + profileError.message, "error");
				} else {
					await fetchUsers();
					displayAlert("User deleted successfully!", "success");
				}
			} catch (err) {
				displayAlert("An unexpected error occurred.", "error");
			} finally {
				deletingUserId = null;
			}
		};

		/** Approve user */
		const approveUser = async (userId: string) => {
			approvingUserId = userId;
			try {
				const { error } = await supabase.from("profiles").update({ is_verified: true }).eq("id", userId);

				if (error) {
					displayAlert("Failed to approve user: " + error.message, "error");
				} else {
					await fetchUsers();
					displayAlert("User approved successfully!", "success");
				}
			} catch (err) {
				displayAlert("An unexpected error occurred.", "error");
			} finally {
				approvingUserId = null;
			}
		};

		/** Close form */
		const closeForm = () => {
			showForm = false;
			editingUser = null;
		};

		// Initialize data
		init();
	</script>

	<div class="flex flex-col gap-4 container mx-auto">
		{#if showAlert}
			<div class="alert alert-{alertType} shadow-lg mb-4">
				<div>
					<span>{alertMessage}</span>
				</div>
			</div>
		{/if}

		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div class="flex items-center gap-2">
				<User2 class="w-8 h-8 text-primary" />
				<h1 class="text-2xl font-bold">User Management</h1>
			</div>
		</div>

		<!-- Mobile filters toggle -->
		<button onclick={() => (showMobileFilters = !showMobileFilters)} class="md:hidden w-full px-4 py-2 bg-secondary rounded-lg text-left flex justify-between items-center">
			Filters
			<ArrowUpDown size={16} class={showMobileFilters ? "rotate-180" : ""} />
		</button>

		<!-- Filters section -->
		<div class={`flex flex-col gap-4 ${showMobileFilters ? "block" : "hidden"} md:flex md:flex-row md:items-center md:justify-between`}>
			<div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
				<div class="relative flex-1 md:w-[300px]">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
					<input type="text" bind:value={searchQuery} placeholder="Search users..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>
				<select bind:value={statusFilter} class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[150px]">
					<option value="all">All Status</option>
					<option value="active">Verified</option>
					<option value="inactive">Not Verified</option>
				</select>
				<select bind:value={roleFilter} class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[150px]">
					<option value="all">All Roles</option>
					{#each uniqueRoles as role}
						<option value={role}>{role}</option>
					{/each}
				</select>
			</div>
			<div class="flex gap-2 w-full md:w-auto">
				<button onclick={exportToCSV} class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial whitespace-nowrap">
					<Download size={20} />
					Export
				</button>
			</div>
		</div>
		
		<!-- Loading -->
		{#if loading}
			<div class="flex justify-center p-8 ">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
		<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">Profile</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("first_name")} class="flex items-center gap-1 hover:text-primary">
								Name
								<ArrowUpDown size={16} class={sortField === "first_name" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden md:table-cell">
							<button onclick={() => toggleSort("email")} class="flex items-center gap-1 hover:text-primary">
								Email
								<ArrowUpDown size={16} class={sortField === "email" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden sm:table-cell">
							<button onclick={() => toggleSort("role")} class="flex items-center gap-1 hover:text-primary">
								Role
								<ArrowUpDown size={16} class={sortField === "role" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">Department</th>
						<th class="px-4 py-3 text-left">Status</th>
						<th class="px-4 py-3 text-left w-[100px]">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedItems as user (user.id)}
						<TableRow
							{user}
							{departments}
							onEdit={(user) => {
								editingUser = user;
								showForm = true;
							}}
							onDelete={deleteUser}
							onApprove={approveUser}
							{approvingUserId}
							{deletingUserId}
						/>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
			<div class="text-sm text-muted-foreground text-center sm:text-left">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
			</div>
			<div class="flex flex-col sm:flex-row items-center gap-4">
				<select bind:value={itemsPerPage} class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto">
					<option value={5}>5 per page</option>
					<option value={10}>10 per page</option>
					<option value={25}>25 per page</option>
					<option value={50}>50 per page</option>
				</select>
				<div class="flex gap-2">
					<button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button>
					<button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
				</div>
			</div>
		</div>
		{/if}

		

		

		{#if showForm}
			<div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
				<div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border">
					<button onclick={closeForm} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">
						<X size={20} />
					</button>
					<UserForm user={editingUser} {departments} onSave={saveProfile} {saving} />
				</div>
			</div>
		{/if}
	</div>
