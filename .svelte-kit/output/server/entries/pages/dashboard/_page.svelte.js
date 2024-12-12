import { Q as ensure_array_like, L as escape_html, C as pop, A as push, G as bind_props } from "../../../chunks/index.js";
/* empty css                       */
import "../../../chunks/client.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import "chart.js/auto";
const dashboardData = {
  cards: [
    {
      title: "Strategic Goals",
      value: "0",
      // Placeholder for dynamic value
      change: 12.5,
      icon: "🎯"
    },
    {
      title: "Unmitigated Risks",
      value: "0",
      // Placeholder for dynamic value
      change: -2.4,
      icon: "⚠️"
    },
    {
      title: "Opportunities",
      value: "0",
      // Placeholder for dynamic value
      change: 8.2,
      icon: "💡"
    },
    {
      title: "Users",
      value: "0",
      // Placeholder for dynamic value
      change: 5.1,
      icon: "👥"
    }
  ],
  barChart: {
    goals: [
      "Strategic Goal 1",
      "Strategic Goal 2",
      "Strategic Goal 3",
      "Strategic Goal 4",
      "Strategic Goal 5"
    ],
    achieved: [75, 60, 85, 45, 65],
    notAchieved: [25, 40, 15, 55, 35]
  },
  riskData: {
    categories: ["Manpower", "Financial", "Technical", "Operational"],
    // Ensure this exists
    datasets: {
      manpower: [30, 50, 20],
      financial: [45, 35, 20],
      technical: [25, 45, 30],
      operational: [35, 40, 25]
    }
  },
  recentEvents: [
    {
      title: "New project milestone achieved",
      time: "2 hours ago",
      type: "success"
    },
    {
      title: "System maintenance scheduled",
      time: "5 hours ago",
      type: "warning"
    },
    {
      title: "Server capacity reached 90%",
      time: "8 hours ago",
      type: "error"
    },
    {
      title: "New team member onboarded",
      time: "1 day ago",
      type: "success"
    }
  ]
};
function DashboardCards($$payload, $$props) {
  push();
  let cards = dashboardData.cards;
  const each_array = ensure_array_like(cards);
  $$payload.out += `<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let card = each_array[$$index];
    $$payload.out += `<div class="group relative overflow-hidden rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-500">${escape_html(card.title)}</p> <p class="mt-2 text-3xl font-bold text-gray-900">${escape_html(card.value)}</p></div> <div class="rounded-xl bg-blue-50 p-4 text-2xl text-blue-600 transition-transform duration-300 group-hover:rotate-12">${escape_html(card.icon)}</div></div> <div class="mt-4"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function BarChart($$payload, $$props) {
  push();
  $$payload.out += `<div class="relative h-[400px] w-full"><canvas></canvas></div>`;
  pop();
}
function RiskAnalysis($$payload, $$props) {
  push();
  $$payload.out += `<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"><h2 class="mb-6 text-xl font-semibold text-gray-800">Risk Analysis</h2> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center"><span class="loading loading-spinner text-primary"></span> <p>Loading risk data...</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function RecentEvents($$payload, $$props) {
  push();
  $$payload.out += `<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"><h2 class="mb-6 text-xl font-semibold text-gray-800">Recent Events</h2> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center"><span class="loading loading-spinner text-primary"></span> <p>Loading recent events...</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function Header($$payload, $$props) {
  push();
  const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  let currentSchoolYear = null;
  async function fetchCurrentSchoolYear() {
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const { data, error } = await supabase.from("school_years").select("school_year").lte("start_date", today).gte("end_date", today).single();
      if (error) {
        console.error("Error fetching school year:", error);
        currentSchoolYear = "Unknown";
      } else {
        currentSchoolYear = data?.school_year || "Unknown";
      }
    } catch (err) {
      console.error("Unexpected error fetching school year:", err);
      currentSchoolYear = "Unknown";
    }
  }
  fetchCurrentSchoolYear();
  $$payload.out += `<header class="flex flex-col gap-4 rounded-xle p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold">Welcome</h1> <p class="mt-1 text-sm">${escape_html(currentDate)}</p> <p class="mt-1 text-sm">Current School Year: ${escape_html(currentSchoolYear || "Loading...")}</p></div></header>`;
  pop();
}
function AdminDashboard($$payload, $$props) {
  push();
  $$payload.out += `<main class="min-h-screen p-4 md:p-6 container mx-auto"><div class="mx-auto max-w-7xl space-y-8">`;
  Header($$payload);
  $$payload.out += `<!----> `;
  DashboardCards($$payload);
  $$payload.out += `<!----> <div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"><h2 class="mb-6 text-xl font-semibold text-gray-800">Strategic Goal Overiew</h2> `;
  BarChart($$payload);
  $$payload.out += `<!----></div> <div class="grid gap-8 lg:grid-cols-2">`;
  RiskAnalysis($$payload);
  $$payload.out += `<!----> `;
  RecentEvents($$payload);
  $$payload.out += `<!----></div></div></main>`;
  pop();
}
function DepartmentDashboard($$payload, $$props) {
  push();
  $$payload.out += `<main class="min-h-screen p-4 md:p-6 container mx-auto"><div class="mx-auto max-w-7xl space-y-8">`;
  Header($$payload);
  $$payload.out += `<!----> `;
  DashboardCards($$payload);
  $$payload.out += `<!----> <div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"><h2 class="mb-6 text-xl font-semibold text-gray-800">Strategic Goal Overiew</h2> `;
  BarChart($$payload);
  $$payload.out += `<!----></div> <div class="grid gap-8 lg:grid-cols-2">`;
  RiskAnalysis($$payload);
  $$payload.out += `<!----> `;
  RecentEvents($$payload);
  $$payload.out += `<!----></div></div></main>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const { session } = data;
  let profile = null;
  let loading = true;
  const fetchUserProfile = async () => {
    if (session) {
      const { user } = session;
      const { data: data2, error } = await supabase.from("profiles").select("first_name, last_name, role, profile_pic").eq("id", user.id).single();
      if (error) {
        console.error("Error fetching user profile:", error.message);
      } else {
        profile = data2;
      }
    }
    loading = false;
  };
  fetchUserProfile();
  $$payload.out += `<div class="min-h-screen"><div class="flex flex-col items-center justify-center w-full h-full"><div class="w-full">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="w-full">`;
      if (profile.role === "admin" || profile.role === "vice_president" || profile.role === "president") {
        $$payload.out += "<!--[-->";
        AdminDashboard($$payload);
      } else {
        $$payload.out += "<!--[!-->";
        if (profile.role === "user") {
          $$payload.out += "<!--[-->";
          DepartmentDashboard($$payload);
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
