<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { AlertDialogRootProps } from "../types.js";
	import { noop } from "../../../internal/noop.js";
	import { useDialogRoot } from "../../dialog/dialog.svelte.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: AlertDialogRootProps = $props();

	useDialogRoot({
		variant: box.with(() => "alert-dialog"),
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange(v);
				}
			}
		),
	});
</script>

{@render children?.()}
