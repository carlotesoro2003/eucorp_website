import"../chunks/disclose-version.Bg9kRutz.js";import{p as ie,g as e,a as ne,c as a,r as t,s as o,t as B,e as A,n as de,d as k,b as _,f as _e}from"../chunks/utils.CRNn4dtP.js";import{s as h}from"../chunks/render.xPn1qZIb.js";import{i as ce}from"../chunks/if.CRsBAEFG.js";import{d as ae,a as C,t as E}from"../chunks/store.B1kL-7Ni.js";import{r as me}from"../chunks/attributes.BcfEV1VJ.js";import{b as ge}from"../chunks/input.o7SqHMM4.js";import{b as ve}from"../chunks/select.CgyWjfO5.js";import{p as fe,a as z}from"../chunks/preload-helper.Dwm_PvIR.js";import{s as le}from"../chunks/supabaseClient.BTuNJN2N.js";import{e as ue,i as pe}from"../chunks/each.v0RK4Yef.js";import{g as be}from"../chunks/entry.DOGBvY7d.js";import{A as te}from"../chunks/arrow-up-down.Ck2frNgV.js";import{E as xe}from"../chunks/eye.C9SOZpvn.js";import{S as he}from"../chunks/search.B4Eo5Hu8.js";import{D as ye}from"../chunks/download.CIM__xX3.js";var we=E('<div class="p-4 border-b border-border"><h3 class="font-semibold"> </h3> <p class="text-sm text-muted-foreground"> </p></div>'),ke=(g,r)=>r.toggleSort("name"),Se=(g,r)=>r.toggleSort("kpi"),Ge=(g,r)=>r.toggleSort("target"),Ie=(g,r,y)=>r(e(y).id),Pe=E('<tr class="hover:bg-muted/50"><td class="px-4 py-3"> </td><td class="px-4 py-3 hidden md:table-cell"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3 hidden lg:table-cell"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3 hidden xl:table-cell"> </td><td class="px-4 py-3"><button class="btn btn-ghost btn-sm" title="View Action Plans"><!></button></td></tr>'),Ce=E('<div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><!> <table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Objective <!></button></th><th class="px-4 py-3 text-left hidden md:table-cell">Strategic Initiatives</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">KPI <!></button></th><th class="px-4 py-3 text-left hidden lg:table-cell">Persons Involved</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Target <!></button></th><th class="px-4 py-3 text-left hidden xl:table-cell">Evaluation Measures</th><th class="px-4 py-3 text-left w-[120px]">Action</th></tr></thead><tbody class="divide-y divide-border"></tbody></table></div>');function Ee(g,r){ie(r,!0);const y=G=>{be(`/plans/operationalPlans/${G}`)};var n=Ce(),d=a(n);ce(d,()=>r.selectedGoal,G=>{var v=we(),x=a(v),I=a(x);t(x);var O=o(x,2),w=a(O,!0);t(O),t(v),B(()=>{h(I,`Strategic Goal No ${r.selectedGoal.goal_no??""}`),h(w,r.selectedGoal.name)}),C(G,v)});var c=o(d,2),f=a(c),b=a(f),i=a(b),p=a(i);p.__click=[ke,r];var S=o(a(p)),L=A(()=>r.sortField==="name"?"text-primary":"");te(S,{size:16,get class(){return e(L)}}),t(p),t(i);var T=o(i,2),K=a(T);K.__click=[Se,r];var Q=o(a(K)),H=A(()=>r.sortField==="kpi"?"text-primary":"");te(Q,{size:16,get class(){return e(H)}}),t(K),t(T);var F=o(T,2),N=a(F);N.__click=[Ge,r];var J=o(a(N)),R=A(()=>r.sortField==="target"?"text-primary":"");te(J,{size:16,get class(){return e(R)}}),t(N),t(F),de(2),t(b),t(f);var j=o(f);ue(j,21,()=>r.items,pe,(G,v)=>{var x=Pe(),I=a(x),O=a(I,!0);t(I);var w=o(I),W=a(w,!0);t(w);var U=o(w),s=a(U,!0);t(U);var l=o(U),M=a(l,!0);t(l);var m=o(l),D=a(m,!0);t(m);var u=o(m),X=a(u,!0);t(u);var V=o(u),P=a(V);P.__click=[Ie,y,v];var q=a(P);xe(q,{size:18}),t(P),t(V),t(x),B(()=>{h(O,e(v).name),h(W,e(v).strategic_initiatives),h(s,e(v).kpi),h(M,e(v).persons_involved),h(D,e(v).target),h(X,e(v).eval_measures)}),C(G,x)}),t(j),t(c),t(n),C(g,n),ne()}ae(["click"]);var Fe=E("<option> </option>"),Oe=E('<div class="w-full md:w-[300px]"><label class="block mb-2 font-medium">Select Strategic Goal:</label> <select class="select select-bordered w-full bg-secondary border-secondary rounded-lg"><option disabled selected>Select a goal</option><!></select></div>');function ze(g,r){let y=fe(r,"selectedGoalId",15,null);var n=Oe(),d=o(a(n),2);d.__change=function(...b){var i;(i=r.onSelect)==null||i.apply(this,b)};var c=a(d);c.value=((c.__value="")==null,"");var f=o(c);ue(f,17,()=>r.goals,pe,(b,i)=>{var p=Fe(),S={},L=a(p);t(p),B(()=>{S!==(S=e(i).id)&&(p.value=(p.__value=e(i).id)==null?"":e(i).id),h(L,`${e(i).goal_no??""} - ${e(i).name??""}`)}),C(b,p)}),t(d),t(n),ve(d,y),C(g,n)}ae(["change"]);var Ae=E('<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),je=(g,r)=>_(r,e(r)-1),Me=(g,r)=>_(r,e(r)+1),De=E('<!> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground"> </div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option>5 per page</option><option>10 per page</option><option>25 per page</option><option>50 per page</option></select> <div class="flex gap-2"><button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>',1),Le=E('<div class="flex flex-col gap-4 container mx-auto p-4"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Operational Plans Management</h2></div> <div class="flex flex-col md:flex-row gap-4 items-start"><!> <div class="flex-1 flex flex-col md:flex-row gap-4"><div class="relative flex-1"><!> <input type="text" placeholder="Search objectives..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center md:w-auto"><!> Export</button></div></div> <!></div>');function et(g,r){ie(r,!0);let y=k(""),n=k(1),d=k(5),c=k("name"),f=k("asc"),b=k(!0),i=k(null),p=k(z([])),S=k(z([]));const L=async()=>{await T(),_(b,!1)},T=async()=>{const{data:s,error:l}=await le.from("strategic_goals").select("id, name, goal_no");l?console.error("Error fetching strategic goals:",l):_(p,z(s||[]))},K=async()=>{if(!e(i))return;_(b,!0);const{data:s,error:l}=await le.from("strategic_objectives").select("*").eq("strategic_goal_id",e(i));l?console.error("Error fetching strategic objectives:",l):_(S,z(s||[])),_(b,!1)},Q=s=>{e(c)===s?_(f,z(e(f)==="asc"?"desc":"asc")):(_(c,z(s)),_(f,"asc"))},H=()=>{const l=[["Objective","Strategic Initiatives","KPI","Persons Involved","Target","Evaluation Measures"].join(","),...e(S).map(u=>[u.name,u.strategic_initiatives,u.kpi,u.persons_involved,u.target,u.eval_measures].join(","))].join(`
`),M=new Blob([l],{type:"text/csv;charset=utf-8;"}),m=document.createElement("a"),D=URL.createObjectURL(M);m.setAttribute("href",D),m.setAttribute("download","objectives.csv"),m.style.visibility="hidden",document.body.appendChild(m),m.click(),document.body.removeChild(m)},F=A(()=>e(S).filter(s=>`${s.name} ${s.strategic_initiatives} ${s.kpi}`.toLowerCase().includes(e(y).toLowerCase())).sort((s,l)=>e(f)==="asc"?s[e(c)].localeCompare(l[e(c)]):l[e(c)].localeCompare(s[e(c)]))),N=A(()=>e(F).slice((e(n)-1)*e(d),e(n)*e(d))),J=A(()=>Math.ceil(e(F).length/e(d)));L();var R=Le(),j=o(a(R),2),G=a(j);ze(G,{get goals(){return e(p)},get selectedGoalId(){return e(i)},set selectedGoalId(s){_(i,z(s))},onSelect:K});var v=o(G,2),x=a(v),I=a(x);he(I,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",size:20});var O=o(I,2);me(O),t(x);var w=o(x,2);w.__click=H;var W=a(w);ye(W,{size:20}),de(),t(w),t(v),t(j);var U=o(j,2);ce(U,()=>e(b),s=>{var l=Ae();C(s,l)},s=>{var l=De(),M=_e(l),m=A(()=>e(p).find(ee=>ee.id===e(i)));Ee(M,{get items(){return e(N)},get sortField(){return e(c)},get sortDirection(){return e(f)},toggleSort:Q,get selectedGoal(){return e(m)}});var D=o(M,2),u=a(D),X=a(u);B(()=>h(X,`Showing ${(e(n)-1)*e(d)+1} to ${Math.min(e(n)*e(d),e(F).length)??""} of ${e(F).length??""} results`)),t(u);var V=o(u,2),P=a(V),q=a(P);q.value=(q.__value=5)==null?"":5;var Y=o(q);Y.value=(Y.__value=10)==null?"":10;var Z=o(Y);Z.value=(Z.__value=25)==null?"":25;var re=o(Z);re.value=(re.__value=50)==null?"":50,t(P);var oe=o(P,2),$=a(oe);$.__click=[je,n];var se=o($,2);se.__click=[Me,n],t(oe),t(V),t(D),B(()=>{$.disabled=e(n)===1,se.disabled=e(n)===e(J)}),ve(P,()=>e(d),ee=>_(d,ee)),C(s,l)}),t(R),ge(O,()=>e(y),s=>_(y,s)),C(g,R),ne()}ae(["click"]);export{et as component};