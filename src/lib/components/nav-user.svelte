<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { useSidebar } from "$lib/components/ui/sidebar/index.js";
	import type { User } from "$lib/types/User";
	import { userStore } from "$lib/stores/userStore";
	import { supabase } from "$lib/supabaseClient";
	import BadgeCheck from "lucide-svelte/icons/badge-check";
	import Bell from "lucide-svelte/icons/bell";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import LogOut from "lucide-svelte/icons/log-out";
	import { goto } from "$app/navigation";
	import Settings from "lucide-svelte/icons/settings";
  
	export let user: User; // Receive user as a prop
  
	const sidebar = useSidebar();
	let isLoading = false;
  
	// Navigation to profile
	const navigateToProfile = () => {
	  goto('/profile');
	};
  
	// Logout function
	async function logout() {
	  try {
		isLoading = true; // Indicate loading state
		const { error } = await supabase.auth.signOut(); // Attempt to log out
  
		if (error) {
		  console.error("Error logging out:", error.message);
		  return; // Exit the function if an error occurs
		}
  
		// Reset the user state
		userStore.set({
		  session: null,
		  isVerified: false,
		  userRole: null,
		  departmentName: "",
		  profilePic: null,
		  email: null,
		  firstName: "New",
		  lastName: "User",
		});
  
		// Navigate to login page after successful logout
		await goto("/");
	  } catch (err) {
		console.error("Unexpected error during logout:", err);
	  } finally {
		isLoading = false; // Ensure loading state is reset
	  }
	}
  </script>
  
  <Sidebar.Menu>
	<Sidebar.MenuItem>
	  <DropdownMenu.Root>
		<DropdownMenu.Trigger>
		  {#snippet child({ props })}
			<Sidebar.MenuButton
			  size="lg"
			  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			  {...props}
			>
			  <Avatar.Root class="h-8 w-8 rounded-lg">
				<Avatar.Image src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
				<Avatar.Fallback class="rounded-lg">
				  {user.firstName?.charAt(0)}{user.lastName?.charAt(0) || 'U'}
				</Avatar.Fallback>
			  </Avatar.Root>
			  <div class="grid flex-1 text-left text-sm leading-tight">
				<span class="truncate font-semibold">{user.firstName} {user.lastName}</span>
				<!-- Display role or department -->
				<span class="truncate text-xs">
				  {#if user.userRole === "admin"}
					Admin
				  {:else if user.userRole === "vice_president"}
					Vice President
				  {:else if user.userRole === "president"}
					President
				  {:else}
					{user.departmentName || "Unknown"}
				  {/if}
				</span>
			  </div>
			  <ChevronsUpDown class="ml-auto size-4" />
			</Sidebar.MenuButton>
		  {/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
		  class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
		  side={sidebar.isMobile ? "bottom" : "right"}
		  align="end"
		  sideOffset={4}
		>
		  <DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
			  <Avatar.Root class="h-8 w-8 rounded-lg">
				<Avatar.Image src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
				<Avatar.Fallback class="rounded-lg">
				  {user.firstName?.charAt(0)}{user.lastName?.charAt(0) || 'U'}
				</Avatar.Fallback>
			  </Avatar.Root>
			  <div class="grid flex-1 text-left text-sm leading-tight">
				<span class="truncate font-semibold">{user.firstName} {user.lastName}</span>
				<span class="truncate text-xs">
				  {#if user.userRole === "admin"}
					Admin
				  {:else if user.userRole === "vice_president"}
					Vice President
				  {:else if user.userRole === "president"}
					President
				  {:else}
					{user.departmentName || "Unknown"}
				  {/if}
				</span>
			  </div>
			</div>
		  </DropdownMenu.Label>
		  <DropdownMenu.Separator />
		  <DropdownMenu.Group>
			<DropdownMenu.Item onclick={navigateToProfile}>
			  <BadgeCheck />
			  Account
			</DropdownMenu.Item>
			<!-- <DropdownMenu.Item>
			  <Settings />
			  Settings
			</DropdownMenu.Item> -->
		  </DropdownMenu.Group>
		  <DropdownMenu.Separator />
		  <DropdownMenu.Item onclick={logout}>
			<LogOut />
			Log out
		  </DropdownMenu.Item>
		</DropdownMenu.Content>
	  </DropdownMenu.Root>
	</Sidebar.MenuItem>
  </Sidebar.Menu>
  