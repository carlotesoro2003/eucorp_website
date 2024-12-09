<script lang="ts">
	import { AlertCircle, CheckCircle2, Info } from "lucide-svelte";

	let { message, type }: { message: string; type: string } = $props();

	const getAlertClass = $derived(() => {
		switch (type) {
			case "success":
				return "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
			case "error":
				return "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
			case "warning":
				return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
			default:
				return "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
		}
	});

	const getIcon = $derived(() => {
		switch (type) {
			case "success":
				return CheckCircle2;
			case "error":
			case "warning":
				return AlertCircle;
			default:
				return Info;
		}
	});
</script>

<div class="rounded-lg border p-4 {getAlertClass}">
	<div class="flex items-center gap-3">
		<svelte:component this={getIcon} class="w-5 h-5" />
		<span>{message}</span>
	</div>
</div>
