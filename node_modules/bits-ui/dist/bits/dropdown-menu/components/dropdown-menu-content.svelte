<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DropdownMenuContentProps } from "../types.js";
	import { useMenuContent } from "../../menu/menu.svelte.js";
	import { useId } from "../../../internal/use-id.js";
	import { noop } from "../../../internal/noop.js";
	import PopperLayer from "../../utilities/popper-layer/popper-layer.svelte";
	import Mounted from "../../utilities/mounted.svelte";
	import { getFloatingContentCSSVars } from "../../../internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "../../utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: DropdownMenuContentProps = $props();

	let isMounted = $state(false);

	const contentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		isMounted: box.with(() => isMounted),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		contentState.handleInteractOutside(e);
		if (e.defaultPrevented) return;
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}
	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		enabled={contentState.parentMenu.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		trapFocus
		{loop}
		forceMount={true}
		{id}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("dropdown-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
			<Mounted bind:isMounted />
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		present={contentState.parentMenu.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		trapFocus
		{loop}
		forceMount={false}
		{id}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("dropdown-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
			<Mounted bind:isMounted />
		{/snippet}
	</PopperLayer>
{/if}
