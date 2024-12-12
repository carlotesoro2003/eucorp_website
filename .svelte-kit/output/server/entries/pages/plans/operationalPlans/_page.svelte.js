import { N as spread_props, O as slot, P as sanitize_props, Q as ensure_array_like, L as escape_html, C as pop, A as push, F as attr, G as bind_props, S as copy_payload, T as assign_payload } from "../../../../chunks/index.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
import "../../../../chunks/client.js";
import { A as Arrow_up_down } from "../../../../chunks/arrow-up-down.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { S as Search } from "../../../../chunks/search.js";
import { D as Download } from "../../../../chunks/download.js";
function Notebook($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M2 6h4" }],
    ["path", { "d": "M2 10h4" }],
    ["path", { "d": "M2 14h4" }],
    ["path", { "d": "M2 18h4" }],
    [
      "rect",
      {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2"
      }
    ],
    ["path", { "d": "M16 2v20" }]
  ];
  Icon($$payload, spread_props([
    { name: "notebook" },
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
function ObjectivesTable($$payload, $$props) {
  push();
  let {
    items,
    sortField,
    sortDirection,
    toggleSort,
    selectedGoal
  } = $$props;
  const each_array = ensure_array_like(items);
  $$payload.out += `<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">`;
  if (selectedGoal) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="p-4 border-b border-border"><h3 class="font-semibold">Strategic Goal No ${escape_html(selectedGoal.goal_no)}</h3> <p class="text-sm text-muted-foreground">${escape_html(selectedGoal.name)}</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Objective `;
  Arrow_up_down($$payload, {
    size: 16,
    class: sortField === "name" ? "text-primary" : ""
  });
  $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left hidden md:table-cell">Strategic Initiatives</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">KPI `;
  Arrow_up_down($$payload, {
    size: 16,
    class: sortField === "kpi" ? "text-primary" : ""
  });
  $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left hidden lg:table-cell">Persons Involved</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Target `;
  Arrow_up_down($$payload, {
    size: 16,
    class: sortField === "target" ? "text-primary" : ""
  });
  $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left hidden xl:table-cell">Evaluation Measures</th><th class="px-4 py-3 text-left w-[120px]">Action</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let objective = each_array[$$index];
    $$payload.out += `<tr class="hover:bg-muted/50"><td class="px-4 py-3">${escape_html(objective.name)}</td><td class="px-4 py-3 hidden md:table-cell">${escape_html(objective.strategic_initiatives)}</td><td class="px-4 py-3">${escape_html(objective.kpi)}</td><td class="px-4 py-3 hidden lg:table-cell">${escape_html(objective.persons_involved)}</td><td class="px-4 py-3">${escape_html(objective.target)}</td><td class="px-4 py-3 hidden xl:table-cell">${escape_html(objective.eval_measures)}</td><td class="px-4 py-3"><button class="btn btn-ghost btn-sm text-blue-500" title="View Action Plans">`;
    Eye($$payload, { size: 18 });
    $$payload.out += `<!----></button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div>`;
  pop();
}
function GoalSelector($$payload, $$props) {
  let { selectedGoalId = null, goals, onSelect } = $$props;
  const each_array = ensure_array_like(goals);
  $$payload.out += `<div class="w-full md:w-[300px]"><label class="block mb-2 font-medium">Select Strategic Goal:</label> <select class="select select-bordered w-full bg-secondary border-secondary rounded-lg"><option value="" disabled selected>Select a goal</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let goal = each_array[$$index];
    $$payload.out += `<option${attr("value", goal.id)}>${escape_html(goal.goal_no)} - ${escape_html(goal.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div>`;
  bind_props($$props, { selectedGoalId });
}
function _page($$payload, $$props) {
  push();
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 5;
  let sortField = "name";
  let sortDirection = "asc";
  let loading = true;
  let selectedGoalId = null;
  let goals = [];
  let objectives = [];
  const init = async () => {
    await fetchGoals();
    if (goals.length > 0) {
      selectedGoalId = goals[0].id;
      await fetchObjectives();
    }
    loading = false;
  };
  const fetchGoals = async () => {
    const { data, error } = await supabase.from("strategic_goals").select("id, name, goal_no");
    if (error) {
      console.error("Error fetching strategic goals:", error);
    } else {
      goals = data || [];
    }
  };
  const fetchObjectives = async () => {
    if (!selectedGoalId) return;
    loading = true;
    const { data, error } = await supabase.from("strategic_objectives").select("*").eq("strategic_goal_id", selectedGoalId);
    if (error) {
      console.error("Error fetching strategic objectives:", error);
    } else {
      objectives = data || [];
    }
    loading = false;
  };
  const toggleSort = (field) => {
    if (sortField === field) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortDirection = "asc";
    }
  };
  const filteredItems = objectives.filter((obj) => {
    const searchFields = `${obj.name} ${obj.strategic_initiatives} ${obj.kpi}`.toLowerCase();
    return searchFields.includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    return sortDirection === "asc" ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
  });
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  init();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="flex flex-col gap-4 container mx-auto p-4"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
    Notebook($$payload2, { class: "w-8 h-8 text-primary" });
    $$payload2.out += `<!----> <h1 class="text-2xl font-bold">Operational Plans Management</h1></div></div> <div class="flex flex-col md:flex-row justify-between items-center gap-4"><div class="flex flex-shrink-0 w-full md:w-auto">`;
    GoalSelector($$payload2, {
      goals,
      get selectedGoalId() {
        return selectedGoalId;
      },
      set selectedGoalId($$value) {
        selectedGoalId = $$value;
        $$settled = false;
      },
      onSelect: fetchObjectives
    });
    $$payload2.out += `<!----></div> <div class="flex items-center gap-4 w-full md:w-auto"><div class="relative flex-1">`;
    Search($$payload2, {
      class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
      size: 20
    });
    $$payload2.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search objectives..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80">`;
    Download($$payload2, { size: 20 });
    $$payload2.out += `<!----> Export</button></div></div> `;
    if (loading) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      ObjectivesTable($$payload2, {
        items: paginatedItems,
        sortField,
        sortDirection,
        toggleSort,
        selectedGoal: goals.find((g) => g.id === selectedGoalId)
      });
      $$payload2.out += `<!----> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredItems.length))} of ${escape_html(filteredItems.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option${attr("value", 5)}>5 per page</option><option${attr("value", 10)}>10 per page</option><option${attr("value", 25)}>25 per page</option><option${attr("value", 50)}>50 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>`;
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
  _page as default
};
