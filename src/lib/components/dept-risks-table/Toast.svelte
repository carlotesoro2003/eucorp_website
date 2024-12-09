<script lang="ts">
	import { CheckCircle2, XCircle } from "lucide-svelte";

	let { message, type }: { message: string; type: "success" | "error" } = $props();

	const bgColor = $derived(type === "success" ? "bg-green-50" : "bg-red-50");
	const textColor = $derived(type === "success" ? "text-green-800" : "text-red-800");
	const borderColor = $derived(type === "success" ? "border-green-200" : "border-red-200");
</script>

<div class="fixed bottom-4 right-4 z-50 animate-fade-in">
	<div class={`${bgColor} ${textColor} ${borderColor} flex items-center gap-2 px-4 py-3 border rounded-lg shadow-lg`}>
		{#if type === "success"}
			<CheckCircle2 class="w-5 h-5 text-green-500" />
		{:else}
			<XCircle class="w-5 h-5 text-red-500" />
		{/if}
		<p class="font-medium">{message}</p>
	</div>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fadeIn 0.3s ease-out;
	}
</style>
