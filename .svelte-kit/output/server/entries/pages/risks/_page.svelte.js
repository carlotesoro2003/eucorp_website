import { C as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<div>`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-screen"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
