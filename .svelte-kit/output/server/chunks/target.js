import { N as spread_props, O as slot, P as sanitize_props } from "./index.js";
import { I as Icon } from "./Icon.js";
function Target($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "6" }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "2" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "target" },
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
export {
  Target as T
};
