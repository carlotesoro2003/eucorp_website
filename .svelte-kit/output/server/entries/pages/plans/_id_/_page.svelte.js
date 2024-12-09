import { P as spread_props, Q as slot, R as sanitize_props, L as escape_html, N as ensure_array_like, F as attr, C as pop, A as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
import "../../../../chunks/client.js";
import "jspdf";
import "jspdf-autotable";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { S as Search } from "../../../../chunks/search.js";
function File_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "M12 18v-6" }],
    ["path", { "d": "m9 15 3 3 3-3" }]
  ];
  Icon($$payload, spread_props([
    { name: "file-down" },
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
function Pen($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "pen" },
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
function _page($$payload, $$props) {
  push();
  let searchQuery = "";
  let goal = null;
  let objectives = [];
  let editingObjective = null;
  let updatedObjective = {};
  const filteredObjectives = objectives.filter((objective) => {
    const searchFields = `${objective.name} ${objective.strategic_initiatives} ${objective.kpi} ${objective.persons_involved}`.toLowerCase();
    return searchFields.includes(searchQuery.toLowerCase());
  });
  $$payload.out += `<div class="container mx-auto p-4">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="flex flex-col gap-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><a href="/plans" class="flex items-center gap-2 text-muted-foreground mb-2 hover:text-foreground">`;
    Chevron_left($$payload, { size: 20 });
    $$payload.out += `<!----> Back to Goals</a> <h1 class="text-3xl font-bold">Strategic Objectives for Goal ${escape_html(goal?.goal_no)}</h1> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="flex flex-col sm:flex-row gap-2"><a href="/plans/strategicPlans" class="btn btn-primary flex items-center gap-2">`;
    Plus($$payload, { size: 20 });
    $$payload.out += `<!----> Add Objectives</a> <button class="btn btn-secondary flex items-center gap-2">`;
    File_down($$payload, { size: 20 });
    $$payload.out += `<!----> Export PDF</button></div></div> `;
    if (objectives.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(filteredObjectives);
      $$payload.out += `<div class="relative">`;
      Search($$payload, {
        class: "absolute left\r\n\r\n-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
        size: 20
      });
      $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search objectives..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left">Strategic Objectives</th><th class="px-4 py-3 text-left">Strategic Initiatives</th><th class="px-4 py-3 text-left">KPI</th><th class="px-4 py-3 text-left">Persons Involved</th><th class="px-4 py-3 text-left">Target</th><th class="px-4 py-3 text-left">Evaluation Measures</th><th class="px-4 py-3 text-center">Actions</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let objective = each_array[$$index];
        $$payload.out += `<tr>`;
        if (editingObjective?.id === objective.id) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<td class="px-4 py-3"><textarea class="textarea textarea-bordered w-full svelte-1n9y17z" rows="3">`;
          const $$body = escape_html(updatedObjective.name);
          if ($$body) {
            $$payload.out += `${$$body}`;
          }
          $$payload.out += `</textarea></td> <td class="px-4 py-3"><textarea class="textarea textarea-bordered w-full svelte-1n9y17z" rows="3">`;
          const $$body_1 = escape_html(updatedObjective.strategic_initiatives);
          if ($$body_1) {
            $$payload.out += `${$$body_1}`;
          }
          $$payload.out += `</textarea></td> <td class="px-4 py-3"><textarea class="textarea textarea-bordered w-full svelte-1n9y17z" rows="3">`;
          const $$body_2 = escape_html(updatedObjective.kpi);
          if ($$body_2) {
            $$payload.out += `${$$body_2}`;
          }
          $$payload.out += `</textarea></td> <td class="px-4 py-3"><textarea class="textarea textarea-bordered w-full svelte-1n9y17z" rows="3">`;
          const $$body_3 = escape_html(updatedObjective.persons_involved);
          if ($$body_3) {
            $$payload.out += `${$$body_3}`;
          }
          $$payload.out += `</textarea></td> <td class="px-4 py-3"><textarea class="textarea textarea-bordered w-full svelte-1n9y17z" rows="3">`;
          const $$body_4 = escape_html(updatedObjective.target);
          if ($$body_4) {
            $$payload.out += `${$$body_4}`;
          }
          $$payload.out += `</textarea></td> <td class="px-4 py-3"><textarea class="textarea textarea-bordered w-full svelte-1n9y17z" rows="3">`;
          const $$body_5 = escape_html(updatedObjective.eval_measures);
          if ($$body_5) {
            $$payload.out += `${$$body_5}`;
          }
          $$payload.out += `</textarea></td> <td class="px-4 py-3"><div class="flex flex-col gap-2"><button class="btn btn-primary btn-sm">Save</button> <button class="btn btn-ghost btn-sm">Cancel</button></div></td>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<td class="px-4 py-3">${escape_html(objective.name)}</td> <td class="px-4 py-3">${escape_html(objective.strategic_initiatives)}</td> <td class="px-4 py-3">${escape_html(objective.kpi)}</td> <td class="px-4 py-3">${escape_html(objective.persons_involved)}</td> <td class="px-4 py-3">${escape_html(objective.target)}</td> <td class="px-4 py-3">${escape_html(objective.eval_measures)}</td> <td class="px-4 py-3"><div class="flex justify-center gap-2"><button class="btn btn-primary btn-sm">View Plans</button> <button class="btn btn-ghost btn-sm">`;
          Pen($$payload, { size: 18 });
          $$payload.out += `<!----></button></div></td>`;
        }
        $$payload.out += `<!--]--></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="text-center py-12 bg-card rounded-lg border border-border"><p class="text-muted-foreground mb-4">No objectives found for this goal.</p> <a href="/plans/strategicPlans" class="btn btn-primary">Add Strategic Objectives</a></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
