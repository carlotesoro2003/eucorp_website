<script lang="ts">
	import type { ActionPlan } from "$lib/types/ActionPlan";
	import { FileText } from "lucide-svelte";

	const { plans, openDialog, evaluateActionPlan } = $props<{
		plans: ActionPlan[];
		openDialog: (statement: string) => void;
		evaluateActionPlan: (id: number, kpi: string, evaluation: string) => void;
	}>();

	/** Auto resize textarea on input */
	const autoResize = (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};
</script>

<div class="bg-white shadow rounded-lg overflow-hidden">
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strategic Goal</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objective</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KPI</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evaluation</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each plans as plan}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.strategic_goal_name}</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.objective_name}</td>
						<td class="px-6 py-4 text-sm text-gray-900">{plan.actions_taken}</td>
						<td class="px-6 py-4 text-sm text-gray-900">{plan.kpi}</td>
						<td class="px-6 py-4">
							<textarea
								class="w-full px-3 py-2 text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
								rows="2"
								placeholder="Enter evaluation..."
								value={plan.evaluation}
								oninput={(e) => {
									if (e.target) {
										plan.evaluation = (e.target as HTMLTextAreaElement).value;
									}
									autoResize(e);
								}}
								disabled={plan.is_accomplished}
							></textarea>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.is_accomplished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
								{plan.is_accomplished ? `Achieved ${plan.time_completed ? new Date(plan.time_completed).toLocaleDateString() : ""}` : "Pending"}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							<div class="flex space-x-2">
								{#if plan.statement}
									<button onclick={() => openDialog(plan.statement || "")} class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
										<FileText class="w-4 h-4 mr-1" />
										View
									</button>
								{/if}

								{#if !plan.is_accomplished}
									<button onclick={() => evaluateActionPlan(plan.id, plan.kpi, plan.evaluation || "")} class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50" disabled={!plan.evaluation || plan.isLoading}>
										{#if plan.isLoading}
											<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
										{/if}
										Evaluate
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
