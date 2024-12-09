<script lang="ts">
	import { Trash2 } from "lucide-svelte";
    import type { ActionPlan } from "$lib/types/ActionPlan";

	let { actionPlans, deleteRow }: { actionPlans: ActionPlan[]; deleteRow: (index: number) => void } = $props();

	/** Update field value */
	const updateField = (index: number, field: keyof ActionPlan, value: string) => {
		actionPlans[index][field] = value;
	};

	/** Auto adjust textarea height */
	const autoAdjustTextarea = (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};
</script>

<div class="overflow-x-auto">
	<table class="w-full border-collapse">
		<thead>
			<tr class="border-b bg-gray-50">
				<th class="p-4 text-left text-sm font-medium text-gray-500">Actions Taken</th>
				<th class="p-4 text-left text-sm font-medium text-gray-500">KPI</th>
				<th class="p-4 text-left text-sm font-medium text-gray-500">Target Output</th>
				<th class="p-4 text-left text-sm font-medium text-gray-500">Key Person Responsible</th>
				<th class="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each actionPlans as plan, index}
				<tr class="border-b hover:bg-gray-50">
					{#each ["actions_taken", "kpi", "target_output", "key_person_responsible"] as field}
						<td class="p-4">
							<textarea
								class="w-full min-h-[40px] px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
								value={plan[field]}
								oninput={(e) => {
									autoAdjustTextarea(e);
									updateField(index, field, (e.target as HTMLInputElement).value);
								}}
								placeholder={field
									.split("_")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ")}
							></textarea>
						</td>
					{/each}
					<td class="p-4">
						<button onclick={() => deleteRow(index)} class="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full">
							<Trash2 class="w-5 h-5" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
