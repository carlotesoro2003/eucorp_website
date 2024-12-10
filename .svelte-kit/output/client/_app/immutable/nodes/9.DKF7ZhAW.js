import"../chunks/disclose-version.Bg9kRutz.js";import{p as K,a as N,b as R,g as r,f as d,m as O,c as m,s as L,r as l,t as Q,n as Y}from"../chunks/utils.CRNn4dtP.js";import{s as V}from"../chunks/render.xPn1qZIb.js";import{i as t}from"../chunks/if.CRsBAEFG.js";import{e as W,i as X}from"../chunks/each.v0RK4Yef.js";import{d as Z,a as e,t as w,c as p}from"../chunks/store.B1kL-7Ni.js";import{c as $}from"../chunks/svelte-component.CsbbSknF.js";import{s as rr}from"../chunks/class.CstC7PuZ.js";import{i as er}from"../chunks/lifecycle.DSkr6FdQ.js";import{p as ar}from"../chunks/preload-helper.Dwm_PvIR.js";import{s as tr}from"../chunks/supabaseClient.BTuNJN2N.js";import{A as sr,a as ir,b as or,D as nr,c as dr,d as lr,C as pr,T as vr,L as gr}from"../chunks/DeptOptMonitoring.CUr_b8a2.js";import{C as B}from"../chunks/circle-check.BO4zRICV.js";var mr=(q,P,M)=>R(P,r(M).id),cr=w("<button><!> <span> </span></button>"),fr=w('<div class="flex flex-col items-center justify-center py-12"><div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p></div>'),ur=w('<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"><!> <p>You do not have the required permissions to view this page.</p></div>'),_r=w('<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"><!> <p>Failed to load session or profile data. Please try refreshing the page.</p></div>'),br=w(`<div class="min-h-screen bg-gray-50 dark:bg-gray-900"><div class="container mx-auto px-4 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mid-year Monitoring Dashboard</h1> <p class="text-gray-600 dark:text-gray-400">Track and manage your organization's plans, risks, and opportunities</p></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6"><div class="flex flex-wrap gap-2 p-2"></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"><!></div></div></div>`);function Lr(q,P){K(P,!1);let M=ar(P,"data",8,null),D=O(null),c=O(null),E=O(!0),v=O("Plans");const G=[{id:"Plans",label:"Plans",icon:pr},{id:"Risks",label:"Risks",icon:vr},{id:"Opportunities",label:"Opportunities",icon:gr}];(async()=>{var g;try{if((g=M())!=null&&g.session){R(D,M().session);const{user:a}=r(D),{data:s,error:i}=await tr.from("profiles").select("role").eq("id",a.id).single();i?console.error("Error fetching user profile:",i.message):(R(c,s),console.log("Role in Opportunities: ",r(c)))}else console.warn("Session is not available or data is missing.")}catch(a){console.error("Error fetching user profile or session:",a)}finally{R(E,!1)}})(),er();var z=br(),U=m(z),A=L(m(U),2),j=m(A);W(j,5,()=>G,X,(g,a)=>{var s=cr();s.__click=[mr,v,a];var i=m(s);$(i,()=>r(a).icon,(h,f)=>{f(h,{size:18})});var o=L(i,2),b=m(o,!0);l(o),l(s),Q(()=>{rr(s,`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${(r(v)===r(a).id?"bg-primary hover:bg-primary/90 text-white":"hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300")??""}`),V(b,r(a).label)}),e(g,s)}),l(j),l(A);var F=L(A,2),H=m(F);t(H,()=>r(E),g=>{var a=fr();e(g,a)},g=>{var a=p(),s=d(a);t(s,()=>r(D)&&r(c),i=>{var o=p(),b=d(o);t(b,()=>r(c).role==="admin"||r(c).role==="vice_president"||r(c).role==="president",h=>{var f=p(),C=d(f);t(C,()=>r(v)==="Plans",u=>{sr(u,{})},u=>{var n=p(),x=d(n);t(x,()=>r(v)==="Risks",_=>{ir(_,{})},_=>{var y=p(),T=d(y);t(T,()=>r(v)==="Opportunities",k=>{or(k,{})},null,!0),e(_,y)},!0),e(u,n)}),e(h,f)},h=>{var f=p(),C=d(f);t(C,()=>r(c).role==="user",u=>{var n=p(),x=d(n);t(x,()=>r(v)==="Plans",_=>{nr(_,{})},_=>{var y=p(),T=d(y);t(T,()=>r(v)==="Risks",k=>{dr(k,{})},k=>{var S=p(),I=d(S);t(I,()=>r(v)==="Opportunities",J=>{lr(J,{})},null,!0),e(k,S)},!0),e(_,y)}),e(u,n)},u=>{var n=ur(),x=m(n);B(x,{size:24}),Y(2),l(n),e(u,n)},!0),e(h,f)}),e(i,o)},i=>{var o=_r(),b=m(o);B(b,{size:24}),Y(2),l(o),e(i,o)},!0),e(g,a)}),l(F),l(U),l(z),e(q,z),N()}Z(["click"]);export{Lr as component};
