import { N as ensure_array_like, F as attr, L as escape_html, C as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
import "../../../chunks/client.js";
import { P as Plus } from "../../../chunks/plus.js";
import { S as Search } from "../../../chunks/search.js";
function _page($$payload, $$props) {
  push();
  let searchQuery = "";
  let sortField = "goal_no";
  let leadFilter = "all";
  let strategicGoals = [];
  let leads = [];
  strategicGoals.filter((goal) => {
    const searchFields = `${goal.name} ${goal.description} ${goal.kpi}`.toLowerCase();
    const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
    const matchesLead = leadFilter === "all";
    return matchesSearch && matchesLead;
  }).sort((a, b) => {
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    return aValue.localeCompare(bValue);
  });
  const each_array = ensure_array_like(leads);
  $$payload.out += `<div class="container mx-auto p-4">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><h1 class="text-3xl font-bold">Strategic Goals</h1> <button class="btn btn-primary flex items-center gap-2">`;
  Plus($$payload, { size: 20 });
  $$payload.out += `<!----> Add Goal</button></div> <div class="flex flex-col md:flex-row gap-4 mb-6"><div class="relative flex-2">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search goals..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <select class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]"><option value="all">All Leads</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let lead = each_array[$$index];
    $$payload.out += `<option${attr("value", lead.id)}>${escape_html(lead.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
