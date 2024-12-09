<script lang="ts">
	import { Pencil, Trash2 } from "lucide-svelte";

	type Opportunity = {
		id: number;
		opt_statement: string;
		planned_actions: string;
		kpi: string;
		key_persons: string;
		target_output: string;
		budget: number;
		is_approved: boolean;
		is_approved_vp: boolean;
		is_approved_president: boolean;
		department_name: string | null;
	};

	let {
		opportunity,
		userRole,
		onEdit,
		onDelete,
		onApprove,
		approvingId,
		deletingId,
	}: {
		opportunity: Opportunity;
		userRole: string | null;
		onEdit: (opportunity: Opportunity) => void;
		onDelete: (id: number) => void;
		onApprove: (id: number) => void;
		approvingId: number | null;
		deletingId: number | null;
	} = $props();
</script>

<tr class="hover:bg-muted/50">
	<td class="px-4 py-3">{opportunity.opt_statement}</td>
	<td class="px-4 py-3">{opportunity.planned_actions}</td>
	<td class="px-4 py-3">{opportunity.kpi}</td>
	<td class="px-4 py-3">{opportunity.key_persons}</td>
	<td class="px-4 py-3">{opportunity.target_output}</td>
	<td class="px-4 py-3">P{opportunity.budget.toFixed(2)}</td>
	<td class="px-4 py-3">{opportunity.department_name}</td>
	<td class="px-4 py-3">
		<div class="flex items-center gap-2">
			<button onclick={() => onApprove(opportunity.id)} disabled={approvingId === opportunity.id || (userRole === "admin" && opportunity.is_approved) || (userRole === "vice_president" && (!opportunity.is_approved || opportunity.is_approved_vp)) || (userRole === "president" && (!opportunity.is_approved_vp || opportunity.is_approved_president))} class="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50">
				{approvingId === opportunity.id ? "Processing..." : userRole === "admin" ? (opportunity.is_approved ? "Admin Approved" : "Approve") : userRole === "vice_president" ? (opportunity.is_approved_vp ? "VP Approved" : "Approve") : userRole === "president" ? (opportunity.is_approved_president ? "President Approved" : "Approve") : "Approve"}
			</button>
			<button onclick={() => onEdit(opportunity)} class="p-1 rounded hover:bg-muted">
				<Pencil size={16} />
			</button>
			<button onclick={() => onDelete(opportunity.id)} disabled={deletingId === opportunity.id} class="p-1 rounded hover:bg-muted text-red-500 hover:text-red-600 disabled:opacity-50">
				<Trash2 size={16} />
			</button>
		</div>
	</td>
</tr>
