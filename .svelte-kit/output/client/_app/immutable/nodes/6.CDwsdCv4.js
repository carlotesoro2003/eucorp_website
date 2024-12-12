import"../chunks/disclose-version.Bg9kRutz.js";import{f as Y,p as q,e as b,c as t,r as a,s as d,t as z,b as l,g as e,a as C,J as ze,n as ve,h as U}from"../chunks/utils.Cx6K9qTo.js";import{e as ue,a as _,g as Ee,t as h,b as j,d as me}from"../chunks/store.BALTJZ26.js";import{i as je}from"../chunks/lifecycle.D0tpf3vC.js";import{o as Pe}from"../chunks/index-client.lWLCSZVk.js";import{I as Me,a as Fe,s as A}from"../chunks/Icon.Nl6wOSVO.js";import{i as N}from"../chunks/if.Bgpzl8Wa.js";import{r as fe,e as Ne}from"../chunks/attributes.rzeD2olC.js";import{b as pe}from"../chunks/input.BVFrb_g3.js";import{b as Ae}from"../chunks/select.BtlRD387.js";import{l as De,s as Ue,a as E}from"../chunks/preload-helper.Tg4Km7Zr.js";import{U as qe}from"../chunks/user.CufSo2Fj.js";import{P as Ce}from"../chunks/pencil.Brzv4RaD.js";import{T as Te}from"../chunks/trash-2.d9YwO6MY.js";import{S as Ie}from"../chunks/search.BpYLThKw.js";import{A as $e}from"../chunks/arrow-up-down.CZ0J7o1e.js";import{P as Je}from"../chunks/plus.Dop3u5ke.js";import{X as Qe}from"../chunks/x.D9PBK57y.js";function Xe(u,r){const c=De(r,["children","$$slots","$$events","$$legacy"]);Me(u,Ue({name:"users-round"},()=>c,{iconNode:[["path",{d:"M18 21a8 8 0 0 0-16 0"}],["circle",{cx:"10",cy:"8",r:"5"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"}]],children:(i,f)=>{var m=ue(),v=Y(m);Fe(v,r,"default",{}),_(i,m)},$$slots:{default:!0}}))}var Be=h('<form class="flex flex-col gap-4"><h3 class="text-xl font-semibold"> </h3> <div class="flex flex-col gap-2"><label for="name" class="font-medium">Name</label> <input id="name" type="text" required class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter name"></div> <button type="submit" class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 mt-4"> </button></form>');function Ge(u,r){var g;q(r,!0);let c=b(E(((g=r.lead)==null?void 0:g.name)??""));const n=x=>{x.preventDefault(),r.onSave({name:e(c)})};var i=Be(),f=t(i),m=t(f);a(f);var v=d(f,2),y=d(t(v),2);fe(y),a(v);var w=d(v,2),p=t(w);a(w),a(i),z(()=>{j(m,`${(r.lead?"Edit":"Add")??""} Lead`),j(p,`${(r.lead?"Update":"Add")??""} Lead`)}),Ee("submit",i,n),pe(y,()=>e(c),x=>l(c,x)),_(u,i),C()}var He=(u,r)=>r.onEdit(r.lead),Ke=(u,r)=>r.onDelete(r.lead.id),Oe=h('<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"><div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><!></div> <div><h3 class="text-lg font-medium break-words"> </h3></div></div> <div class="flex items-center gap-2"><button class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit"><!></button> <button class="p-1.5 hover:bg-muted rounded-lg text-red-400" title="Delete"><!></button></div></div></div>');function Re(u,r){q(r,!0);var c=Oe(),n=t(c),i=t(n),f=t(i),m=t(f);qe(m,{size:20}),a(f);var v=d(f,2),y=t(v),w=t(y,!0);a(y),a(v),a(i);var p=d(i,2),g=t(p);g.__click=[He,r];var x=t(g);Ce(x,{size:16}),a(g);var P=d(g,2);P.__click=[Ke,r];var T=t(P);Te(T,{size:16}),a(P),a(p),a(n),a(c),z(()=>j(w,r.lead.name)),_(u,c),C()}me(["click"]);const Ve=(u,r)=>{l(r,E(e(r)==="asc"?"desc":"asc"))};var We=h('<div class="bg-green-500/20 text-green-400 p-4 rounded-lg"> </div>'),Ye=h('<div class="bg-red-500/20 text-red-400 p-4 rounded-lg"> </div>'),Ze=(u,r,c)=>{l(r,null),l(c,!0)},er=h('<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),rr=h('<div class="text-center p-8 bg-card rounded-lg border border-border">No leads found.</div>'),ar=(u,r)=>l(r,e(r)-1),tr=(u,r)=>l(r,e(r)+1),or=h('<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"><div class="text-sm text-muted-foreground text-center sm:text-left"> </div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option>6 per page</option><option>12 per page</option><option>24 per page</option><option>48 per page</option></select> <div class="flex gap-2"><button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>',1),sr=h('<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg"><!></button> <!></div></div>'),dr=h('<div class="flex flex-col gap-4 container mx-auto "><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2"><!> <h1 class="text-2xl font-bold">Leads</h1></div></div> <!> <!> <div class="flex flex-col md:flex-row items-center justify-between gap-4"><div class="flex flex-col md:flex-row gap-4 w-full md:w-auto"><div class="relative flex-1 md:w-[300px]"><!> <input type="text" placeholder="Search leads..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted whitespace-nowrap">Sort by Name <!></button></div> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial whitespace-nowrap"><!> Add Lead</button></div> <!> <!></div>');function lr(u,r){q(r,!0);let c=b(""),n=b(1),i=b(6),f=b(E([])),m=b(!1),v=b(null),y=b("asc"),w=b(!1),p=b(null),g=b(null);const x=U(()=>e(f).filter(s=>s.name.toLowerCase().includes(e(c).toLowerCase())).sort((s,o)=>e(y)==="asc"?s.name<o.name?-1:s.name>o.name?1:0:o.name<s.name?-1:o.name>s.name?1:0)),P=U(()=>e(x).slice((e(n)-1)*e(i),e(n)*e(i))),T=U(()=>Math.ceil(e(x).length/e(i))),I=async()=>{l(w,!0);const{data:s,error:o}=await A.from("leads").select("*");o?(console.error("Error fetching leads:",o),l(p,"Failed to fetch leads.")):(l(f,E(s)),l(p,null)),l(w,!1)},ge=async s=>{const{error:o}=await A.from("leads").delete().eq("id",s);o?(console.error("Error deleting lead:",o),l(p,"Failed to delete lead.")):(l(g,"Lead deleted successfully!"),l(p,null),await I())},_e=s=>{l(v,E(s)),l(m,!0)},Z=()=>{l(m,!1),l(v,null)},be=async s=>{const{error:o}=e(v)?await A.from("leads").update({name:s.name}).eq("id",e(v).id):await A.from("leads").insert([{name:s.name}]);o?(console.error("Error saving lead:",o),l(p,"Failed to save lead.")):(l(g,E(e(v)?"Lead updated successfully!":"Lead added successfully!")),l(p,null),await I(),Z())};ze(()=>{I()});var $=dr(),J=t($),ee=t(J),xe=t(ee);Xe(xe,{class:"w-8 h-8 text-primary"}),ve(2),a(ee),a(J);var re=d(J,2);N(re,()=>e(g),s=>{var o=We(),L=t(o,!0);a(o),z(()=>j(L,e(g))),_(s,o)});var ae=d(re,2);N(ae,()=>e(p),s=>{var o=Ye(),L=t(o,!0);a(o),z(()=>j(L,e(p))),_(s,o)});var Q=d(ae,2),X=t(Q),B=t(X),te=t(B);Ie(te,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",size:20});var oe=d(te,2);fe(oe),a(B);var G=d(B,2);G.__click=[Ve,y];var he=d(t(G)),ye=U(()=>e(y)==="asc"?"":"rotate-180");$e(he,{size:16,get class(){return e(ye)}}),a(G),a(X);var H=d(X,2);H.__click=[Ze,v,m];var we=t(H);Je(we,{size:20}),ve(),a(H),a(Q);var se=d(Q,2);N(se,()=>e(w),s=>{var o=er();_(s,o)},s=>{var o=ue(),L=Y(o);N(L,()=>e(f).length===0,k=>{var S=rr();_(k,S)},k=>{var S=or(),M=Y(S);Ne(M,21,()=>e(P),F=>F.id,(F,Se)=>{Re(F,{get lead(){return e(Se)},onEdit:_e,onDelete:ge})}),a(M);var de=d(M,2),K=t(de),ke=t(K);z(()=>j(ke,`Showing ${(e(n)-1)*e(i)+1} to ${Math.min(e(n)*e(i),e(x).length)??""} of ${e(x).length??""} results`)),a(K);var le=d(K,2),D=t(le),O=t(D);O.value=(O.__value=6)==null?"":6;var R=d(O);R.value=(R.__value=12)==null?"":12;var V=d(R);V.value=(V.__value=24)==null?"":24;var ie=d(V);ie.value=(ie.__value=48)==null?"":48,a(D);var ne=d(D,2),W=t(ne);W.__click=[ar,n];var ce=d(W,2);ce.__click=[tr,n],a(ne),a(le),a(de),z(()=>{W.disabled=e(n)===1,ce.disabled=e(n)===e(T)}),Ae(D,()=>e(i),F=>l(i,F)),_(k,S)},!0),_(s,o)});var Le=d(se,2);N(Le,()=>e(m),s=>{var o=sr(),L=t(o),k=t(L);k.__click=Z;var S=t(k);Qe(S,{size:20}),a(k);var M=d(k,2);Ge(M,{get lead(){return e(v)},onSave:be}),a(L),a(o),_(s,o)}),a($),pe(oe,()=>e(c),s=>l(c,s)),_(u,$),C()}me(["click"]);var ir=h('<main class="container mx-auto min-h-screen p-4"><!></main>');function Er(u,r){q(r,!1);const c=async()=>{const{data:f,error:m}=await A.from("leads").select("*");m&&console.error("Error fetching leads:",m)};Pe(()=>{c()}),je();var n=ir(),i=t(n);lr(i,{}),a(n),_(u,n),C()}export{Er as component};
