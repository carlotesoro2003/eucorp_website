import { F as attr, Q as ensure_array_like, L as escape_html, C as pop, R as stringify, A as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
import { T as Target } from "../../../../chunks/target.js";
import { P as Plus } from "../../../../chunks/plus.js";
function _page($$payload, $$props) {
  push();
  let strategicGoals = [];
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8"><div class="max-w-4xl mx-auto space-y-6"><div class="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Strategic Objectives</h1> <p class="text-gray-600 dark:text-gray-400 mt-1">Define and manage your strategic objectives</p></div> `;
  Target($$payload, { class: "w-8 h-8 text-blue-500" });
  $$payload.out += `<!----></div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"><div class="flex items-center justify-between mb-8"><div class="flex-1"><div class="relative"><div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-500 rounded transition-all duration-300"${attr("style", `width: ${stringify("0%")}`)}></div></div> <div class="flex justify-between absolute -top-3 w-full"><span class="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white text-sm">1</span> <span${attr("class", `w-8 h-8 flex items-center justify-center rounded-full text-sm ${stringify([
    "",
    "",
    "bg-gray-200",
    "text-gray-600"
  ].filter(Boolean).join(" "))}`)}>2</span></div></div> <div class="flex justify-between mt-4"><span class="text-sm font-medium text-gray-600">Select Goal</span> <span class="text-sm font-medium text-gray-600">Add Objectives</span></div></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(strategicGoals);
    $$payload.out += `<div class="space-y-4"><label for="strategic_goal" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Strategic Goal</label> <select id="strategic_goal" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"><option${attr("value", null)}>Select a goal</option><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let goal = each_array[$$index];
      $$payload.out += `<option${attr("value", goal.id)}>${escape_html(goal.name)}</option>`;
    }
    $$payload.out += `<!--]--></select> <button class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">`;
    Plus($$payload, { class: "w-5 h-5" });
    $$payload.out += `<!----> Continue to Add Objectives</button></div>`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  pop();
}
export {
  _page as default
};
