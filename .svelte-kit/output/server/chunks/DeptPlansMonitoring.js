import { P as spread_props, Q as slot, R as sanitize_props, L as escape_html, F as attr, C as pop, A as push, N as ensure_array_like, O as stringify, G as bind_props, S as copy_payload, T as assign_payload } from "./index.js";
import { I as Icon } from "./Icon.js";
import { s as supabase } from "./supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
import { D as Download } from "./download.js";
import { C as Chevron_right } from "./chevron-right.js";
/* empty css         */
function Chevron_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-left" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Circle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12.01",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Clipboard_list($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "8",
        "height": "4",
        "x": "8",
        "y": "2",
        "rx": "1",
        "ry": "1"
      }
    ],
    [
      "path",
      {
        "d": "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
      }
    ],
    ["path", { "d": "M12 11h4" }],
    ["path", { "d": "M12 16h4" }],
    ["path", { "d": "M8 11h.01" }],
    ["path", { "d": "M8 16h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "clipboard-list" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function File_text($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "M10 9H8" }],
    ["path", { "d": "M16 13H8" }],
    ["path", { "d": "M16 17H8" }]
  ];
  Icon($$payload, spread_props([
    { name: "file-text" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Lightbulb($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
      }
    ],
    ["path", { "d": "M9 18h6" }],
    ["path", { "d": "M10 22h4" }]
  ];
  Icon($$payload, spread_props([
    { name: "lightbulb" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Loader_circle($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M21 12a9 9 0 1 1-6.219-8.56" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "loader-circle" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Triangle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "triangle-alert" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function AdminPlansMonitoring($$payload, $$props) {
  push();
  let plans = [];
  let filteredPlans = [];
  let filterStatus = "all";
  let isLoading = true;
  let isGeneratingSummary = false;
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  let paginatedPlans = filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const statusOptions = [
    {
      value: "all",
      label: "All Status",
      color: "bg-blue-600"
    },
    {
      value: "achieved",
      label: "Achieved",
      color: "bg-green-600"
    },
    {
      value: "not_achieved",
      label: "Not Achieved",
      color: "bg-red-600"
    }
  ];
  const getStatusLabel = (value) => {
    return statusOptions.find((opt) => opt.value === value)?.label || "All Status";
  };
  const fetchPlanMonitoring = async () => {
    isLoading = true;
    try {
      const { data, error } = await supabase.from("plan_monitoring").select(`
                id,
                action_plan_id,
                evaluation,
                statement,
                is_accomplished,
                time_completed,
                action_plans (actions_taken, kpi)
            `);
      if (error) throw error;
      plans = data.map((plan) => ({
        id: plan.id,
        action_plan_id: plan.action_plan_id,
        evaluation: plan.evaluation,
        statement: plan.statement,
        is_accomplished: plan.is_accomplished,
        time_completed: plan.time_completed,
        actions_taken: plan.action_plans?.actions_taken || "No Actions Taken",
        kpi: plan.action_plans?.kpi || "No KPI"
      }));
      applyFilter();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  };
  const applyFilter = () => {
    let filtered = plans;
    filteredPlans = filtered;
    currentPage = 1;
  };
  fetchPlanMonitoring();
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8"><div class="max-w-7xl mx-auto"><h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Plans Monitoring</h1> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"><div class="flex flex-wrap gap-2 items-center"><div class="relative"><button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">${escape_html(getStatusLabel(filterStatus))} `;
  Chevron_down($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <input type="text"${attr("value", searchQuery)} placeholder="Search plans..." class="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"></div> <div class="flex gap-2 justify-end"><button class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2">`;
  Download($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----> Export PDF</button> <button class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"${attr("disabled", isGeneratingSummary, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    File_text($$payload, { class: "w-4 h-4" });
  }
  $$payload.out += `<!--]--> Generate Report</button></div></div> <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">`;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center p-8">`;
    Loader_circle($$payload, {
      class: "w-6 h-6 animate-spin text-blue-600 dark:text-blue-400"
    });
    $$payload.out += `<!----> <span class="ml-2 text-gray-600 dark:text-gray-400">Loading plans...</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (filteredPlans.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(paginatedPlans);
      $$payload.out += `<div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"><th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action Plans</th><th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">KPI</th><th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions Taken to Achieve Action Plan</th><th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statement</th><th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th><th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let plan = each_array_1[$$index_1];
        $$payload.out += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">${escape_html(plan.actions_taken)}</td><td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">${escape_html(plan.kpi)}</td><td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">${escape_html(plan.evaluation || "Pending")}</td><td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">${escape_html(plan.statement || "Pending")}</td><td class="px-6 py-4"><span${attr("class", `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(plan.is_accomplished ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200")}`)}>${escape_html(plan.is_accomplished ? "Achieved" : "Not Achieved")}</span></td><td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${escape_html(plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A")}</td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div> <div class="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600"><div class="text-sm text-gray-700 dark:text-gray-300">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredPlans.length))} of ${escape_html(filteredPlans.length)} entries</div> <div class="flex gap-2"><button class="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", currentPage === 1, true)}>`;
      Chevron_left($$payload, { class: "w-5 h-5" });
      $$payload.out += `<!----></button> <button class="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", currentPage === totalPages, true)}>`;
      Chevron_right($$payload, { class: "w-5 h-5" });
      $$payload.out += `<!----></button></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="text-center p-8 text-gray-500 dark:text-gray-400">No plans found matching your criteria.</div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  pop();
}
function Filters($$payload, $$props) {
  let {
    uniqueGoals,
    selectedStatus = "all",
    selectedGoal = "all"
  } = $$props;
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "achieved", label: "Achieved" },
    { value: "pending", label: "Pending" }
  ];
  const each_array = ensure_array_like(statusOptions);
  const each_array_1 = ensure_array_like(uniqueGoals);
  $$payload.out += `<div class="mt-4 p-4 bg-gray-50 rounded-lg"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="flex flex-col"><label for="status" class="text-sm font-medium text-gray-700 mb-1">Status</label> <select id="status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let option = each_array[$$index];
    $$payload.out += `<option${attr("value", option.value)}>${escape_html(option.label)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="flex flex-col"><label for="goal" class="text-sm font-medium text-gray-700 mb-1">Strategic Goal</label> <select id="goal" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let goal = each_array_1[$$index_1];
    $$payload.out += `<option${attr("value", goal)}>${escape_html(goal === "all" ? "All Goals" : goal)}</option>`;
  }
  $$payload.out += `<!--]--></select></div></div></div>`;
  bind_props($$props, { selectedStatus, selectedGoal });
}
function DeptPlansMonitoring($$payload, $$props) {
  push();
  let uniqueGoals;
  let actionPlans = [];
  let searchTerm = "";
  let sortBy = "strategic_goal_name";
  let selectedStatus = "all";
  let selectedGoal = "all";
  uniqueGoals = [
    "all",
    ...new Set(actionPlans.map((plan) => plan.strategic_goal_name))
  ];
  actionPlans.filter((plan) => {
    const matchesSearch = plan.strategic_goal_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.objective_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.actions_taken.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" ? true : selectedStatus === "achieved" ? plan.is_accomplished : !plan.is_accomplished;
    const matchesGoal = selectedGoal === "all" || plan.strategic_goal_name === selectedGoal;
    return matchesSearch && matchesStatus && matchesGoal;
  }).sort((a, b) => {
    const compareValue = 1;
    return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="min-h-screen flex flex-col bg-gray-100"><header class="sticky top-0 z-40 bg-white border-b shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><h1 class="text-2xl font-medium text-gray-800">Plans Monitoring</h1> <div class="flex items-center gap-2"><div class="relative flex-1 sm:flex-none"><input type="search"${attr("value", searchTerm)} placeholder="Search plans..." class="w-full sm:w-64 pl-3 pr-8 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"> <span class="absolute right-2 top-2.5 text-gray-400">🔍</span></div></div></div> <div class="mt-4">`;
    Filters($$payload2, {
      uniqueGoals,
      get selectedStatus() {
        return selectedStatus;
      },
      set selectedStatus($$value) {
        selectedStatus = $$value;
        $$settled = false;
      },
      get selectedGoal() {
        return selectedGoal;
      },
      set selectedGoal($$value) {
        selectedGoal = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div></div></header> <main class="flex-1"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">`;
    {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center items-center h-64">`;
      Loader_circle($$payload2, {
        class: "animate-spin h-10 w-10 text-indigo-500"
      });
      $$payload2.out += `<!----></div>`;
    }
    $$payload2.out += `<!--]--></div></main> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  AdminPlansMonitoring as A,
  Circle_alert as C,
  DeptPlansMonitoring as D,
  Lightbulb as L,
  Triangle_alert as T,
  Clipboard_list as a
};
