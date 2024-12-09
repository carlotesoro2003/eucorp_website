import"../chunks/disclose-version.Bg9kRutz.js";import{p as Q,aF as u,t as T,b as n,g as e,a as V,c as r,r as t,s as l,f as ke,n as me,O as $}from"../chunks/runtime.CLSstnwU.js";import{e as Se,a as k,t as S,d as ve}from"../chunks/utils.kA-YjkFf.js";import{i as Ee}from"../chunks/lifecycle.V0dJQ05z.js";import{o as fe}from"../chunks/index-client.DT-fMr9Z.js";/* empty css                         */import{s as P}from"../chunks/supabaseClient.CaMOPPuz.js";import{s as L}from"../chunks/render.D17u6ZCY.js";import{i as ee}from"../chunks/if.b2Q-jNLG.js";import{e as je}from"../chunks/each.sV1uapQk.js";import{r as te}from"../chunks/attributes.DiUoHvyc.js";import{s as Ce}from"../chunks/class.9GukHOdr.js";import{b as re}from"../chunks/input.CQDk-SFX.js";import{b as Ae}from"../chunks/select.BAP3DC-4.js";import{p as N}from"../chunks/proxy.D-58ufVl.js";import{p as Ne}from"../chunks/props.BD0jg91j.js";import{P as ze}from"../chunks/pencil.5iKfE7p4.js";import{T as Le}from"../chunks/trash-2.DXHXJoNa.js";import{S as Me}from"../chunks/search.4XRWJUve.js";import{D as Pe}from"../chunks/download.DXjW2liV.js";import{P as Te}from"../chunks/plus.WugTGZSv.js";import{X as Fe}from"../chunks/x.DXpGL3Re.js";var qe=S('<form class="space-y-4"><h3 class="text-lg font-semibold"> </h3> <div class="space-y-2"><label for="fullName" class="text-sm font-medium">Full Name</label> <input id="fullName" type="text" required class="w-full px-3 py-2 rounded-lg bg-secondary border-secondary focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter full name..."></div> <div class="space-y-2"><label for="name" class="text-sm font-medium">Short Name</label> <input id="name" type="text" required class="w-full px-3 py-2 rounded-lg bg-secondary border-secondary focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter short name..."></div> <button type="submit" class="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"> </button></form>');function Ue(b,a){var F,q;Q(a,!0);let d=Ne(a,"department",3,null),m=u(N(((F=d())==null?void 0:F.name)??"")),i=u(N(((q=d())==null?void 0:q.full_name)??""));const v=p=>{var j;p.preventDefault(),a.onSave({id:((j=d())==null?void 0:j.id)??null,name:e(m),full_name:e(i)})};var c=qe(),f=r(c),E=r(f);t(f);var _=l(f,2),w=l(r(_),2);te(w),t(_);var g=l(_,2),D=l(r(g),2);te(D),t(g);var y=l(g,2),h=r(y);t(y),t(c),T(()=>{L(E,`${(d()?"Edit":"Add")??""} Department`),y.disabled=a.isSaving,L(h,`${(a.isSaving?"Saving...":d()?"Update":"Add")??""} Department`)}),Se("submit",c,v),re(w,()=>e(i),p=>n(i,p)),re(D,()=>e(m),p=>n(m,p)),k(b,c),V()}var Oe=(b,a)=>a.onDelete(a.department.id),Re=S('<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow"><div class="space-y-4"><h3 class="text-lg font-medium truncate"> </h3> <div class="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"> </div> <div class="flex justify-end gap-2 pt-4"><button class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit department"><!></button> <button class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete department"><!></button></div></div></div>');function Be(b,a){Q(a,!0);var d=Re(),m=r(d),i=r(m),v=r(i,!0);t(i);var c=l(i,2),f=r(c,!0);t(c);var E=l(c,2),_=r(E);_.__click=function(...y){var h;(h=a.onEdit)==null||h.apply(this,y)};var w=r(_);ze(w,{size:18}),t(_);var g=l(_,2);g.__click=[Oe,a];var D=r(g);Le(D,{size:18}),t(g),t(E),t(m),t(d),T(()=>{L(v,a.department.full_name),L(f,a.department.name),g.disabled=a.isDeleting}),k(b,d),V()}ve(["click"]);var Qe=S("<div> </div>"),Ve=(b,a,d)=>{n(a,null),n(d,!0)},Xe=S('<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),Ge=(b,a)=>n(a,e(a)-1),He=(b,a)=>n(a,e(a)+1),Ie=S('<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg"><!></button> <!></div></div>'),Je=S('<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground"> </div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option>6 per page</option><option>12 per page</option><option>24 per page</option><option>48 per page</option></select> <div class="flex gap-2"><button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div> <!>',1),Ke=S('<div class="flex flex-col gap-4 container mx-auto"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Departments Management</h2></div> <!> <div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="relative flex-1 w-full md:max-w-[300px]"><!> <input type="text" placeholder="Search departments..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <div class="flex gap-2 w-full md:w-auto"><button class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial"><!> Export</button> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial"><!> Add Department</button></div></div> <!></div>');function We(b,a){Q(a,!0);let d=u(N([])),m=u(""),i=u(1),v=u(6),c=u(!1),f=u(null),E=u(""),_=u("success"),w=u(!1),g=u(!1),D=u(!1),y=u(!1);fe(async()=>{await j()});const h=$(()=>e(d).filter(o=>o.name.toLowerCase().includes(e(m).toLowerCase())||o.full_name.toLowerCase().includes(e(m).toLowerCase())).sort((o,s)=>o.full_name.localeCompare(s.full_name))),F=$(()=>e(h).slice((e(i)-1)*e(v),e(i)*e(v))),q=$(()=>Math.ceil(e(h).length/e(v))),p=(o,s="success")=>{n(E,N(o)),n(_,N(s)),n(w,!0),setTimeout(()=>n(w,!1),3e3)},j=async()=>{n(y,!0);const{data:o,error:s}=await P.from("departments").select("id, name, full_name");s?p("Error fetching departments","error"):n(d,N(o)),n(y,!1)},pe=()=>{const s=[["Name","Full Name"].join(","),...e(d).map(O=>[O.name,O.full_name].join(","))].join(`
`),C=new Blob([s],{type:"text/csv;charset=utf-8;"}),x=document.createElement("a"),M=URL.createObjectURL(C);x.setAttribute("href",M),x.setAttribute("download","departments.csv"),x.style.visibility="hidden",document.body.appendChild(x),x.click(),document.body.removeChild(x)},X=()=>{n(c,!1),n(f,null)},ge=async o=>{if(n(g,!0),o.id){const{error:s}=await P.from("departments").update({name:o.name,full_name:o.full_name}).eq("id",o.id);s?p("Error updating department","error"):(p("Department updated successfully"),await j(),X())}else{const{error:s}=await P.from("departments").insert({name:o.name,full_name:o.full_name});s?p("Error adding department","error"):(p("Department added successfully"),await j(),X())}n(g,!1)},be=async o=>{n(D,!0);const{error:s}=await P.from("departments").delete().eq("id",o);s?p("Error deleting department","error"):(p("Department deleted successfully"),await j()),n(D,!1)};var G=Ke(),ae=l(r(G),2);ee(ae,()=>e(w),o=>{var s=Qe(),C=r(s,!0);t(s),T(()=>{Ce(s,`p-4 rounded-lg ${e(_)==="success"?"bg-green-500/10 text-green-500":"bg-red-500/10 text-red-500"}`),L(C,e(E))}),k(o,s)});var H=l(ae,2),I=r(H),oe=r(I);Me(oe,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",size:20});var se=l(oe,2);te(se),t(I);var ne=l(I,2),U=r(ne);U.__click=pe;var _e=r(U);Pe(_e,{size:20}),me(),t(U);var J=l(U,2);J.__click=[Ve,f,c];var xe=r(J);Te(xe,{size:20}),me(),t(J),t(ne),t(H);var ye=l(H,2);ee(ye,()=>e(y),o=>{var s=Xe();k(o,s)},o=>{var s=Je(),C=ke(s);je(C,21,()=>e(F),A=>A.id,(A,z)=>{Be(A,{get department(){return e(z)},get isDeleting(){return e(D)},onEdit:()=>{n(f,N(e(z))),n(c,!0)},onDelete:be})}),t(C);var x=l(C,2),M=r(x),O=r(M);T(()=>L(O,`Showing ${(e(i)-1)*e(v)+1} to ${Math.min(e(i)*e(v),e(h).length)??""} of ${e(h).length??""} results`)),t(M);var le=l(M,2),R=r(le),K=r(R);K.value=(K.__value=6)==null?"":6;var W=l(K);W.value=(W.__value=12)==null?"":12;var Y=l(W);Y.value=(Y.__value=24)==null?"":24;var ie=l(Y);ie.value=(ie.__value=48)==null?"":48,t(R);var de=l(R,2),Z=r(de);Z.__click=[Ge,i];var ce=l(Z,2);ce.__click=[He,i],t(de),t(le),t(x);var he=l(x,2);ee(he,()=>e(c),A=>{var z=Ie(),ue=r(z),B=r(ue);B.__click=X;var we=r(B);Fe(we,{size:20}),t(B);var De=l(B,2);Ue(De,{get department(){return e(f)},get isSaving(){return e(g)},onSave:ge}),t(ue),t(z),k(A,z)}),T(()=>{Z.disabled=e(i)===1,ce.disabled=e(i)===e(q)}),Ae(R,()=>e(v),A=>n(v,A)),k(o,s)}),t(G),re(se,()=>e(m),o=>n(m,o)),k(b,G),V()}ve(["click"]);var Ye=S('<main class="container mx-auto min-h-screen p-4"><!></main>');function yt(b,a){Q(a,!1),fe(async()=>{await d()});const d=async()=>{const{data:c,error:f}=await P.from("departments").select("id, name, full_name");f&&m("Error fetching departments","error")},m=(c,f="success")=>{setTimeout(()=>!1,3e3)};Ee();var i=Ye(),v=r(i);We(v,{}),t(i),k(b,i),V()}export{yt as component};
