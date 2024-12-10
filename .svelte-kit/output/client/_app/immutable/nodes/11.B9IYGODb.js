import"../chunks/disclose-version.Bg9kRutz.js";import{f as le,p as J,c as a,r,s as o,t as B,a as Z,d as w,g as e,b as p,e as Q,n as de,m as He}from"../chunks/utils.CRNn4dtP.js";import{c as Oe,a as q,d as re,t as H,f as bt,e as xt}from"../chunks/store.B1kL-7Ni.js";import{i as W}from"../chunks/if.CRsBAEFG.js";import{i as yt}from"../chunks/lifecycle.DSkr6FdQ.js";import{l as ht,s as wt,a as E,p as Ge}from"../chunks/preload-helper.Dwm_PvIR.js";import{s as U}from"../chunks/supabaseClient.BTuNJN2N.js";import{s as M}from"../chunks/render.xPn1qZIb.js";import{e as Ne,i as Qe}from"../chunks/each.v0RK4Yef.js";import{c as G,r as Ie}from"../chunks/attributes.BcfEV1VJ.js";import{s as Be}from"../chunks/class.CstC7PuZ.js";import{b as V}from"../chunks/input.o7SqHMM4.js";import{b as Ye}from"../chunks/select.CgyWjfO5.js";import{P as kt}from"../chunks/pencil.DHUYAf-P.js";import{T as We}from"../chunks/trash-2.B2J2poVW.js";import{E as Pt,a as At}from"../chunks/jspdf.plugin.autotable.hR4uI5lc.js";import{A as te}from"../chunks/arrow-up-down.Ck2frNgV.js";import{S as St}from"../chunks/search.B4Eo5Hu8.js";import{D as Et}from"../chunks/download.CIM__xX3.js";import{X as Ot}from"../chunks/x.DaAqSZOK.js";import{o as Nt}from"../chunks/index-client.BdGz_wQc.js";import{S as It}from"../chunks/save.D1ZZhgaf.js";import{P as zt}from"../chunks/plus.BBSv_QI7.js";import{I as Ft,s as Rt}from"../chunks/Icon.CEA2x5sb.js";function Tt(k,t){const l=ht(t,["children","$$slots","$$events","$$legacy"]);Ft(k,wt({name:"circle-plus"},()=>l,{iconNode:[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M8 12h8"}],["path",{d:"M12 8v8"}]],children:(v,m)=>{var s=Oe(),f=le(s);Rt(f,t,"default",{}),q(v,s)},$$slots:{default:!0}}))}var Ct=(k,t)=>t.onApprove(t.opportunity.id),Dt=(k,t)=>t.onEdit(t.opportunity),Ut=(k,t)=>t.onDelete(t.opportunity.id),jt=H('<tr class="hover:bg-muted/50"><td class="px-4 py-3"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3"> </td><td class="px-4 py-3"><div class="flex items-center gap-2"><button class="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"> </button> <button class="p-1 rounded hover:bg-muted"><!></button> <button class="p-1 rounded hover:bg-muted text-red-500 hover:text-red-600 disabled:opacity-50"><!></button></div></td></tr>');function qt(k,t){J(t,!0);var l=jt(),_=a(l),v=a(_,!0);r(_);var m=o(_),s=a(m,!0);r(m);var f=o(m),A=a(f,!0);r(f);var x=o(f),u=a(x,!0);r(x);var b=o(x),g=a(b,!0);r(b);var y=o(b),z=a(y);B(()=>M(z,`P${t.opportunity.budget.toFixed(2)??""}`)),r(y);var P=o(y),S=a(P,!0);r(P);var F=o(P),j=a(F),O=a(j);O.__click=[Ct,t];var C=a(O,!0);r(O);var I=o(O,2);I.__click=[Dt,t];var K=a(I);kt(K,{size:16}),r(I);var D=o(I,2);D.__click=[Ut,t];var N=a(D);We(N,{size:16}),r(D),r(j),r(F),r(l),B(()=>{M(v,t.opportunity.opt_statement),M(s,t.opportunity.planned_actions),M(A,t.opportunity.kpi),M(u,t.opportunity.key_persons),M(g,t.opportunity.target_output),M(S,t.opportunity.department_name),O.disabled=t.approvingId===t.opportunity.id||t.userRole==="admin"&&t.opportunity.is_approved||t.userRole==="vice_president"&&(!t.opportunity.is_approved||t.opportunity.is_approved_vp)||t.userRole==="president"&&(!t.opportunity.is_approved_vp||t.opportunity.is_approved_president),M(C,t.approvingId===t.opportunity.id?"Processing...":t.userRole==="admin"?t.opportunity.is_approved?"Admin Approved":"Approve":t.userRole==="vice_president"?t.opportunity.is_approved_vp?"VP Approved":"Approve":t.userRole==="president"&&t.opportunity.is_approved_president?"President Approved":"Approve"),D.disabled=t.deletingId===t.opportunity.id}),q(k,l),Z()}re(["click"]);var Kt=H('<form class="h-full max-h-screen flex flex-col gap-4 p-4"><h3 class="text-lg font-semibold">Edit Opportunity</h3> <div class="flex-1 overflow-y-auto pr-2"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-4"><div class="space-y-2"><label for="opt_statement">Statement</label> <textarea id="opt_statement" class="w-full p-2 border rounded-lg bg-background min-h-[100px] overflow-hidden"></textarea></div> <div class="space-y-2"><label for="planned_actions">Planned Actions</label> <textarea id="planned_actions" class="w-full p-2 border rounded-lg bg-background min-h-[100px] overflow-hidden"></textarea></div></div> <div class="space-y-4"><div class="space-y-2"><label for="kpi">KPI</label> <textarea id="kpi" class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden"></textarea></div> <div class="space-y-2"><label for="key_persons">Key Persons</label> <textarea id="key_persons" class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden"></textarea></div> <div class="space-y-2"><label for="target_output">Target Output</label> <textarea id="target_output" class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden"></textarea></div> <div class="space-y-2"><label for="budget">Budget</label> <input type="number" id="budget" class="w-full p-2 border rounded-lg bg-background" min="0" step="0.01"></div></div></div></div> <div class="sticky bottom-0 flex justify-end gap-2 pt-4 border-t bg-background"><button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"> </button></div></form>');function Mt(k,t){J(t,!0);let l=t.opportunity?{...t.opportunity}:{opt_statement:"",planned_actions:"",kpi:"",key_persons:"",target_output:"",budget:0};const _=d=>{d.preventDefault(),t.onSave(l)},v=d=>{const R=d.target;R.style.height="auto",R.style.height=R.scrollHeight+"px"};var m=Kt(),s=o(a(m),2),f=a(s),A=a(f),x=a(A),u=o(a(x),2);G(u),u.__input=v,r(x);var b=o(x,2),g=o(a(b),2);G(g),g.__input=v,r(b),r(A);var y=o(A,2),z=a(y),P=o(a(z),2);G(P),P.__input=v,r(z);var S=o(z,2),F=o(a(S),2);G(F),F.__input=v,r(S);var j=o(S,2),O=o(a(j),2);G(O),O.__input=v,r(j);var C=o(j,2),I=o(a(C),2);Ie(I),r(C),r(y),r(f),r(s);var K=o(s,2),D=a(K),N=a(D,!0);r(D),r(K),r(m),B(()=>{D.disabled=t.saving,M(N,t.saving?"Saving...":"Save Changes")}),bt("submit",m,_),V(u,()=>l.opt_statement,d=>l.opt_statement=d),V(g,()=>l.planned_actions,d=>l.planned_actions=d),V(P,()=>l.kpi,d=>l.kpi=d),V(F,()=>l.key_persons,d=>l.key_persons=d),V(O,()=>l.target_output,d=>l.target_output=d),V(I,()=>l.budget,d=>l.budget=d),q(k,m),Z()}re(["input"]);const Vt=(k,t,l,_,v,m)=>{const s=new Pt("landscape");s.setFont("times","normal"),s.setFontSize(12),s.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION",14,10),s.text("Opportunities Report",14,16),s.setFontSize(10),s.text("SY 2024-2025",14,22);const f=["Opportunity Statement","Planned Actions","KPI","Key Persons","Target Output","Budget","Department"],A=e(t).map(S=>[S.opt_statement,S.planned_actions,S.kpi,S.key_persons,S.target_output,S.budget.toFixed(2),S.department_name||"Unknown"]);At(s,{head:[f],body:A,startY:28,theme:"grid",styles:{font:"times",fontSize:10},headStyles:{fillColor:[41,128,185]}});const u=s.internal.pageSize.height-40,b=s.internal.pageSize.width/4,g=[14,b,b*2,b*3];s.setFontSize(10);const y=e(l)[0],z=(y==null?void 0:y.user_name)||"Unknown",P=(y==null?void 0:y.department_name)||"Unknown";s.text(`${z} (sgnd)`,g[0],u-5),s.text("_________________________",g[0],u),s.text(`${P} Department Head`,g[0],u+5),s.text(`${e(_)||"N/A"} (sgnd)`,g[1],u-5),s.text("_________________________",g[1],u),s.text("Corporate Planning Officer",g[1],u+5),s.text(`${e(v)||"N/A"} (sgnd)`,g[2],u-5),s.text("_________________________",g[2],u),s.text("Vice President",g[2],u+5),s.text(`${e(m)||"N/A"} (sgnd)`,g[3],u-5),s.text("_________________________",g[3],u),s.text("President",g[3],u+5),s.save("Opportunities_Report.pdf")};var Lt=H("<div><span> </span></div>"),Ht=(k,t)=>p(t,!e(t)),Bt=H("<option> </option>"),Yt=H('<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),Gt=(k,t)=>t("opt_statement"),Qt=(k,t)=>t("planned_actions"),Wt=(k,t)=>t("budget"),Xt=(k,t)=>t("department_name"),Jt=(k,t)=>p(t,e(t)-1),Zt=(k,t)=>p(t,e(t)+1),$t=H('<div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Statement <!></button></th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Actions <!></button></th><th class="px-4 py-3 text-left">KPI</th><th class="px-4 py-3 text-left">Key Persons</th><th class="px-4 py-3 text-left">Target</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Budget <!></button></th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Department <!></button></th><th class="px-4 py-3 text-left w-[150px]">Actions</th></tr></thead><tbody class="divide-y divide-border"></tbody></table></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground"> </div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary rounded-lg px-2 py-1 w-full sm:w-auto"><option>5 per page</option><option>10 per page</option><option>25 per page</option><option>50 per page</option></select> <div class="flex gap-2"><button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>',1),er=H('<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"><div class="bg-card p-3 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg"><!></button> <!></div></div>'),tr=H('<div class="flex flex-col gap-4 container mx-auto p-6"><!> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Opportunities Management</h2></div> <button class="md:hidden w-full px-4 py-2 bg-secondary rounded-lg text-left flex justify-between items-center">Filters <!></button> <div><div class="flex flex-col md:flex-row gap-4 w-full md:w-auto"><div class="relative flex-1 md:w-[300px]"><!> <input type="text" placeholder="Search opportunities..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full"></div> <select class="bg-secondary rounded-lg px-3 py-2 w-full md:w-[200px]"><option>All Departments</option><!></select></div> <div class="flex gap-2 w-full md:w-auto"><button class="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 flex-1 md:flex-initial"><!> Export PDF</button></div></div> <!> <!></div>');function rr(k,t){J(t,!0);let l=w(""),_=w(1),v=w(5),m=w(!1),s=w(null),f=w("opt_statement"),A=w("asc"),x=w("all"),u=w(!1),b=w(!1),g=w(""),y=w("success"),z=w(!1),P=w(!0),S=w(null),F=w(null),j=w(E([])),O=w(E([])),C=w(null),I=w(null),K=w(null),D=w(null);const N=async()=>{await d(),await R(),await ae(),await Xe(),await pe(),p(P,!1)},d=async()=>{const{data:{session:n}}=await U.auth.getSession();if(!n||!n.user)return;const{data:i,error:c}=await U.from("profiles").select("role").eq("id",n.user.id).single();if(c){L("Error fetching user role: "+c.message,"error");return}p(C,E(i.role))},R=async()=>{const{data:n,error:i}=await U.from("profiles").select("first_name, last_name").eq("role","admin");if(i){L("Error fetching admin name: "+i.message,"error"),p(I,"N/A");return}p(I,E(n.map(c=>`${c.first_name} ${c.last_name}`).join(", ")))},pe=async()=>{const{data:n,error:i}=await U.from("profiles").select("first_name, last_name, role").in("role",["vice_president","president"]);if(i){L("Error fetching VP and President names: "+i.message,"error"),p(K,"N/A"),p(D,"N/A");return}const c=n.find(T=>T.role==="vice_president"),h=n.find(T=>T.role==="president");p(K,E(c?`${c.first_name} ${c.last_name}`:"N/A")),p(D,E(h?`${h.first_name} ${h.last_name}`:"N/A"))},ae=async()=>{const{data:n,error:i}=await U.from("opportunities").select(`
                *,
                profiles (
                    first_name,
                    last_name,
                    departments (name)
                )
            `);if(i){L("Error fetching opportunities: "+i.message,"error");return}p(j,E(n.map(c=>{var h,T,Y,X;return{...c,department_name:((T=(h=c.profiles)==null?void 0:h.departments)==null?void 0:T.name)||"N/A",user_name:`${((Y=c.profiles)==null?void 0:Y.first_name)||""} ${((X=c.profiles)==null?void 0:X.last_name)||""}`}})))},Xe=async()=>{const{data:n,error:i}=await U.from("departments").select("id, name");if(i){L("Error fetching departments: "+i.message,"error");return}p(O,E(n))},L=(n,i)=>{p(g,E(n)),p(y,E(i)),p(b,!0),setTimeout(()=>{p(b,!1)},3e3)},$=Q(()=>e(j).filter(n=>{const c=`${n.opt_statement} ${n.planned_actions} ${n.department_name}`.toLowerCase().includes(e(l).toLowerCase()),h=e(x)==="all"||n.department_name===e(x);return c&&h}).sort((n,i)=>{const c=String(n[e(f)]),h=String(i[e(f)]);return e(A)==="asc"?c.localeCompare(h):h.localeCompare(c)})),Je=Q(()=>e($).slice((e(_)-1)*e(v),e(_)*e(v))),Ze=Q(()=>Math.ceil(e($).length/e(v))),oe=n=>{e(f)===n?p(A,E(e(A)==="asc"?"desc":"asc")):(p(f,E(n)),p(A,"asc"))},$e=async n=>{p(F,E(n));const{error:i}=await U.from("opportunities").delete().eq("id",n);i?L("Error deleting opportunity: "+i.message,"error"):(await ae(),L("Opportunity deleted successfully!","success")),p(F,null)},et=async n=>{p(S,E(n));let i={};e(C)==="admin"?i={is_approved:!0}:e(C)==="vice_president"?i={is_approved_vp:!0}:e(C)==="president"&&(i={is_approved_president:!0});const{data:c,error:h}=await U.from("opportunities").update(i).eq("id",n).select();if(h)L("Error approving opportunity: "+h.message,"error");else{if(e(C)==="president"&&c&&c.length>0){const T=c[0],{error:Y}=await U.from("opt_monitoring").insert({opt_id:T.id,profile_id:T.profile_id,department_id:T.department_id});Y&&L("Error adding to monitoring: "+Y.message,"error")}await ae(),L("Opportunity approved successfully!","success")}p(S,null)},tt=async n=>{if(!e(s))return;p(z,!0);const{error:i}=await U.from("opportunities").update({opt_statement:n.opt_statement,planned_actions:n.planned_actions,kpi:n.kpi,key_persons:n.key_persons,target_output:n.target_output,budget:n.budget}).eq("id",e(s).id);i?L("Error updating opportunity: "+i.message,"error"):(await ae(),L("Opportunity updated successfully!","success"),ze()),p(z,!1)},ze=()=>{p(m,!1),p(s,null)};N();var ce=tr(),Fe=a(ce);W(Fe,()=>e(b),n=>{var i=Lt(),c=a(i),h=a(c,!0);r(c),r(i),B(()=>{Be(i,`alert alert-${e(y)??""} shadow-lg mb-4`),M(h,e(g))}),q(n,i)});var se=o(Fe,4);se.__click=[Ht,u];var rt=o(a(se)),at=Q(()=>e(u)?"rotate-180":"");te(rt,{size:16,get class(){return e(at)}}),r(se);var ne=o(se,2),_e=a(ne),ue=a(_e),Re=a(ue);St(Re,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",size:20});var Te=o(Re,2);Ie(Te),r(ue);var ve=o(ue,2),me=a(ve);me.value=(me.__value="all")==null?"":"all";var ot=o(me);Ne(ot,17,()=>e(O),Qe,(n,i)=>{var c=Bt(),h={},T=a(c,!0);r(c),B(()=>{h!==(h=e(i).name)&&(c.value=(c.__value=e(i).name)==null?"":e(i).name),M(T,e(i).name)}),q(n,c)}),r(ve),r(_e);var Ce=o(_e,2),ge=a(Ce);ge.__click=[Vt,$,j,I,K,D];var st=a(ge);Et(st,{size:20}),de(),r(ge),r(Ce),r(ne);var De=o(ne,2);W(De,()=>e(P),n=>{var i=Yt();q(n,i)},n=>{var i=$t(),c=le(i),h=a(c),T=a(h),Y=a(T),X=a(Y),fe=a(X);fe.__click=[Gt,oe];var it=o(a(fe)),lt=Q(()=>e(f)==="opt_statement"?"text-primary":"");te(it,{size:16,get class(){return e(lt)}}),r(fe),r(X);var be=o(X),xe=a(be);xe.__click=[Qt,oe];var dt=o(a(xe)),pt=Q(()=>e(f)==="planned_actions"?"text-primary":"");te(dt,{size:16,get class(){return e(pt)}}),r(xe),r(be);var ye=o(be,4),he=a(ye);he.__click=[Wt,oe];var ct=o(a(he)),_t=Q(()=>e(f)==="budget"?"text-primary":"");te(ct,{size:16,get class(){return e(_t)}}),r(he),r(ye);var Ue=o(ye),we=a(Ue);we.__click=[Xt,oe];var ut=o(a(we)),vt=Q(()=>e(f)==="department_name"?"text-primary":"");te(ut,{size:16,get class(){return e(vt)}}),r(we),r(Ue),de(),r(Y),r(T);var je=o(T);Ne(je,21,()=>e(Je),ee=>ee.id,(ee,gt)=>{qt(ee,{get opportunity(){return e(gt)},get userRole(){return e(C)},onEdit:ft=>{p(s,E(ft)),p(m,!0)},onDelete:$e,onApprove:et,get approvingId(){return e(S)},get deletingId(){return e(F)}})}),r(je),r(h),r(c);var qe=o(c,2),ke=a(qe),mt=a(ke);B(()=>M(mt,`Showing ${(e(_)-1)*e(v)+1} to ${Math.min(e(_)*e(v),e($).length)??""} of ${e($).length??""} results`)),r(ke);var Ke=o(ke,2),ie=a(Ke),Pe=a(ie);Pe.value=(Pe.__value=5)==null?"":5;var Ae=o(Pe);Ae.value=(Ae.__value=10)==null?"":10;var Se=o(Ae);Se.value=(Se.__value=25)==null?"":25;var Me=o(Se);Me.value=(Me.__value=50)==null?"":50,r(ie);var Ve=o(ie,2),Ee=a(Ve);Ee.__click=[Jt,_];var Le=o(Ee,2);Le.__click=[Zt,_],r(Ve),r(Ke),r(qe),B(()=>{Ee.disabled=e(_)===1,Le.disabled=e(_)===e(Ze)}),Ye(ie,()=>e(v),ee=>p(v,ee)),q(n,i)});var nt=o(De,2);W(nt,()=>e(m),n=>{var i=er(),c=a(i),h=a(c);h.__click=ze;var T=a(h);Ot(T,{size:20}),r(h);var Y=o(h,2);Mt(Y,{get opportunity(){return e(s)},onSave:tt,get saving(){return e(z)}}),r(c),r(i),q(n,i)}),r(ce),B(()=>Be(ne,`flex flex-col gap-4 ${e(u)?"block":"hidden"} md:flex md:flex-row md:justify-between`)),V(Te,()=>e(l),n=>p(l,n)),Ye(ve,()=>e(x),n=>p(x,n)),q(k,ce),Z()}re(["click"]);var ar=H('<div class="bg-gray-50 rounded-lg p-6 border border-gray-200"><div class="flex justify-between items-start mb-4"><h3 class="text-lg font-semibold text-gray-700"> </h3> <button class="text-red-500 hover:text-red-700 transition-colors p-2"><!></button></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Opportunity Statement</label> <textarea placeholder="Describe the opportunity..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3"></textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Planned Actions</label> <textarea placeholder="List planned actions..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3"></textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">KPI</label> <textarea placeholder="Key Performance Indicators..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2"></textarea></div></div> <div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Key Persons</label> <textarea placeholder="List key persons involved..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2"></textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Target Output</label> <textarea placeholder="Expected outcomes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2"></textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Budget</label> <input type="number" placeholder="Enter budget amount..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div></div></div></div>');function or(k,t){J(t,!0);let l=Ge(t,"data",7);const _=d=>{const R=d.target;R.style.height="auto",R.style.height=`${R.scrollHeight}px`};var v=ar(),m=a(v),s=a(m),f=a(s);r(s);var A=o(s,2);A.__click=function(...d){var R;(R=t.onDelete)==null||R.apply(this,d)};var x=a(A);We(x,{class:"w-5 h-5"}),r(A),r(m);var u=o(m,2),b=a(u),g=a(b),y=o(a(g),2);G(y),y.__input=_,r(g);var z=o(g,2),P=o(a(z),2);G(P),P.__input=_,r(z);var S=o(z,2),F=o(a(S),2);G(F),F.__input=_,r(S),r(b);var j=o(b,2),O=a(j),C=o(a(O),2);G(C),C.__input=_,r(O);var I=o(O,2),K=o(a(I),2);G(K),K.__input=_,r(I);var D=o(I,2),N=o(a(D),2);Ie(N),r(D),r(j),r(u),r(v),B(()=>M(f,`Opportunity ${t.index+1}`)),V(y,()=>l().opt_statement,d=>l().opt_statement=d),V(P,()=>l().planned_actions,d=>l().planned_actions=d),V(F,()=>l().kpi,d=>l().kpi=d),V(C,()=>l().key_persons,d=>l().key_persons=d),V(K,()=>l().target_output,d=>l().target_output=d),V(N,()=>l().budget,d=>l().budget=d),q(k,v),Z()}re(["click","input"]);const sr=async(k,t,l,_,v)=>{if(e(t)){p(l,!0);try{const{data:m,error:s}=await U.from("opportunities").insert(e(_).map(f=>({...f,profile_id:e(t),department_id:f.department_id}))).select();if(s){console.error("Error creating opportunities:",s);return}if(m&&m.length>0){const A=(await Promise.all(m.map(async x=>{const{data:u,error:b}=await U.from("departments").select("name").eq("id",x.department_id).single();if(b)return console.error(`Error fetching department name for ID ${x.department_id}:`,b),null;const g=(u==null?void 0:u.name)||"Unknown Department";return{event_id:x.id,event_type:"opportunity",description:`${g} created a new opportunity`}}))).filter(x=>x!==null);A.length>0&&await U.from("recent_events").insert(A)}await v(),p(_,E([{opt_statement:"",planned_actions:"",kpi:"",key_persons:"",target_output:"",budget:0,profile_id:"",department_id:e(_)[0].department_id}]))}catch(m){console.error("Unexpected error:",m)}finally{p(l,!1)}}},nr=(k,t,l)=>{var _;p(t,E([...e(t),{opt_statement:"",planned_actions:"",kpi:"",key_persons:"",target_output:"",budget:0,profile_id:e(l)||"",department_id:((_=e(t)[0])==null?void 0:_.department_id)||""}]))};var ir=()=>console.log("Save Progress"),lr=H('<div class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>'),dr=H('<div class="container mx-auto px-4 py-8"><div class="bg-white rounded-xl shadow-lg p-6 mb-8"><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold text-gray-800"> </h1> <button class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"><!> Save Progress</button></div> <div class="grid grid-cols-1 gap-6 mb-6"></div> <div class="flex flex-wrap gap-4"><button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><!> Add New Opportunity</button> <button class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"><!> <!></button></div></div></div>');function pr(k,t){J(t,!0);let l=w(E([])),_=w(!1),v=w(!1),m=w(E([{opt_statement:"",planned_actions:"",kpi:"",key_persons:"",target_output:"",budget:0,profile_id:"",department_id:""}])),s=w(null);const f=async()=>{const{data:{session:N}}=await U.auth.getSession();if(N){const{data:d,error:R}=await U.from("profiles").select("id, department_id").eq("id",N.user.id).single();R?console.error("Error fetching profile:",R):(p(s,E(d.id)),e(m).forEach(pe=>{pe.department_id=d.department_id}))}},A=async()=>{p(_,!0);const{data:N,error:d}=await U.from("opportunities").select("*").eq("profile_id",e(s));d?console.error("Error fetching opportunities:",d):p(l,E(N)),p(_,!1)},x=N=>{e(m).splice(N,1),p(m,E([...e(m)]))};Nt(()=>{f(),e(s)&&A()});var u=dr(),b=a(u),g=a(b),y=a(g),z=a(y,!0);r(y);var P=o(y,2);P.__click=[ir];var S=a(P);It(S,{class:"w-4 h-4 mr-2"}),de(),r(P),r(g);var F=o(g,2);Ne(F,21,()=>e(m),Qe,(N,d,R)=>{or(N,{get data(){return e(d)},index:R,onDelete:()=>x(R)})}),r(F);var j=o(F,2),O=a(j);O.__click=[nr,m,s];var C=a(O);zt(C,{class:"w-4 h-4 mr-2"}),de(),r(O);var I=o(O,2);I.__click=[sr,s,v,m,A];var K=a(I);Tt(K,{class:"w-4 h-4 mr-2"});var D=o(K,2);W(D,()=>e(v),N=>{var d=lr();q(N,d)},N=>{var d=xt();B(()=>M(d,"Submit Opportunities")),q(N,d)}),r(I),r(j),r(b),r(u),B(()=>{M(z,"Create Opportunity"),P.disabled=e(v),I.disabled=e(_)||e(v)}),q(k,u),Z()}re(["click"]);var cr=H("<div><!></div>");function Dr(k,t){J(t,!1);let l=Ge(t,"data",8);const{session:_}=l();let v=He(null),m=He(!0);(async()=>{if(_){const{user:x}=_,{data:u,error:b}=await U.from("profiles").select("role").eq("id",x.id).single();b?console.error("Error fetching user profile:",b.message):(p(v,u),console.log("Role in Opportunities: ",e(v)))}p(m,!1)})(),yt();var f=cr(),A=a(f);W(A,()=>e(m),x=>{},x=>{var u=Oe(),b=le(u);W(b,()=>_!==null&&e(v),g=>{var y=Oe(),z=le(y);W(z,()=>e(v).role==="admin"||e(v).role=="vice_president"||e(v).role=="president",P=>{rr(P,{})},P=>{pr(P,{})}),q(g,y)},null,!0),q(x,u)}),r(f),q(k,f),Z()}export{Dr as component};
