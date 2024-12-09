import"../chunks/disclose-version.Bg9kRutz.js";import{p as N,c as i,r as a,s as o,t as z,a as O,b as r,aF as p,g as e,a2 as oe,f as pe,n as ge,O as V}from"../chunks/runtime.CLSstnwU.js";import{d as Y,a as j,t as D}from"../chunks/utils.kA-YjkFf.js";import{i as be}from"../chunks/lifecycle.V0dJQ05z.js";import{o as _e}from"../chunks/index-client.DT-fMr9Z.js";/* empty css                         */import{s as P}from"../chunks/supabaseClient.CaMOPPuz.js";import{s as T}from"../chunks/render.D17u6ZCY.js";import{i as W}from"../chunks/if.b2Q-jNLG.js";import{e as xe,i as he}from"../chunks/each.sV1uapQk.js";import{r as le}from"../chunks/attributes.DiUoHvyc.js";import{s as ye}from"../chunks/class.9GukHOdr.js";import{b as ne}from"../chunks/input.CQDk-SFX.js";import{b as we}from"../chunks/select.BAP3DC-4.js";import{p as E}from"../chunks/proxy.D-58ufVl.js";import{p as Ce}from"../chunks/props.BD0jg91j.js";import{X as ke}from"../chunks/x.DXpGL3Re.js";import{P as Ee}from"../chunks/pencil.5iKfE7p4.js";import{T as Se}from"../chunks/trash-2.DXHXJoNa.js";import{S as je}from"../chunks/search.4XRWJUve.js";import{P as De}from"../chunks/plus.WugTGZSv.js";const Me=async(v,t,d,c)=>{r(t,!0),await d.onSubmit(c)||r(t,!1)};var Pe=D('<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg"><!></button> <h2 class="text-xl font-bold mb-4"> </h2> <div class="flex flex-col gap-4"><div class="flex flex-col gap-2"><label for="name">Classification Name</label> <input id="name" type="text" class="px-3 py-2 bg-secondary border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter classification name"></div> <div class="flex justify-end gap-2 mt-4"><button class="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button> <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"> </button></div></div></div></div>');function ze(v,t){N(t,!0);let d=Ce(t,"isEditing",3,!1),c=p(!1),n=E({...t.classification});var m=Pe(),g=i(m),u=i(g);u.__click=function(...C){var k;(k=t.onClose)==null||k.apply(this,C)};var x=i(u);ke(x,{size:20}),a(u);var y=o(u,2),_=i(y,!0);a(y);var f=o(y,2),b=i(f),S=o(i(b),2);le(S),a(b);var A=o(b,2),L=i(A);L.__click=function(...C){var k;(k=t.onClose)==null||k.apply(this,C)};var w=o(L,2);w.__click=[Me,c,t,n];var h=i(w,!0);a(w),a(A),a(f),a(g),a(m),z(()=>{T(_,d()?"Edit Classification":"Add Classification"),w.disabled=e(c)||!n.name,T(h,e(c)?"Saving...":"Save")}),ne(S,()=>n.name,C=>n.name=C),j(v,m),O()}Y(["click"]);const Te=async(v,t,d)=>{t.classification.id!==null&&(r(d,!0),await t.onDelete(t.classification.id),r(d,!1))};var Ae=(v,t)=>t.onEdit(t.classification),Le=D('<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"><div class="flex justify-between items-start gap-4"><h3 class="text-lg font-medium break-words flex-1"> </h3> <div class="flex gap-2 shrink-0"><button class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit"><!></button> <button class="hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete"><!></button></div></div></div>');function qe(v,t){N(t,!0);let d=p(!1);var c=Le(),n=i(c),m=i(n),g=i(m,!0);a(m);var u=o(m,2),x=i(u);x.__click=[Ae,t];var y=i(x);Ee(y,{size:18}),a(x);var _=o(x,2);_.__click=[Te,t,d];var f=i(_);Se(f,{size:18}),a(_),a(u),a(n),a(c),z(()=>{T(g,t.classification.name),_.disabled=e(d)}),j(v,c),O()}Y(["click"]);var Fe=D("<div><span> </span></div>"),Ne=(v,t)=>t(),Oe=D('<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),Qe=(v,t)=>r(t,e(t)-1),Ue=(v,t)=>r(t,e(t)+1),Xe=D('<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground"> </div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option>6 per page</option><option>12 per page</option><option>24 per page</option><option>48 per page</option></select> <div class="flex gap-2"><button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>',1),Be=D('<div class="flex flex-col gap-4 container mx-auto "><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Classifications Management</h2></div> <!> <div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="relative flex-1 w-full md:max-w-[300px]"><!> <input type="text" placeholder="Search classifications..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center whitespace-nowrap w-full md:w-auto"><!> Add Classification</button></div> <!> <!></div>');function Ge(v,t){N(t,!0);let d=p(E([])),c=p(E({id:null,name:""})),n=p(!1),m=p(!1),g=p(""),u=p(!1),x=p(""),y=p("success"),_=p(!1),f=p(1),b=p(6);const S=V(()=>e(d).filter(s=>s.name.toLowerCase().includes(e(g).toLowerCase()))),A=V(()=>e(S).slice((e(f)-1)*e(b),e(f)*e(b))),L=V(()=>Math.ceil(e(S).length/e(b))),w=async()=>{r(_,!0);const{data:s,error:l}=await P.from("classification").select("id, name");l?h("Error fetching classifications.","error"):r(d,E(s||[])),r(_,!1)},h=(s,l="success")=>{r(x,E(s)),r(y,E(l)),r(u,!0),setTimeout(()=>r(u,!1),3e3)},C=(s={id:null,name:""})=>{r(c,E({...s})),r(m,s.id!==null),r(n,!0)},k=()=>{r(n,!1),r(c,E({id:null,name:""}))},ce=async s=>{if(e(m)&&s.id!==null){const{error:l}=await P.from("classification").update({name:s.name}).eq("id",s.id);if(l)return h("Error updating classification.","error"),!1;h("Classification updated successfully.")}else{const{error:l}=await P.from("classification").insert({name:s.name});if(l)return h("Error adding classification.","error"),!1;h("Classification added successfully.")}return await w(),k(),!0},de=async s=>{const{error:l}=await P.from("classification").delete().eq("id",s);l?h("Error deleting classification.","error"):(h("Classification deleted successfully."),await w())};oe(()=>{e(g)&&r(f,1)}),oe(()=>{w()});var Q=Be(),Z=o(i(Q),2);W(Z,()=>e(u),s=>{var l=Fe(),M=i(l),q=i(M,!0);a(M),a(l),z(()=>{ye(l,`p-4 rounded-lg ${(e(y)==="success"?"bg-green-600":"bg-red-600")??""} text-white`),T(q,e(x))}),j(s,l)});var U=o(Z,2),X=i(U),$=i(X);je($,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",size:20});var ee=o($,2);le(ee),a(X);var B=o(X,2);B.__click=[Ne,C];var ue=i(B);De(ue,{size:20}),ge(),a(B),a(U);var te=o(U,2);W(te,()=>e(_),s=>{var l=Oe();j(s,l)},s=>{var l=Xe(),M=pe(l);xe(M,21,()=>e(A),he,(R,me)=>{qe(R,{get classification(){return e(me)},onEdit:C,onDelete:de})}),a(M);var q=o(M,2),G=i(q),ve=i(G);z(()=>T(ve,`Showing ${(e(f)-1)*e(b)+1} to ${Math.min(e(f)*e(b),e(S).length)??""} of ${e(S).length??""} results`)),a(G);var ae=o(G,2),F=i(ae),H=i(F);H.value=(H.__value=6)==null?"":6;var I=o(H);I.value=(I.__value=12)==null?"":12;var J=o(I);J.value=(J.__value=24)==null?"":24;var ie=o(J);ie.value=(ie.__value=48)==null?"":48,a(F);var se=o(F,2),K=i(se);K.__click=[Qe,f];var re=o(K,2);re.__click=[Ue,f],a(se),a(ae),a(q),z(()=>{K.disabled=e(f)===1,re.disabled=e(f)===e(L)}),we(F,()=>e(b),R=>r(b,R)),j(s,l)});var fe=o(te,2);W(fe,()=>e(n),s=>{ze(s,{get isEditing(){return e(m)},get classification(){return e(c)},onClose:k,onSubmit:ce})}),a(Q),ne(ee,()=>e(g),s=>r(g,s)),j(v,Q),O()}Y(["click"]);var He=D('<main class="container mx-auto min-h-screen p-4"><!></main>');function ft(v,t){N(t,!1);const d=async()=>{const{data:g,error:u}=await P.from("classification").select("id, name");u&&c("Error fetching classifications.","error")},c=(g,u="success")=>{setTimeout(()=>!1,3e3)};_e(async()=>{await d()}),be();var n=He(),m=i(n);Ge(m,{}),a(n),j(v,n),O()}export{ft as component};
