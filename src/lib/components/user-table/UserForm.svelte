<script lang="ts">
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

	type Department = {
		id: string;
		name: string;
	};

	let {
		user,
		departments,
		onSave,
		saving,
	}: {
		user: User | null;
		departments: Department[];
		onSave: (data: Partial<User>) => void;
		saving: boolean;
	} = $props();

	// Form data
	let formData: Partial<User> = $state(
		user
			? {
					first_name: user.first_name,
					last_name: user.last_name,
					role: user.role,
					department_id: user.department_id,
				}
			: {
					first_name: "",
					last_name: "",
					role: "",
					department_id: "",
				}
	);

	const rolesWithoutDepartment = ["admin", "vice_president", "president"];

	/** Handle form submit */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		onSave(formData);
	};
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<h3 class="text-lg font-semibold">{user ? "Edit" : "Add"} User</h3>

	<div>
		<label for="first_name" class="block text-sm font-medium mb-1">First Name</label>
		<input id="first_name" type="text" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.first_name} required />
	</div>

	<div>
		<label for="last_name" class="block text-sm font-medium mb-1">Last Name</label>
		<input id="last_name" type="text" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.last_name} required />
	</div>

	<div>
		<label for="role" class="block text-sm font-medium mb-1">Role</label>
		<select id="role" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.role} required>
			<option value="">Select Role</option>
			<option value="admin">Admin</option>
			<option value="user">User</option>
			<option value="vice_president">Vice President</option>
			<option value="president">President</option>
		</select>
	</div>

	{#if formData.role && !rolesWithoutDepartment.includes(formData.role)}
		<div>
			<label for="department" class="block text-sm font-medium mb-1">Department</label>
			<select id="department" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" bind:value={formData.department_id} required>
				<option value="">Select Department</option>
				{#each departments as department}
					<option value={department.id}>{department.name}</option>
				{/each}
			</select>
		</div>
	{/if}

	<div class="flex justify-end gap-2 pt-4">
		<button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50" disabled={saving}>
			{saving ? "Saving..." : "Save"}
		</button>
	</div>
</form>
