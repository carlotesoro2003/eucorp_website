import { N as ensure_array_like, J as store_get, L as escape_html, F as attr, K as unsubscribe_stores, C as pop, A as push } from "../../../chunks/index.js";
/* empty css                       */
import { g as get, w as writable } from "../../../chunks/index3.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let goals = writable([]);
  const addGoalRow = () => {
    goals.update((currentGoals) => [
      ...currentGoals,
      {
        id: Date.now(),
        goal: "",
        evaluation: "",
        achieved: null,
        isLoading: false
      }
    ]);
  };
  if (get(goals).length === 0) addGoalRow();
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$goals", goals));
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8"><h1 class="text-2xl font-bold mb-4">Monitoring Page</h1> <button class="btn bg-indigo-500 hover:bg-indigo-600 text-white font-medium mb-4">Add New Goal</button> <button class="btn bg-teal-500 hover:bg-teal-600 text-white font-medium mb-4">Evaluate All Goals with Gemini AI</button> <table class="table-auto w-full shadow-lg rounded-lg overflow-hidden"><thead><tr class="uppercase text-sm"><th class="px-6 py-3">Target</th><th class="px-6 py-3">Evaluation</th><th class="px-6 py-3">Achieved</th><th class="px-6 py-3">Actions</th></tr></thead><tbody><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let { id, goal, evaluation, achieved, isLoading } = each_array[$$index];
    $$payload.out += `<tr class="border-b"><td class="px-6 py-4"><textarea class="w-full border border-gray-300 rounded px-2 py-1">`;
    const $$body = escape_html(goal);
    if ($$body) {
      $$payload.out += `${$$body}`;
    }
    $$payload.out += `</textarea></td><td class="px-6 py-4"><textarea class="w-full border border-gray-300 rounded px-2 py-1">`;
    const $$body_1 = escape_html(evaluation);
    if ($$body_1) {
      $$payload.out += `${$$body_1}`;
    }
    $$payload.out += `</textarea></td><td class="px-6 py-4">`;
    if (isLoading) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="loading loading-spinner text-primary"></span>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (achieved) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-blue-500 cursor-pointer underline" role="button" tabindex="0">${escape_html(achieved.startsWith("Yes") ? "Achieved" : "Not Achieved")}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `Pending`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></td><td class="px-6 py-4"><button class="btn btn-ghost btn-sm"${attr("disabled", !goal || !evaluation, true)}>Evaluate</button> <button class="btn btn-error btn-sm ml-2 svelte-u173a1">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
