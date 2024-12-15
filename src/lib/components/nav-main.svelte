<script lang="ts">
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import ChevronRight from "lucide-svelte/icons/chevron-right";

	let {
		items,
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			items?: {

				title: string;
				url: string;
			}[];
		}[];
	} = $props();

	let highlightedItem: any = $state(items[0]);
	let highlightedSubItem: any = $state(null);
	$inspect(highlightedItem)

</script>

<Sidebar.Group>
	<!-- <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel> -->
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props}
								onclick={() => {
									highlightedItem = mainItem,
									highlightedSubItem = mainItem.items?.length ? mainItem.items[0] : null;
									}}
								isActive={highlightedItem.title === mainItem.title}
								>
									{#snippet tooltipContent()}
										{mainItem.title}
									{/snippet}
									{#snippet child({props})}
										<a href={mainItem.url} {...props}>
											<mainItem.icon class="w-6 h-6" />
											<span>{mainItem.title}</span>
											{#if mainItem.title !== 'Dashboard'}
											<ChevronRight
												class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
											{/if}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>
						<Collapsible.Content>
							{#if mainItem.items}
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton  onclick={() => {
												highlightedItem = mainItem; 
												highlightedSubItem = subItem; 
											}}
											isActive={highlightedSubItem?.title === subItem.title}>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>


<!---->
<!--<script lang="ts">
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import ChevronRight from "lucide-svelte/icons/chevron-right";

	let {
		items,
	}: {
		items: {
			title: string;
			url: string;
			// this should be Component after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();
	let highlightedItem: any = $state(items[0]);
	let highlightedSubItem: any = $state(null);
	$inspect(highlightedItem)
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props}
									onclick={() => highlightedItem = mainItem}
									isActive={highlightedItem.title === mainItem.title}
									class="px-2.5 md:px-2"
								>
								
									{#snippet tooltipContent()}
										{mainItem.title}
									{/snippet}
									{#if mainItem.icon}
										<mainItem.icon />
									{/if}
									<span>{mainItem.title}</span>
									{#if mainItem.title !== "Dashboard"}
										<ChevronRight
											class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									{/if}
									
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>
						<Collapsible.Content>
							{#if mainItem.items}
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton onclick={() => {
												highlightedItem = mainItem; 
												highlightedSubItem = subItem; 
											}}
											isActive={highlightedSubItem?.title === subItem.title}
											>

												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>-->