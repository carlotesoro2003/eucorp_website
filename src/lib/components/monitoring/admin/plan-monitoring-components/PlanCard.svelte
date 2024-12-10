<script lang="ts">
	import { CheckCircle, XCircle, Eye } from "lucide-svelte";
	import type { ActionPlan } from "$lib/types/ActionPlan";

	const { plan, evaluateActionPlan, openDialog, onEvaluationChange } = $props();

	/** Auto resize textarea */
	const autoResize = (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};
</script>

<div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
	<div class="p-6">
		<div class="flex justify-between items-start mb-4">
			<div>
				<h3 class="text-lg font-medium text-gray-900">{plan.strategic_goal_name}</h3>
				<p class="text-sm text-gray-600">{plan.objective_name}</p>
			</div>
			<span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${plan.is_accomplished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
				{#if plan.is_accomplished}
					<CheckCircle class="w-4 h-4 mr-1" />
					Achieved
				{:else}
					<XCircle class="w-4 h-4 mr-1" />
					Pending
				{/if}
			</span>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Actions Taken</label>
				<p class="text-sm text-gray-600">{plan.actions_taken}</p>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">KPI</label>
				<p class="text-sm text-gray-600">{plan.kpi}</p>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Evaluation</label>
				<textarea
					class="w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Enter evaluation..."
					value={plan.evaluation}
					oninput={(e) => {
						onEvaluationChange((e.target as HTMLTextAreaElement).value);
						autoResize(e);
					}}
					disabled={plan.is_accomplished}
					rows="3"
				></textarea>
			</div>

			<div class="flex items-center justify-end gap-2 pt-4">
				{#if plan.statement}
					<button onclick={() => openDialog(plan.statement || "")} class="inline-flex items-center px-3 py-1 text-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md">
						<Eye class="w-4 h-4 mr-1" />
						View Statement
					</button>
				{/if}

				{#if plan.isLoading}
					<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
				{:else if !plan.is_accomplished}
					<button onclick={() => evaluateActionPlan(plan.id, plan.kpi, plan.evaluation || "")} class="inline-flex items-center px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50" disabled={!plan.evaluation || plan.isLoading}>Evaluate</button>
				{/if}
			</div>
		</div>
	</div>
</div>
