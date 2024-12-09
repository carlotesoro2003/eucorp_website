<script lang="ts">
	import { Edit2 } from "lucide-svelte";

	/** Props */
	let { objectives, searchQuery, onEdit, onViewPlans } = $props();

	/** Filtered objectives */
	const filteredObjectives = $derived(
		objectives.filter((objective) => {
			const searchFields = `${objective.name} ${objective.strategic_initiatives} ${objective.kpi} ${objective.persons_involved}`.toLowerCase();
			return searchFields.includes(searchQuery.toLowerCase());
		})
	);
</script>

{#if objectives.length > 0}
	<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
		<table class="min-w-full table-auto">
			<thead class="bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left">Strategic Objectives</th>
					<th class="px-4 py-3 text-left">Strategic Initiatives</th>
					<th class="px-4 py-3 text-left">KPI</th>
					<th class="px-4 py-3 text-left">Persons Involved</th>
					<th class="px-4 py-3 text-left">Target</th>
					<th class="px-4 py-3 text-left">Evaluation Measures</th>
					<th class="px-4 py-3 text-center">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#each filteredObjectives as objective}
					<tr>
						<td class="px-4 py-3">{objective.name}</td>
						<td class="px-4 py-3">{objective.strategic_initiatives}</td>
						<td class="px-4 py-3">{objective.kpi}</td>
						<td class="px-4 py-3">{objective.persons_involved}</td>
						<td class="px-4 py-3">{objective.target}</td>
						<td class="px-4 py-3">{objective.eval_measures}</td>
						<td class="px-4 py-3">
							<div class="flex justify-center gap-2">
								<button onclick={() => onViewPlans(objective.id)} class="btn btn-primary btn-sm">View Plans</button>
								<button onclick={() => onEdit(objective)} class="btn btn-ghost btn-sm">
									<Edit2 size={18} />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="text-center py-12 bg-card rounded-lg border border-border">
		<p class="text-muted-foreground mb-4">No objectives found.</p>
		<button onclick={() => onEdit(null)} class="btn btn-primary">Add Strategic Objectives</button>
	</div>
{/if}
