<script lang="ts">
	import { AlertCircle, CheckCircle } from "lucide-svelte";

	let { type, message }: { type: "success" | "error"; message: string } = $props();

	const styles = {
		success: "bg-green-500/10 text-green-500 border-green-500/20",
		error: "bg-destructive/10 text-destructive border-destructive/20",
	};
</script>

<div class="flex items-center gap-2 p-4 rounded-lg border {styles[type]}">
	{#if type === "success"}
		<CheckCircle class="w-5 h-5" />
	{:else}
		<AlertCircle class="w-5 h-5" />
	{/if}
	<span>{message}</span>
</div>
