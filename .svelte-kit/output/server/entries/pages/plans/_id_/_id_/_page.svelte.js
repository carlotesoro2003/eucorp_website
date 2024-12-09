import { N as ensure_array_like, F as attr, L as escape_html, C as pop, A as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
import "../../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let displayedActionPlans = [];
  let departments = [];
  let currentUserRole = null;
  const each_array = ensure_array_like(departments);
  $$payload.out += `<div class="min-h-screen p-8"><h1 class="text-2xl font-bold mb-4">Action Plans</h1> <div class="mb-4 flex gap-4"><select class="select select-bordered"><option value="all">All Departments</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let department = each_array[$$index];
    $$payload.out += `<option${attr("value", department.name)}>${escape_html(department.name)}</option>`;
  }
  $$payload.out += `<!--]--></select> <button class="btn btn-primary">All</button> <button class="btn btn-secondary">Approved</button> <button class="btn btn-error">Not Approved</button></div> `;
  if (displayedActionPlans.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="btn btn-secondary mb-4">Export to PDF</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
    if (displayedActionPlans.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(displayedActionPlans);
      $$payload.out += `<div class="overflow-x-auto"><table class="table w-full shadow-lg rounded-lg"><thead><tr><th>Department</th><th>Actions Taken</th><th>KPI</th><th>Target Output</th><th>Key Person Responsible</th><th>Actions</th></tr></thead><tbody><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let plan = each_array_1[$$index_1];
        $$payload.out += `<tr><td>${escape_html(plan.department_name)}</td><td>${escape_html(plan.actions_taken)}</td><td>${escape_html(plan.kpi)}</td><td>${escape_html(plan.target_output)}</td><td>${escape_html(plan.key_person_responsible)}</td><td class="flex space-x-2"><button class="btn btn-sm btn-success text-white"${attr("disabled", currentUserRole === "president", true)}>${escape_html("Approve")}</button> <button class="btn btn-sm btn-error text-white">Delete</button></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div>No action plans found for this objective.</div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
