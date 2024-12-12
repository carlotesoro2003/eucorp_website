<script lang="ts">
	import { ArrowUpDown, Eye } from "lucide-svelte";
	import { goto } from "$app/navigation";


	/** Props */
	let {
		items,
		sortField,
		sortDirection,
		toggleSort,
		selectedGoal,
	}: {
		items: Array<any>;
		sortField: string;
		sortDirection: string;
		toggleSort: (field: string) => void;
		selectedGoal: { goal_no: number; name: string } | undefined;
	} = $props();

	/** Navigate to operational plans */
	const viewObjective = (objectiveId: number) => {
		goto(`/plans/operationalPlans/${objectiveId}`);
	};
</script>

<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
	{#if selectedGoal}
		<div class="p-4 border-b border-border">
			<h3 class="font-semibold">Strategic Goal No {selectedGoal.goal_no}</h3>
			<p class="text-sm text-muted-foreground">{selectedGoal.name}</p>
		</div>
	{/if}

	<table class="min-w-full table-auto">
		<thead class="bg-muted/50">
			<tr>
				<th class="px-4 py-3 text-left">
					<button onclick={() => toggleSort("name")} class="flex items-center gap-1 hover:text-primary">
						Objective
						<ArrowUpDown size={16} class={sortField === "name" ? "text-primary" : ""} />
					</button>
				</th>
				<th class="px-4 py-3 text-left hidden md:table-cell">Strategic Initiatives</th>
				<th class="px-4 py-3 text-left">
					<button onclick={() => toggleSort("kpi")} class="flex items-center gap-1 hover:text-primary">
						KPI
						<ArrowUpDown size={16} class={sortField === "kpi" ? "text-primary" : ""} />
					</button>
				</th>
				<th class="px-4 py-3 text-left hidden lg:table-cell">Persons Involved</th>
				<th class="px-4 py-3 text-left">
					<button onclick={() => toggleSort("target")} class="flex items-center gap-1 hover:text-primary">
						Target
						<ArrowUpDown size={16} class={sortField === "target" ? "text-primary" : ""} />
					</button>
				</th>
				<th class="px-4 py-3 text-left hidden xl:table-cell">Evaluation Measures</th>
				<th class="px-4 py-3 text-left w-[120px]">Action</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-border">
			{#each items as objective}
				<tr class="hover:bg-muted/50">
					<td class="px-4 py-3">{objective.name}</td>
					<td class="px-4 py-3 hidden md:table-cell">{objective.strategic_initiatives}</td>
					<td class="px-4 py-3">{objective.kpi}</td>
					<td class="px-4 py-3 hidden lg:table-cell">{objective.persons_involved}</td>
					<td class="px-4 py-3">{objective.target}</td>
					<td class="px-4 py-3 hidden xl:table-cell">{objective.eval_measures}</td>
					<td class="px-4 py-3">
                       
						<button onclick={() => viewObjective(objective.id)} class="btn btn-ghost btn-sm text-blue-500" title="View Action Plans"><Eye size={18}/></button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
