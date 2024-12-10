import { C as pop, A as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
import "../../../../chunks/client.js";
import "jspdf";
import "jspdf-autotable";
function _page($$payload, $$props) {
  push();
  let searchQuery = "";
  let sortField = "name";
  let objectives = [];
  objectives.filter((objective) => {
    const searchFields = `${objective.name} ${objective.strategic_initiatives} ${objective.kpi} ${objective.persons_involved}`.toLowerCase();
    return searchFields.includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    return aValue.localeCompare(bValue);
  });
  $$payload.out += `<div class="container mx-auto p-4">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center min-h-[200px]"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
