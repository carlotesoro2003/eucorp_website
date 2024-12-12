import { G as bind_props, C as pop, A as push, S as copy_payload, T as assign_payload, Q as ensure_array_like, L as escape_html, F as attr } from "../../../../../chunks/index.js";
import "../../../../../chunks/supabaseClient.js";
import "../../../../../chunks/client.js";
import { C as Chevron_left } from "../../../../../chunks/chevron-left.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { S as Save } from "../../../../../chunks/save.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
import { X } from "../../../../../chunks/x.js";
function Modal($$payload, $$props) {
  push();
  let { show = false, children } = $$props;
  if (show) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 z-50 overflow-y-auto"><div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"><div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity"></div> <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">`;
    children($$payload);
    $$payload.out += `<!----></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { show });
  pop();
}
function _page($$payload, $$props) {
  push();
  let actionPlans = [];
  let currentPlan = {
    actions_taken: "",
    kpi: "",
    target_output: "",
    key_person_responsible: "",
    objective_id: 0,
    profile_id: "",
    department_id: ""
  };
  let isSubmitting = false;
  let showModal = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array = ensure_array_like(actionPlans);
    $$payload2.out += `<div class="flex flex-col gap-4 p-4 container mx-auto">`;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <a href="/plans/operationalPlans" class="flex items-center gap-2 text-muted-foreground mb-2 hover:text-foreground">`;
    Chevron_left($$payload2, { size: 20 });
    $$payload2.out += `<!----> Back to Operational Plans</a> <div class="bg-card border border-border rounded-lg shadow p-6"><h1 class="text-2xl font-bold">Action Plans</h1> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="bg-card rounded-lg shadow border border-border p-6"><div class="flex justify-between items-center mb-6"><h2 class="text-xl font-semibold">Action Plans List</h2> <button class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">`;
    Plus($$payload2, { size: 20 });
    $$payload2.out += `<!----> Add Plan</button></div> <div class="space-y-4"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let plan = each_array[index];
      $$payload2.out += `<div class="border border-border rounded-lg p-4 relative hover:bg-muted/50 transition-colors"><div class="grid md:grid-cols-2 gap-4"><div><h4 class="font-medium">Actions Taken</h4> <p class="text-muted-foreground mt-1">${escape_html(plan.actions_taken)}</p></div> <div><h4 class="font-medium">KPI</h4> <p class="text-muted-foreground mt-1">${escape_html(plan.kpi)}</p></div> <div><h4 class="font-medium">Target Output</h4> <p class="text-muted-foreground mt-1">${escape_html(plan.target_output)}</p></div> <div><h4 class="font-medium">Key Person Responsible</h4> <p class="text-muted-foreground mt-1">${escape_html(plan.key_person_responsible)}</p></div></div> <div class="absolute top-4 right-4 flex gap-2"><button class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">`;
      Save($$payload2, { size: 18 });
      $$payload2.out += `<!----></button> <button class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">`;
      Trash_2($$payload2, { size: 18 });
      $$payload2.out += `<!----></button></div></div>`;
    }
    $$payload2.out += `<!--]--></div> `;
    if (actionPlans.length === 0) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="text-center py-8 text-muted-foreground">No action plans added yet. Click "Add Plan" to create one.</div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="flex justify-end"><button${attr("disabled", isSubmitting, true)} class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">`;
    {
      $$payload2.out += "<!--[!-->";
      Save($$payload2, { size: 20 });
      $$payload2.out += `<!----> Submit All`;
    }
    $$payload2.out += `<!--]--></button></div></div> `;
    Modal($$payload2, {
      get show() {
        return showModal;
      },
      set show($$value) {
        showModal = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        const each_array_1 = ensure_array_like([
          "actions_taken",
          "kpi",
          "target_output",
          "key_person_responsible"
        ]);
        $$payload3.out += `<div class="p-6"><div class="flex justify-between items-center mb-6"><h3 class="text-xl font-semibold">${escape_html("Add")} Action Plan</h3> <button class="text-muted-foreground hover:text-foreground transition-colors">`;
        X($$payload3, { size: 24 });
        $$payload3.out += `<!----></button></div> <div class="space-y-4"><!--[-->`;
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let field = each_array_1[$$index_1];
          $$payload3.out += `<div class="space-y-2"><label class="block text-sm font-medium">${escape_html(field.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "))}</label> <textarea class="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-ring">`;
          const $$body = escape_html(currentPlan[field]);
          if ($$body) {
            $$payload3.out += `${$$body}`;
          }
          $$payload3.out += `</textarea></div>`;
        }
        $$payload3.out += `<!--]--></div> <div class="mt-6 flex justify-end gap-4"><button class="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">Cancel</button> <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">${escape_html("Add")} Plan</button></div></div>`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!---->`;
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
