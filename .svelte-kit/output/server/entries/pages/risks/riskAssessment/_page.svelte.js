import { N as ensure_array_like, L as escape_html, F as attr, C as pop, A as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let savedRisks = [];
  let riskAssessments = [];
  let classification = [];
  let departmentName = "";
  const each_array = ensure_array_like(savedRisks);
  $$payload.out += `<div><h1 class="text-3xl font-bold">${escape_html(departmentName)} Risks Register</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <h2 class="text-2xl font-bold mt-8">All Saved Risks</h2> <table class="table table-zebra w-full mt-4"><thead><tr><th>RRN</th><th>Risk Statement</th><th>Classification</th><th>Actions</th><th>Key Persons</th><th>Budget</th><th></th></tr></thead><tbody><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let risk = each_array[$$index];
    $$payload.out += `<tr><td>${escape_html(risk.rrn)}</td><td>${escape_html(risk.risk_statement)}</td><td>${escape_html(classification.find((cls) => cls.id === risk.classification)?.name || "N/A")}</td><td>${escape_html(risk.actions)}</td><td>${escape_html(risk.key_persons)}</td><td>${escape_html(risk.budget)}</td><td><button class="btn btn-sm btn-primary"${attr("disabled", riskAssessments.some((ra) => ra.risk_id === risk.id), true)}>Add Assessment</button></td><td><button class="btn btn-sm btn-error">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
