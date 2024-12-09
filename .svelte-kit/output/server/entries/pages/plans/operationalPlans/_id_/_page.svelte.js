import { N as ensure_array_like, L as escape_html, F as attr, C as pop, A as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/supabaseClient.js";
import "../../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let actionPlans = [
    {
      actions_taken: "",
      kpi: "",
      target_output: "",
      key_person_responsible: "",
      objective_id: 0,
      profile_id: "",
      department_id: ""
    }
  ];
  let isSubmitting = false;
  const each_array = ensure_array_like(actionPlans);
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8"><h1 class="text-2xl font-bold mb-4">Action Plans</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="overflow-x-auto"><table class="table table-zebra w-full shadow-lg rounded-lg"><thead><tr><th>Actions Taken</th><th>KPI</th><th>Target Output</th><th>Key Person Responsible</th><th>Actions</th></tr></thead><tbody><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let plan = each_array[index];
    $$payload.out += `<tr><td><textarea class="input input-bordered w-full resize-none svelte-vxi0bz">`;
    const $$body = escape_html(plan.actions_taken);
    if ($$body) {
      $$payload.out += `${$$body}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="input input-bordered w-full resize-none svelte-vxi0bz">`;
    const $$body_1 = escape_html(plan.kpi);
    if ($$body_1) {
      $$payload.out += `${$$body_1}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="input input-bordered w-full resize-none svelte-vxi0bz">`;
    const $$body_2 = escape_html(plan.target_output);
    if ($$body_2) {
      $$payload.out += `${$$body_2}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="input input-bordered w-full resize-none svelte-vxi0bz">`;
    const $$body_3 = escape_html(plan.key_person_responsible);
    if ($$body_3) {
      $$payload.out += `${$$body_3}`;
    }
    $$payload.out += `</textarea></td><td><button class="btn btn-error btn-sm text-white">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div> <div class="mt-4 flex gap-4"><button class="btn btn-primary">Add Row</button> <button class="btn btn-secondary"${attr("disabled", isSubmitting, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Submit`;
  }
  $$payload.out += `<!--]--></button></div></div>`;
  pop();
}
export {
  _page as default
};
