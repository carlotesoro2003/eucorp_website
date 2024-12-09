import { C as pop, A as push, G as bind_props, L as escape_html } from "../../../chunks/index.js";
/* empty css                       */
import "../../../chunks/client.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { Chart, registerables } from "chart.js";
function AdminDashboard($$payload, $$props) {
  push();
  Chart.register(...registerables);
  $$payload.out += `<div class="min-h-screen p-6 text-gray-100 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="stats shadow"><div class="stat"><div class="stat-title text-gray-400">Total Projects</div> <div class="stat-value text-blue-400">25</div> <div class="stat-desc text-gray-500">+10% this month</div></div></div> <div class="stats shadow"><div class="stat"><div class="stat-title text-gray-400">Completed Tasks</div> <div class="stat-value text-green-400">120</div> <div class="stat-desc text-gray-500">+5% from last week</div></div></div> <div class="stats shadow"><div class="stat"><div class="stat-title text-gray-400">Pending Approvals</div> <div class="stat-value text-yellow-400">8</div> <div class="stat-desc text-gray-500">Needs review</div></div></div> <div class="stats shadow"><div class="stat"><div class="stat-title text-gray-400">New Members</div> <div class="stat-value text-purple-400">15</div> <div class="stat-desc text-gray-500">Joined this month</div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="card shadow-lg bg-gray-800"><div class="card-body"><h2 class="card-title text-gray-200">Overview</h2> <div class="h-64"><canvas id="barChart"></canvas></div></div></div> <div class="card shadow-lg bg-gray-800"><div class="card-body"><h2 class="card-title text-gray-200">Risk Level</h2> <div class="h-64"><canvas id="pieChart"></canvas></div></div></div></div> <div class="card shadow-lg bg-gray-800 mt-6"><div class="card-body"><h2 class="card-title text-gray-200">Recent Events</h2> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center"><span class="loading loading-spinner text-primary"></span> <p>Loading recent events...</p></div>`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  pop();
}
function DepartmentDashboard($$payload, $$props) {
  push();
  Chart.register(...registerables);
  $$payload.out += `<div class="min-h-screen bg-gray-900 p-6 text-gray-100 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="stats shadow bg-gray-800"><div class="stat"><div class="stat-title text-gray-400">Total Projects</div> <div class="stat-value text-blue-400">25</div> <div class="stat-desc text-gray-500">+10% this month</div></div></div> <div class="stats shadow bg-gray-800"><div class="stat"><div class="stat-title text-gray-400">Completed Tasks</div> <div class="stat-value text-green-400">120</div> <div class="stat-desc text-gray-500">+5% from last week</div></div></div> <div class="stats shadow bg-gray-800"><div class="stat"><div class="stat-title text-gray-400">Pending Approvals</div> <div class="stat-value text-yellow-400">8</div> <div class="stat-desc text-gray-500">Needs review</div></div></div> <div class="stats shadow bg-gray-800"><div class="stat"><div class="stat-title text-gray-400">New Members</div> <div class="stat-value text-purple-400">15</div> <div class="stat-desc text-gray-500">Joined this month</div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="card shadow-lg bg-gray-800"><div class="card-body"><h2 class="card-title text-gray-200">Overview</h2> <div class="h-64"><canvas id="barChart"></canvas></div></div></div> <div class="card shadow-lg bg-gray-800"><div class="card-body"><h2 class="card-title text-gray-200">Risk Level</h2> <div class="h-64"><canvas id="pieChart"></canvas></div></div></div></div></div>`;
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
  $$payload.out += `<div class="min-h-screen p-8"><div class="flex flex-col items-center justify-center w-full h-full"><div class="w-full">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center"><span class="loading loading-spinner loading-sm"></span> <p>Loading...</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<h1 class="font-bold text-3xl mb-6">Welcome, ${escape_html(profile.first_name)} ${escape_html(profile.last_name)}</h1> <div class="w-full">`;
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
