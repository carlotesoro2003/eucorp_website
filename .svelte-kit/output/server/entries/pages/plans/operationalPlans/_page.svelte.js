import { N as ensure_array_like, F as attr, L as escape_html, C as pop, A as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let goals = [];
  const each_array = ensure_array_like(goals);
  $$payload.out += `<div class="container mx-auto p-4"><h1 class="text-3xl font-bold">Operational Plans</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="my-4"><label class="block">Select a Strategic Goal:</label> <select class="select select-bordered w-full"><option value="" disabled selected>Select a goal</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let goal = each_array[$$index];
    $$payload.out += `<option${attr("value", goal.id)}>${escape_html(goal.goal_no)} - ${escape_html(goal.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> `;
  {
    $$payload.out += "<!--[!-->";
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
