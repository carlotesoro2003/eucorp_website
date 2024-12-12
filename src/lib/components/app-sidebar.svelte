<script lang="ts">
  import NavMain from "$lib/components/nav-main.svelte";
  import NavUser from "$lib/components/nav-user.svelte";
  import TeamSwitcher from "$lib/components/team-switcher.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { derived } from "svelte/store";
  import { userStore } from "$lib/stores/userStore";

  import AudioWaveform from "lucide-svelte/icons/audio-waveform";
  import GalleryVerticalEnd from "lucide-svelte/icons/gallery-vertical-end";
  import Bot from "lucide-svelte/icons/bot";
  import ChartPie from "lucide-svelte/icons/chart-pie";
  import ChartArea from "lucide-svelte/icons/chart-area";
  import SquareTerminal from "lucide-svelte/icons/square-terminal";

  const adminData = {
    user: {
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/avatars/admin.jpg",
    },
    teams: [
      {
        name: "Eucorp",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "User Management",
        url: "/users",
        icon: Bot,
        items: [
          { title: "Users", url: "/users" },
          
          { title: "Departments", url: "/departments" },
          { title: "Leads", url: "/leads" },
          { title: "Classifications", url: "/classification" },
          { title: "Ratings Management", url: "/riskManagement" },
          {title:"School Years", url: "/school-year"}
        ],
      },
      {
        title: "Planning",
        url: "/plans",
        icon: ChartPie,
        items: [
          { title: "Strategic Goals", url: "/plans" },
          { title: "Risks", url: "/risks" },
          { title: "Opportunities", url: "/opportunities" },
        ],
      },
      {
        title: "Monitoring",
        url: "/monitoring/mid-year",
        icon: ChartArea,
        items: [
          { title: "Mid-Year Monitoring ", url: "/monitoring/mid-year" },
          { title: "Year-End Monitoring", url: "/monitoring/year-end" },
        ],
      },
    ],
  };

  const userData = {
    user: {
      name: "Regular User",
      email: "user@example.com",
      avatar: "/avatars/user.jpg",
    },
    teams: [
      {
        name: "Eucorp",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Planning",
        url: "/plans/operationalPlans",
        icon: ChartPie,
        items: [
          { title: "Operational Planning", url: "/plans/operationalPlans" },
          { title: "Risks Register", url: "/risks" },
          { title: "Opportunities Register", url: "/opportunities" },
        ],
      },
      {
        title: "Monitoring",
        url: "/monitoring/mid-year",
        icon: ChartArea,
        items: [
          { title: "Mid-Year Monitoring ", url: "/monitoring/mid-year" },
          { title: "Year-End Monitoring", url: "/monitoring/year-end" },
        ],
      },
    ],
  };

  // Derive sidebar data dynamically
  const sidebarData = derived(userStore, ($userStore) =>
    $userStore.userRole === "admin" ||
    $userStore.userRole === "vice_president" ||
    $userStore.userRole === "president"
      ? adminData
      : userData
  );

  let {
    ref = $bindable(null),
    collapsible = "icon" as "none" | "icon" | "offcanvas" | undefined,
    variant = "floating" as "floating" | "sidebar" | "inset" | undefined,
    ...restProps
  } = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {variant} {...restProps}>
  <Sidebar.Header>
    <TeamSwitcher teams={$sidebarData.teams} />
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={$sidebarData.navMain} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser user={$userStore} />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
