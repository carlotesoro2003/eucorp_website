import"../chunks/disclose-version.Bg9kRutz.js";import{p as ot,b as n,g as s,a as lt,d as y,c as a,s as l,r,t as M,e as it,H as ct,f as nt,n as vt}from"../chunks/utils.CRNn4dtP.js";import{a as b,t as p,f as gt,d as ut,c as mt}from"../chunks/store.B1kL-7Ni.js";import{i as Z}from"../chunks/if.CRsBAEFG.js";import{a as v}from"../chunks/preload-helper.Dwm_PvIR.js";import{o as ft}from"../chunks/index-client.BdGz_wQc.js";import{s as F}from"../chunks/supabaseClient.BTuNJN2N.js";import{s as m}from"../chunks/render.xPn1qZIb.js";import{e as rt,i as at}from"../chunks/each.v0RK4Yef.js";import{r as yt}from"../chunks/attributes.BcfEV1VJ.js";import{b as bt}from"../chunks/input.o7SqHMM4.js";import{S as ht}from"../chunks/search.B4Eo5Hu8.js";import{b as st}from"../chunks/select.CgyWjfO5.js";import{c as kt}from"../chunks/riskCalculator.D3oLOKg6.js";import{X as xt}from"../chunks/x.DaAqSZOK.js";var _t=p('<tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"><td class="px-6 py-4 font-medium"> </td><td class="px-6 py-4"> </td><td class="px-6 py-4"> </td><td class="px-6 py-4"> </td><td class="px-6 py-4"> </td><td class="px-6 py-4"> </td><td class="px-6 py-4"><button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"> </button></td></tr>'),pt=p('<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"><div class="p-4 border-b dark:border-gray-700"><div class="flex items-center gap-2"><div class="relative flex-1"><!> <input type="text" placeholder="Search risks..." class="pl-10 w-full h-10 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"></div></div></div> <div class="overflow-x-auto"><table class="w-full text-sm text-left"><thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700"><tr><th class="px-6 py-3">RRN</th><th class="px-6 py-3">Risk Statement</th><th class="px-6 py-3">Classification</th><th class="px-6 py-3">Actions</th><th class="px-6 py-3">Key Persons</th><th class="px-6 py-3">Budget</th><th class="px-6 py-3">Assessment</th></tr></thead><tbody></tbody></table></div></div>');function Rt(D,o){ot(o,!0);let i=y(""),h=it(()=>o.savedRisks.filter(R=>R.rrn.toLowerCase().includes(s(i).toLowerCase())||R.risk_statement.toLowerCase().includes(s(i).toLowerCase())));var g=pt(),k=a(g),u=a(k),x=a(u),w=a(x);ht(w,{class:"absolute left-3 top-2.5 h-5 w-5 text-gray-400"});var H=l(w,2);yt(H),r(x),r(u),r(k);var j=l(k,2),V=a(j),N=l(a(V));rt(N,21,()=>s(h),at,(R,c)=>{var P=_t(),A=a(P),z=a(A,!0);r(A);var T=l(A),B=a(T,!0);r(T);var K=l(T),Q=a(K,!0);M(()=>{var S;return m(Q,((S=o.classification.find(J=>J.id===s(c).classification))==null?void 0:S.name)||"N/A")}),r(K);var E=l(K),O=a(E,!0);r(E);var X=l(E),G=a(X,!0);r(X);var U=l(X),$=a(U);r(U);var I=l(U),L=a(I);M(()=>L.disabled=o.riskAssessments.some(S=>S.risk_id===s(c).id));var q=a(L,!0);M(()=>m(q,o.riskAssessments.some(S=>S.risk_id===s(c).id)?"Assessed":"Add Assessment")),r(L),r(I),r(P),M(()=>{m(z,s(c).rrn),m(B,s(c).risk_statement),m(O,s(c).actions),m(G,s(c).key_persons),m($,`$${s(c).budget??""}`)}),gt("click",L,()=>o.onAssess(s(c))),b(R,P)}),r(N),r(V),r(j),r(g),bt(H,()=>s(i),R=>n(i,R)),b(D,g),lt()}const wt=async(D,o,i)=>{var h;try{const{error:g}=await F.from("risk_assessment").insert({risk_id:(h=o.selectedRisk)==null?void 0:h.id,lr:i.likelihoodRating,s:i.severity,rcr:i.riskControlRating,rmr:i.riskMonitoringRating});if(g)throw g;o.onSuccess("Assessment saved successfully"),o.onClose()}catch{o.onError("Failed to save assessment")}};var Ct=p("<option> </option>"),Mt=p("<option> </option>"),At=p('<div class="flex items-center gap-2"><span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold"> </span> <span class="text-gray-900 dark:text-gray-100"> </span></div>'),St=p('<p class="text-gray-500 dark:text-gray-400">Select likelihood and severity first</p>'),Ft=p("<option> </option>"),Dt=p('<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full shadow-xl"><div class="flex items-center justify-between p-6 border-b dark:border-gray-700"><div><h2 class="text-xl font-semibold text-gray-900 dark:text-white">Risk Assessment</h2> <p class="mt-1 text-sm text-gray-500 dark:text-gray-400"> </p></div> <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"><!></button></div> <div class="p-6 space-y-6"><div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Statement</h3> <p class="mt-1 text-sm text-gray-900 dark:text-gray-100"> </p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Likelihood Rating</label> <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"><option>Select likelihood</option><!></select></div> <div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Severity</label> <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"><option>Select severity</option><!></select></div></div> <div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Risk Control Rating</label> <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><!></div></div> <div class="space-y-2"><label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Monitoring Rating</label> <select class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"><option>Select monitoring rating</option><!></select></div></div> <div class="flex items-center justify-end gap-3 p-6 border-t dark:border-gray-700"><button class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button> <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Save Assessment</button></div></div></div>');function Nt(D,o){ot(o,!0);let i=v({likelihoodRating:null,severity:null,riskControlRating:null,riskMonitoringRating:null});const h=it(()=>i.likelihoodRating!==null&&i.severity!==null&&i.riskControlRating!==null&&i.riskMonitoringRating!==null);ct(()=>{var e,t;if(i.likelihoodRating&&i.severity){const d=(e=o.likelihoodRating.find(_=>_.id===i.likelihoodRating))==null?void 0:e.symbol,f=(t=o.severity.find(_=>_.id===i.severity))==null?void 0:t.value;if(d&&f){const _=kt(d,f),C=o.riskControlRating.find(W=>W.symbol===_.controlRating);i.riskControlRating=(C==null?void 0:C.id)||null}}});var g=Dt(),k=a(g),u=a(k),x=a(u),w=l(a(x),2),H=a(w);r(w),r(x);var j=l(x,2);j.__click=function(...e){var t;(t=o.onClose)==null||t.apply(this,e)};var V=a(j);xt(V,{class:"h-5 w-5"}),r(j),r(u);var N=l(u,2),R=a(N),c=l(a(R),2),P=a(c,!0);r(c),r(R);var A=l(R,2),z=a(A),T=l(a(z),2),B=a(T);B.value=(B.__value=null)==null?"":null;var K=l(B);rt(K,17,()=>o.likelihoodRating,at,(e,t)=>{var d=Ct(),f={},_=a(d);r(d),M(()=>{f!==(f=s(t).id)&&(d.value=(d.__value=s(t).id)==null?"":s(t).id),m(_,`${s(t).symbol??""} - ${s(t).name??""}`)}),b(e,d)}),r(T),r(z);var Q=l(z,2),E=l(a(Q),2),O=a(E);O.value=(O.__value=null)==null?"":null;var X=l(O);rt(X,17,()=>o.severity,at,(e,t)=>{var d=Mt(),f={},_=a(d);r(d),M(()=>{f!==(f=s(t).id)&&(d.value=(d.__value=s(t).id)==null?"":s(t).id),m(_,`${s(t).value??""} - ${s(t).name??""}`)}),b(e,d)}),r(E),r(Q),r(A);var G=l(A,2),U=l(a(G),2),$=a(U);Z($,()=>i.riskControlRating,e=>{var t=At();const d=it(()=>o.riskControlRating.find(Y=>Y.id===i.riskControlRating));var f=a(t),_=a(f,!0);r(f);var C=l(f,2),W=a(C,!0);r(C),r(t),M(()=>{var Y,dt;m(_,(Y=s(d))==null?void 0:Y.symbol),m(W,(dt=s(d))==null?void 0:dt.name)}),b(e,t)},e=>{var t=St();b(e,t)}),r(U),r(G);var I=l(G,2),L=l(a(I),2),q=a(L);q.value=(q.__value=null)==null?"":null;var S=l(q);rt(S,17,()=>o.riskMonitoringRating,at,(e,t)=>{var d=mt(),f=nt(d);Z(f,()=>s(t).status==="New Risk",_=>{var C=Ft(),W={},Y=a(C,!0);r(C),M(()=>{W!==(W=s(t).id)&&(C.value=(C.__value=s(t).id)==null?"":s(t).id),m(Y,s(t).status)}),b(_,C)}),b(e,d)}),r(L),r(I),r(N);var J=l(N,2),tt=a(J);tt.__click=function(...e){var t;(t=o.onClose)==null||t.apply(this,e)};var et=l(tt,2);et.__click=[wt,o,i],r(J),r(k),r(g),M(()=>{var e,t;m(H,`RRN: ${((e=o.selectedRisk)==null?void 0:e.rrn)??""}`),m(P,(t=o.selectedRisk)==null?void 0:t.risk_statement),et.disabled=!s(h)}),st(T,()=>i.likelihoodRating,e=>i.likelihoodRating=e),st(E,()=>i.severity,e=>i.severity=e),st(L,()=>i.riskMonitoringRating,e=>i.riskMonitoringRating=e),b(D,g),lt()}ut(["click"]);var Lt=p('<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"><p> </p></div>'),jt=p('<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"><p> </p></div>'),Pt=p("<!> <!>",1);function Tt(D,o){var i=Pt(),h=nt(i);Z(h,()=>o.successMessage,k=>{var u=Lt(),x=a(u),w=a(x,!0);r(x),r(u),M(()=>m(w,o.successMessage)),b(k,u)});var g=l(h,2);Z(g,()=>o.errorMessage,k=>{var u=jt(),x=a(u),w=a(x,!0);r(x),r(u),M(()=>m(w,o.errorMessage)),b(k,u)}),b(D,i)}var Et=p('<header class="bg-white dark:bg-gray-800 shadow-sm"><div class="container mx-auto px-4 py-6"><h1 class="text-3xl font-bold text-gray-900 dark:text-white"> </h1> <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Manage and assess department risks</p></div></header>');function qt(D,o){var i=Et(),h=a(i),g=a(h),k=a(g);r(g),vt(2),r(h),r(i),M(()=>m(k,`${o.departmentName??""} Risk Register`)),b(D,i)}var Ht=p('<div class="flex justify-center items-center min-h-[400px]"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>'),Ut=p("<!> <!>",1),Vt=p('<div class="min-h-screen bg-gray-50 dark:bg-gray-900"><!> <main class="container mx-auto px-4 py-8"><!> <!></main></div>');function re(D,o){ot(o,!0),v([]);let i=y(v([])),h=y(v([])),g=y(v([])),k=y(v([])),u=y(v([])),x=y(v([])),w=y(v([])),H=y(null),j=y(null),V=y(""),N=y(!0),R=y(null),c=y(null),P=y(!1),A=y(null);const z=async()=>{try{await Promise.all([O(),X(),T(),B(),K(),Q(),E()])}catch{n(c,"Failed to fetch data. Please refresh the page.")}},T=async()=>{const{data:e,error:t}=await F.from("classification").select("*");if(t)throw t;n(g,v(e))},B=async()=>{try{const{data:e,error:t}=await F.from("likelihood_rating").select("*");if(t)throw t;n(k,v(e))}catch{n(c,"Failed to fetch likelihood rating.")}},K=async()=>{try{const{data:e,error:t}=await F.from("severity").select("*");if(t)throw t;n(u,v(e))}catch{n(c,"Failed to fetch severity.")}},Q=async()=>{try{const{data:e,error:t}=await F.from("risk_control_rating").select("*");if(t)throw t;n(x,v(e))}catch{n(c,"Failed to fetch risk control rating.")}},E=async()=>{try{const{data:e,error:t}=await F.from("risk_monitoring_rating").select("*");if(t)throw t;n(w,v(e))}catch{n(c,"Failed to fetch risk monitoring rating.")}},O=async()=>{try{const{data:e,error:t}=await F.from("risks").select("*").order("rrn",{ascending:!0});if(t)throw t;n(i,v(e))}catch{n(c,"Failed to fetch saved risks.")}},X=async()=>{try{const{data:e,error:t}=await F.from("risk_assessment").select("*");if(t)throw t;n(h,v(e))}catch{n(c,"Failed to fetch risk assessments.")}},G=async()=>{n(N,!0);try{const{data:e}=await F.auth.getSession();if(n(H,v(e.session)),s(H)){const{data:t}=await F.from("profiles").select("id, department_id").eq("id",s(H).user.id).single();n(j,v(t));const{data:d}=await F.from("departments").select("name").eq("id",s(j).department_id).single();n(V,v(d?d.name:"Unknown Department")),await z()}}catch{n(c,"Failed to load profile. Please try again.")}finally{n(N,!1)}},U=e=>{n(A,v(e)),n(P,!0)},$=()=>{n(P,!1),n(A,null)},I=e=>{n(R,v(e)),setTimeout(()=>n(R,null),3e3)},L=e=>{n(c,v(e)),setTimeout(()=>n(c,null),3e3)};ft(()=>{G()});var q=Vt(),S=a(q);qt(S,{get departmentName(){return s(V)}});var J=l(S,2),tt=a(J);Tt(tt,{get successMessage(){return s(R)},get errorMessage(){return s(c)}});var et=l(tt,2);Z(et,()=>s(N),e=>{var t=Ht();b(e,t)},e=>{var t=Ut(),d=nt(t);Rt(d,{get savedRisks(){return s(i)},get classification(){return s(g)},get riskAssessments(){return s(h)},onAssess:U});var f=l(d,2);Z(f,()=>s(P),_=>{Nt(_,{get selectedRisk(){return s(A)},get likelihoodRating(){return s(k)},get severity(){return s(u)},get riskControlRating(){return s(x)},get riskMonitoringRating(){return s(w)},onClose:$,onSuccess:I,onError:L})}),b(e,t)}),r(J),r(q),b(D,q),lt()}export{re as component};
