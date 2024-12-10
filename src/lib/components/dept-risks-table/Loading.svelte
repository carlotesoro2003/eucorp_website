<script lang="ts">
	import { Loader2 } from "lucide-svelte";
</script>

<div class="flex items-center justify-center p-8">
	<div class="flex flex-col items-center gap-2">
		<Loader2 class="w-8 h-8 animate-spin text-blue-600" />
		<p class="text-gray-600">Loading risks...</p>
	</div>
</div>
