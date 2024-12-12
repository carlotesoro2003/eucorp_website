import { Q as ensure_array_like, F as attr, L as escape_html, C as pop, A as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
import "../../../../../chunks/client.js";
import { S as Search } from "../../../../../chunks/search.js";
import { A as Arrow_up_down } from "../../../../../chunks/arrow-up-down.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
function _page($$payload, $$props) {
  push();
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 5;
  let sortField = "department_name";
  let displayedActionPlans = [];
  let departments = [];
  let currentUserRole = null;
  const filteredAndSortedPlans = displayedActionPlans.filter((plan) => {
    const searchFields = `${plan.department_name} ${plan.actions_taken} ${plan.kpi} ${plan.target_output} ${plan.key_person_responsible}`.toLowerCase();
    return searchFields.includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    const aValue = a[sortField].toString().toLowerCase();
    const bValue = b[sortField].toString().toLowerCase();
    return aValue.localeCompare(bValue);
  });
  const paginatedPlans = filteredAndSortedPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);
  const each_array = ensure_array_like(departments);
  $$payload.out += `<div class="flex flex-col gap-4 p-4 container mx-auto"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2"><h1 class="text-2xl font-bold">Action Plans</h1></div></div> <div class="flex flex-col md:flex-row gap-4 mb-6"><div class="flex flex-col md:flex-row gap-4 flex-1"><div class="relative flex-1 w-full md:max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search action plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <select class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]"><option value="all">All Departments</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let department = each_array[$$index];
    $$payload.out += `<option${attr("value", department.name)}>${escape_html(department.name)}</option>`;
  }
  $$payload.out += `<!--]--></select> <select class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]"><option value="all">All Status</option><option value="approved">Approved</option><option value="notApproved">Not Approved</option></select></div> <div class="flex gap-2">`;
  if (displayedActionPlans.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors">Export to PDF</button> <button${attr("disabled", displayedActionPlans.every((plan) => currentUserRole === "president"), true)} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">${escape_html("Approve All")}</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> `;
  {
    $$payload.out += "<!--[!-->";
    if (paginatedPlans.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(paginatedPlans);
      $$payload.out += `<div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left"><button class="flex items-center gap-1">Department `;
      Arrow_up_down($$payload, {
        size: 16,
        class: "text-primary"
      });
      $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1">Actions Taken `;
      Arrow_up_down($$payload, {
        size: 16,
        class: ""
      });
      $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left">KPI</th><th class="px-4 py-3 text-left">Target Output</th><th class="px-4 py-3 text-left">Key Person Responsible</th><th class="px-4 py-3 text-center">Actions</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let plan = each_array_1[$$index_1];
        $$payload.out += `<tr class="hover:bg-muted/50"><td class="px-4 py-3">${escape_html(plan.department_name)}</td><td class="px-4 py-3">${escape_html(plan.actions_taken)}</td><td class="px-4 py-3">${escape_html(plan.kpi)}</td><td class="px-4 py-3">${escape_html(plan.target_output)}</td><td class="px-4 py-3">${escape_html(plan.key_person_responsible)}</td><td class="px-4 py-3"><div class="flex justify-center gap-2"><button${attr("disabled", currentUserRole === "president", true)} class="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 text-sm">${escape_html("Approve")}</button> <button class="p-1.5 hover:bg-muted rounded-lg text-red-400">`;
        Trash_2($$payload, { size: 16 });
        $$payload.out += `<!----></button></div></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"><div class="text-sm text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredAndSortedPlans.length))} of ${escape_html(filteredAndSortedPlans.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option${attr("value", 5)}>5 per page</option><option${attr("value", 10)}>10 per page</option><option${attr("value", 25)}>25 per page</option><option${attr("value", 50)}>50 per page</option></select> <button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Next</button></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
