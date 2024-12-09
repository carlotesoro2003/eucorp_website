<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ContextMenuContentProps } from "../types.js";
	import { CONTEXT_MENU_TRIGGER_ATTR, useMenuContent } from "../../menu/menu.svelte.js";
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
		preventScroll = true,
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContextMenuContentProps = $props();

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
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function isValidEvent(e: PointerEvent) {
		if ("button" in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger =
				target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !==
				contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		isStatic
		side="right"
		sideOffset={2}
		align="start"
		enabled={contentState.parentMenu.open.current}
		{preventScroll}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{isValidEvent}
		trapFocus
		{loop}
		{forceMount}
		{id}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("context-menu"),
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
		isStatic
		side="right"
		sideOffset={2}
		align="start"
		present={contentState.parentMenu.open.current}
		{preventScroll}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{isValidEvent}
		trapFocus
		{loop}
		forceMount={false}
		{id}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("context-menu"),
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
