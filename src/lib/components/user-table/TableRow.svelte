<script lang="ts">
	import { Pencil, Trash2 } from "lucide-svelte";

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
		onEdit,
		onDelete,
		onApprove,
		approvingUserId,
		deletingUserId,
	}: {
		user: User;
		departments: Department[];
		onEdit: (user: User) => void;
		onDelete: (id: string) => void;
		onApprove: (id: string) => void;
		approvingUserId: string | null;
		deletingUserId: string | null;
	} = $props();
</script>

<tr class="hover:bg-muted/50">
	<td class="px-4 py-2">
		{#if user.profile_pic}
			<img src={user.profile_pic} alt="Profile" class="w-10 h-10 rounded-full object-cover" />
		{:else}
			<div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
				{user.first_name[0]}{user.last_name[0]}
			</div>
		{/if}
	</td>
	<td class="px-4 py-2">{user.first_name} {user.last_name}</td>
	<td class="px-4 py-2 hidden md:table-cell">{user.email}</td>
	<td class="px-4 py-2 hidden sm:table-cell">{user.role}</td>
	<td class="px-4 py-2">{user.department_name || "N/A"}</td>
	<td class="px-4 py-2">
		{#if user.is_verified}
			<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span>
		{:else}
			<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Not Verified</span>
		{/if}
	</td>
	<td class="px-4 py-2">
		<div class="flex items-center gap-2">
			<button onclick={() => onEdit(user)} class="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit user">
				<Pencil size={16} />
			</button>
			{#if !user.is_verified}
				<button class="p-1 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50" onclick={() => onApprove(user.id)} disabled={approvingUserId === user.id}>
					{approvingUserId === user.id ? "Approving..." : "Approve"}
				</button>
			{/if}
			<button onclick={() => onDelete(user.id)} class="p-1 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-600 disabled:opacity-50" title="Delete user" disabled={deletingUserId === user.id}>
				<Trash2 size={16} />
			</button>
		</div>
	</td>
</tr>
