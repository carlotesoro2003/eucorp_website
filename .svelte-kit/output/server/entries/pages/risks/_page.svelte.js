import { C as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<div>`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Loading...</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
