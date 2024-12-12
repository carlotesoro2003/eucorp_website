import { N as spread_props, O as slot, P as sanitize_props, F as attr, Q as ensure_array_like, L as escape_html, C as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Plus } from "../../../chunks/plus.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
function Calendar_range($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2"
      }
    ],
    ["path", { "d": "M16 2v4" }],
    ["path", { "d": "M3 10h18" }],
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M17 14h-6" }],
    ["path", { "d": "M13 18H7" }],
    ["path", { "d": "M7 14h.01" }],
    ["path", { "d": "M17 18h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "calendar-range" },
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
function School($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M14 22v-4a2 2 0 1 0-4 0v4" }
    ],
    [
      "path",
      {
        "d": "m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"
      }
    ],
    ["path", { "d": "M18 5v17" }],
    [
      "path",
      { "d": "m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" }
    ],
    ["path", { "d": "M6 5v17" }],
    [
      "circle",
      { "cx": "12", "cy": "9", "r": "2" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "school" },
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
  let schoolYears = [];
  let searchQuery = "";
  const filteredSchoolYears = schoolYears.filter((year) => year.school_year.toLowerCase().includes(searchQuery.toLowerCase()));
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  $$payload.out += `<div class="container px-6 py-6 mx-auto"><div class="flex flex-col gap-6 mb-8"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  School($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">School Years Management</h1></div></div> <div class="flex flex-col md:flex-row justify-between gap-4 w-full"><div class="relative flex-1 w-full md:max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search school years..." class="pl-10 sm:max-w-md px-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <div class="flex gap-2 w-full md:w-auto md:justify-end"><button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">`;
  Plus($$payload, { size: 20 });
  $$payload.out += `<!----> <span>Add New Year</span></button></div></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
    if (filteredSchoolYears.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-center py-12 bg-card rounded-lg border border-border">`;
      Calendar_range($$payload, {
        size: 48,
        class: "mx-auto text-muted-foreground mb-4"
      });
      $$payload.out += `<!----> <h3 class="text-lg font-semibold mb-2">No School Years Found</h3> <p class="text-muted-foreground">Start by adding a new school year.</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(filteredSchoolYears);
      $$payload.out += `<div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><table class="w-full"><thead class="bg-muted/50"><tr><th class="px-6 py-4 text-left font-medium">School Year</th><th class="px-6 py-4 text-left font-medium">Start Date</th><th class="px-6 py-4 text-left font-medium">End Date</th><th class="px-6 py-4 text-left font-medium">Mid Year</th><th class="px-6 py-4 text-left font-medium">Actions</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$payload.out += `<tr class="hover:bg-muted/50 transition-colors"><td class="px-6 py-4 font-medium">${escape_html(item.school_year)}</td><td class="px-6 py-4">${escape_html(formatDate(item.start_date))}</td><td class="px-6 py-4">${escape_html(formatDate(item.end_date))}</td><td class="px-6 py-4">${escape_html(item.mid_year ? formatDate(item.mid_year) : "-")}</td><td class="px-6 py-4"><div class="flex items-center gap-4"><button class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit">`;
        Pencil($$payload, { size: 18 });
        $$payload.out += `<!----></button> <button class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete">`;
        Trash_2($$payload, { size: 18 });
        $$payload.out += `<!----></button></div></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};
