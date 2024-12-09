import"../chunks/disclose-version.Bg9kRutz.js";import{p as qt,g as t,t as E,a as Ut,m as w,b as d,c as n,r as a,s as c,i as tt,f as Ft}from"../chunks/runtime.CLSstnwU.js";import{s as y}from"../chunks/render.D17u6ZCY.js";import{i as rt}from"../chunks/if.b2Q-jNLG.js";import{e as et,a as R,t as P,c as Mt}from"../chunks/utils.kA-YjkFf.js";import{i as Vt}from"../chunks/lifecycle.V0dJQ05z.js";import{o as zt}from"../chunks/index-client.DT-fMr9Z.js";import{s as _}from"../chunks/supabaseClient.CaMOPPuz.js";import{e as ht,i as gt}from"../chunks/each.sV1uapQk.js";import{r as Gt,s as Bt}from"../chunks/attributes.DiUoHvyc.js";import{t as Ot}from"../chunks/class.9GukHOdr.js";import{r as Dt}from"../chunks/misc.C2nsS1Cr.js";import{b as Et}from"../chunks/input.CQDk-SFX.js";import{b as Kt}from"../chunks/select.BAP3DC-4.js";import{E as Wt,a as Jt}from"../chunks/jspdf.plugin.autotable.4s0l0uhg.js";var Qt=P('<div class="alert alert-success shadow-lg mb-4"><span> </span></div>'),Xt=P('<div class="alert alert-error shadow-lg mb-4"><span> </span></div>'),Zt=P("<option> </option>"),te=P('<tr><td> </td><td><textarea class="textarea textarea-bordered w-full"></textarea></td><td><select class="select select-bordered w-full"><option>Select classification</option><!></select></td><td><textarea class="textarea textarea-bordered w-full"></textarea></td><td><textarea class="textarea textarea-bordered w-full"></textarea></td><td><input type="number" class="input input-bordered w-full"></td><td><button class="btn btn-error btn-sm">Remove</button></td><td><a class="btn btn-info btn-sm" target="_self">Go to Risk Assessment</a></td></tr>'),ee=P('<div class="container mx-auto p-4"><h1 class="text-3xl font-bold mb-4"> </h1> <!> <!> <div class="overflow-x-auto"><table class="table table-zebra w-full"><thead><tr><th>RRN</th><th>Risk Statement</th><th>Classification</th><th>Actions</th><th>Key Persons</th><th>Budget</th><th>Remove</th></tr></thead><tbody></tbody></table></div> <div class="mt-4 flex gap-4"><button class="btn btn-primary">Add New Risk</button> <button class="btn btn-success">Save All Risks</button></div></div>');function re(pt,vt){qt(vt,!1);let f=w([]),N=w([]),v=null,C=w(""),Y=w(null),k=w(null),z=1;const D=async()=>{var l,s;try{const{data:g,error:A}=await _.auth.getSession();if(A)throw A;const j=(s=(l=g==null?void 0:g.session)==null?void 0:l.user)==null?void 0:s.id;if(!j)throw new Error("No logged-in user found.");const{data:W,error:J}=await _.from("profiles").select("id, department_id").eq("id",j).single();if(J)throw J;v=W;const{data:Q,error:K}=await _.from("departments").select("name").eq("id",v.department_id).single();if(K)throw K;d(C,Q.name),await L(),await M(),await F()}catch(g){console.error("Error fetching user profile or department:",g),d(k,"Failed to fetch profile or department details.")}},F=async()=>{try{const{data:l,error:s}=await _.from("classification").select("id, name");if(s)throw s;d(N,l||[])}catch(l){console.error("Error fetching classifications:",l),d(k,"Failed to fetch classifications.")}},L=async()=>{try{const{data:l,error:s}=await _.from("risks").select("*").eq("profile_id",v==null?void 0:v.id).order("rrn",{ascending:!0});if(s)throw s;d(f,l||[])}catch(l){console.error("Error fetching risks:",l),d(k,"Failed to fetch risks.")}},M=async()=>{try{const{data:l,error:s}=await _.from("risks").select("rrn").eq("profile_id",v==null?void 0:v.id).order("rrn",{ascending:!1}).limit(1);if(s)throw s;if(l.length>0){const A=l[0].rrn.match(/(\d+)$/);z=A?parseInt(A[0],10)+1:1}else z=1}catch(l){console.error("Error fetching next RRN number:",l),d(k,"Failed to determine the next RRN number.")}},q=()=>{const l=`RRN-${t(C)}-${String(z).padStart(3,"0")}`;z+=1,d(f,[...t(f),{rrn:l,risk_statement:"",classification:null,actions:"",key_persons:"",budget:0,profile_id:(v==null?void 0:v.id)||"",department_id:(v==null?void 0:v.department_id)||""}])},B=l=>{t(f).length>0&&l===t(f).length-1&&(z-=1),d(f,t(f).filter((s,g)=>g!==l))},h=async()=>{try{const l=t(f).map(({id:j,...W})=>W),{data:s,error:g}=await _.from("risks").upsert(l,{onConflict:"rrn"});if(g)throw g;const A=await _.from("risks").select("*").eq("profile_id",v==null?void 0:v.id);if(A.error)throw A.error;d(f,A.data||[]),d(Y,"Risks saved successfully!")}catch(l){console.error("Error saving risks:",l),d(k,"Failed to save risks.")}};zt(async()=>{await D()}),Vt();var U=ee(),I=n(U),at=n(I);a(I);var bt=c(I,2);rt(bt,()=>t(Y),l=>{var s=Qt(),g=n(s),A=n(g,!0);a(g),a(s),E(()=>y(A,t(Y))),R(l,s)});var wt=c(bt,2);rt(wt,()=>t(k),l=>{var s=Xt(),g=n(s),A=n(g,!0);a(g),a(s),E(()=>y(A,t(k))),R(l,s)});var ft=c(wt,2),xt=n(ft),st=c(n(xt));ht(st,5,()=>t(f),gt,(l,s,g)=>{var A=te(),j=n(A),W=n(j,!0);a(j);var J=c(j),Q=n(J);Dt(Q),a(J);var K=c(J),G=n(K);E(()=>{t(s).classification,tt(()=>{t(N)})});var X=n(G);X.value=(X.__value=null)==null?"":null;var St=c(X);ht(St,1,()=>t(N),gt,(p,$)=>{var O=Zt(),x={},ot=n(O,!0);a(O),E(()=>{x!==(x=t($).id)&&(O.value=(O.__value=t($).id)==null?"":t($).id),y(ot,t($).name)}),R(p,O)}),a(G),a(K);var mt=c(K),Rt=n(mt);Dt(Rt),a(mt);var e=c(mt),r=n(e);Dt(r),a(e);var i=c(e),b=n(i);Gt(b),a(i);var m=c(i),u=n(m);a(m);var S=c(m),o=n(S);a(S),a(A),E(()=>{y(W,t(s).rrn),Bt(o,"href",`/risks/riskAssessment?riskId=${t(s).id}`),Bt(o,"aria-disabled",!t(s).id),Ot(o,"disabled",!t(s).id)}),Et(Q,()=>t(s).risk_statement,p=>(t(s).risk_statement=p,tt(()=>t(f)))),Kt(G,()=>t(s).classification,p=>(t(s).classification=p,tt(()=>t(f)))),Et(Rt,()=>t(s).actions,p=>(t(s).actions=p,tt(()=>t(f)))),Et(r,()=>t(s).key_persons,p=>(t(s).key_persons=p,tt(()=>t(f)))),Et(b,()=>t(s).budget,p=>(t(s).budget=p,tt(()=>t(f)))),et("click",u,()=>B(g)),R(l,A)}),a(st),a(xt),a(ft);var At=c(ft,2),yt=n(At),Pt=c(yt,2);a(At),a(U),E(()=>y(at,`${t(C)??""} Risks Register`)),et("click",yt,q),et("click",Pt,h),R(pt,U),Ut()}var ae=P("<option> </option>"),se=P("<div>Loading risks...</div>"),oe=P("<div>No risks available.</div>"),ne=P("<div><strong>Likelihood:</strong> <br> <strong>Severity:</strong> <br> <strong>Control Rating:</strong> <br> <strong>Monitoring Rating:</strong> </div>"),ie=P('<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td></td><td class="flex gap-2"><button class="btn btn-sm btn-success"> </button> <button class="btn btn-sm btn-error"> </button></td></tr>'),de=P('<table class="table w-full"><thead><tr><th>Risk Statement</th><th>Classification</th><th>Actions</th><th>Key Persons</th><th>Budget</th><th>Risk Assessments</th><th>Approval Status</th><th>Actions</th></tr></thead><tbody></tbody></table>'),le=P('<div class="container mx-auto p-6"><h2 class="text-2xl font-bold mb-6">Risk Management</h2> <div class="flex gap-4 mb-4"><select class="select select-bordered"><option>All Departments</option><!></select> <button class="btn btn-secondary">Export to PDF</button></div> <!></div>');function ce(pt,vt){qt(vt,!1);let f=[],N=w([]),v=w([]),C=w([]),Y=w([]),k=w([]),z=w([]),D=w([]),F=w([]),L=w("all"),M=w(!0),q=w(!1),B=w(null),h=w(null),U=null,I=null,at=null;const bt=async()=>{const{data:{session:e}}=await _.auth.getSession();if(!e||!e.user)return;const{data:r,error:i}=await _.from("profiles").select("role, first_name, last_name").eq("id",e.user.id).single();if(i){console.error("Error fetching user role:",i);return}d(h,r.role),t(h)==="admin"&&(U=`${r.first_name} ${r.last_name}`)},wt=async()=>{try{const{data:e,error:r}=await _.from("profiles").select("first_name, last_name").eq("role","admin");r||!e?(console.error("Error fetching admin names:",r||"No data found"),U="N/A"):U=e.map(i=>`${i.first_name} ${i.last_name}`).join(", ")}catch(e){console.error("Error fetching admin details:",e),U="N/A"}},ft=async()=>{try{const{data:e,error:r}=await _.from("profiles").select("first_name, last_name, role").in("role",["vice_president","president"]);if(r||!e){console.error("Error fetching VP and President names:",r||"No data found"),I="N/A",at="N/A";return}const i=e.find(m=>m.role==="vice_president"),b=e.find(m=>m.role==="president");I=i?`${i.first_name} ${i.last_name}`:"N/A",at=b?`${b.first_name} ${b.last_name}`:"N/A"}catch(e){console.error("Error fetching VP and President details:",e),I="N/A",at="N/A"}},xt=async()=>{const{data:e,error:r}=await _.from("departments").select("id, name");if(r){console.error("Error fetching departments:",r);return}d(F,e||[])},st=async()=>{d(M,!0);const{data:e,error:r}=await _.from("risks").select("*, profiles (first_name, last_name, departments (name))");if(r){console.error("Error fetching risks:",r);return}f=e.map(i=>{var b,m,u,S;return{...i,user_name:`${((b=i.profiles)==null?void 0:b.first_name)||""} ${((m=i.profiles)==null?void 0:m.last_name)||""}`,department_name:((S=(u=i.profiles)==null?void 0:u.departments)==null?void 0:S.name)||"N/A"}}),W(),d(M,!1)},At=async()=>{const{data:e,error:r}=await _.from("risk_assessment").select("*");if(r){console.error("Error fetching risk assessments:",r);return}d(v,e||[])},yt=async()=>{const{data:e,error:r}=await _.from("classification").select("*");r||d(C,e||[])},Pt=async()=>{const{data:e,error:r}=await _.from("likelihood_rating").select("*");r||d(Y,e||[])},l=async()=>{const{data:e,error:r}=await _.from("severity").select("*");r||d(k,e||[])},s=async()=>{const{data:e,error:r}=await _.from("risk_control_rating").select("*");r||d(z,e||[])},g=async()=>{const{data:e,error:r}=await _.from("risk_monitoring_rating").select("*");r||d(D,e||[])},A=async e=>{d(q,!0);let r={};t(h)==="admin"?r={is_approved:!0}:t(h)==="vice_president"?r={is_approved_vp:!0}:t(h)==="president"&&(r={is_approved_president:!0});try{const{data:i,error:b}=await _.from("risks").update(r).eq("id",e).select();if(b){console.error("Error approving risk:",b);return}if(t(h)==="president"&&i&&i.length>0){const m=i[0],{data:u,error:S}=await _.from("risk_assessment").select("*").eq("risk_id",m.id);if(S){console.error("Error fetching risk assessments:",S);return}const o=u.map($=>({risk_id:m.id,likelihood_rating_id:$.lr,severity_id:$.s,control_rating_id:$.rcr,monitoring_rating_id:$.rmr,department_id:m.department_id})),{error:p}=await _.from("risk_monitoring").insert(o);p&&console.error("Error inserting into risk_monitoring:",p)}await st()}catch(i){console.error("Unexpected error while approving risk:",i)}finally{d(q,!1)}},j=async e=>{d(B,e);const{error:r}=await _.from("risks").delete().eq("id",e);r?console.error("Error deleting risk:",r):await st(),d(B,null)},W=()=>{t(L)==="all"?d(N,f):d(N,f.filter(e=>e.department_name===t(L)))},J=()=>{const e=new Wt("landscape"),r="Risk Report",i=["Risk Statement","Classification","Likelihood","Severity","Control Rating","Monitoring Rating","Approval Status","Department"],b=t(N).flatMap(x=>{var nt;const ot=t(v).filter(T=>T.risk_id===x.id);return ot.length===0?[[x.risk_statement,((nt=t(C).find(T=>T.id===x.classification))==null?void 0:nt.name)||"N/A","N/A","N/A","N/A","N/A",x.is_approved?"Admin Approved":x.is_approved_vp?"VP Approved":x.is_approved_president?"President Approved":"Pending",x.department_name||"N/A"]]:ot.map(T=>{var it,Nt,dt,kt,lt;return[x.risk_statement,((it=t(C).find(V=>V.id===x.classification))==null?void 0:it.name)||"N/A",((Nt=t(Y).find(V=>V.id===T.lr))==null?void 0:Nt.name)||"N/A",((dt=t(k).find(V=>V.id===T.s))==null?void 0:dt.value)||"N/A",((kt=t(z).find(V=>V.id===T.rcr))==null?void 0:kt.name)||"N/A",((lt=t(D).find(V=>V.id===T.rmr))==null?void 0:lt.status)||"N/A",x.is_approved?"Admin Approved":x.is_approved_vp?"VP Approved":x.is_approved_president?"President Approved":"Pending",x.department_name||"N/A"]})});e.setFontSize(14),e.text(r,14,15),Jt(e,{head:[i],body:b,startY:25,theme:"grid",styles:{fontSize:10},headStyles:{fillColor:[41,128,185]}});const u=e.internal.pageSize.height-40,S=e.internal.pageSize.width/4,o=[14,S,S*2,S*3];e.setFontSize(10);const p=t(N)[0],$=(p==null?void 0:p.user_name)||"Unknown",O=(p==null?void 0:p.department_name)||"Unknown";e.text(`${$||"Unknown"} (sgnd)`,o[0],u-5),e.text("_________________________",o[0],u),e.text(`${O||"Unknown"} Department Head`,o[0],u+5),e.text(`${U||"N/A"} (sgnd)`,o[1],u-5),e.text("_________________________",o[1],u),e.text("Corporate Planning Officer",o[1],u+5),e.text(`${I||"N/A"} (sgnd)`,o[2],u-5),e.text("_________________________",o[2],u),e.text("Vice President",o[2],u+5),e.text(`${at||"N/A"} (sgnd)`,o[3],u-5),e.text("_________________________",o[3],u),e.text("President",o[3],u+5),e.save("Risk_Report.pdf")};zt(async()=>{await bt(),await xt(),await st(),await At(),await yt(),await Pt(),await l(),await s(),await g(),await wt(),await ft()}),Vt();var Q=le(),K=c(n(Q),2),G=n(K);E(()=>{t(L),tt(()=>{t(F)})});var X=n(G);X.value=(X.__value="all")==null?"":"all";var St=c(X);ht(St,1,()=>t(F),gt,(e,r)=>{var i=ae(),b={},m=n(i,!0);a(i),E(()=>{b!==(b=t(r).name)&&(i.value=(i.__value=t(r).name)==null?"":t(r).name),y(m,t(r).name)}),R(e,i)}),a(G);var mt=c(G,2);a(K);var Rt=c(K,2);rt(Rt,()=>t(M),e=>{var r=se();R(e,r)},e=>{var r=Mt(),i=Ft(r);rt(i,()=>t(N).length===0,b=>{var m=oe();R(b,m)},b=>{var m=de(),u=c(n(m));ht(u,5,()=>t(N),gt,(S,o)=>{var p=ie(),$=n(p),O=n($,!0);a($);var x=c($),ot=n(x,!0);E(()=>{var ct;return y(ot,((ct=t(C).find(_t=>_t.id===t(o).classification))==null?void 0:ct.name)||"N/A")}),a(x);var nt=c(x),T=n(nt,!0);a(nt);var it=c(nt),Nt=n(it,!0);a(it);var dt=c(it),kt=n(dt,!0);a(dt);var lt=c(dt);ht(lt,5,()=>t(v).filter(ct=>ct.risk_id===t(o).id),gt,(ct,_t)=>{var Ct=ne(),Lt=c(n(Ct));E(()=>{var H;return y(Lt,` ${(((H=t(Y).find(Z=>Z.id===t(_t).lr))==null?void 0:H.name)||"N/A")??""}`)});var It=c(Lt,4);E(()=>{var H;return y(It,` ${(((H=t(k).find(Z=>Z.id===t(_t).s))==null?void 0:H.value)||"N/A")??""}`)});var Ht=c(It,4);E(()=>{var H;return y(Ht,` ${(((H=t(z).find(Z=>Z.id===t(_t).rcr))==null?void 0:H.name)||"N/A")??""}`)});var jt=c(Ht,4);E(()=>{var H;return y(jt,` ${(((H=t(D).find(Z=>Z.id===t(_t).rmr))==null?void 0:H.status)||"N/A")??""}`)}),a(Ct),R(ct,Ct)}),a(lt);var V=c(lt),ut=n(V),Tt=n(ut,!0);a(ut);var $t=c(ut,2),Yt=n($t,!0);a($t),a(V),a(p),E(()=>{y(O,t(o).risk_statement),y(T,t(o).actions),y(Nt,t(o).key_persons),y(kt,t(o).budget),ut.disabled=t(q)||t(h)==="admin"&&t(o).is_approved||t(h)==="vice_president"&&(!t(o).is_approved||t(o).is_approved_vp)||t(h)==="president"&&(!t(o).is_approved_vp||t(o).is_approved_president),y(Tt,t(h)==="admin"?t(o).is_approved?"Admin Approved":"Approve as Admin":t(h)==="vice_president"?t(o).is_approved_vp?"VP Approved":"Approve as VP":t(h)==="president"?t(o).is_approved_president?"President Approved":"Approve as President":"Approve"),$t.disabled=t(B)===t(o).id,y(Yt,t(B)===t(o).id?"Deleting...":"Delete")}),et("click",ut,()=>A(t(o).id)),et("click",$t,()=>j(t(o).id)),R(S,p)}),a(u),a(m),R(b,m)},!0),R(e,r)}),a(Q),Kt(G,()=>t(L),e=>d(L,e)),et("change",G,W),et("click",mt,J),R(pt,Q),Ut()}var _e=P("<p>Loading...</p>"),pe=P('<p class="text-red-500"> </p>'),ve=P("<div><!></div>");function Pe(pt,vt){qt(vt,!1);let f=null,N=w(null),v=w(!0),C=w(null);const Y=async()=>{try{const{data:D,error:F}=await _.auth.getSession();if(F)throw F;if(f=D.session,f){const{data:L,error:M}=await _.from("profiles").select("*").eq("id",f.user.id).single();if(M)throw M;d(N,L),console.log("Profile Id: ",t(N).id),console.log("Profile Role: ",t(N).role)}else d(C,"User is not logged in.")}catch(D){console.error(D.message),d(C,"Failed to fetch profile data.")}finally{d(v,!1)}};zt(()=>{Y()}),Vt();var k=ve(),z=n(k);rt(z,()=>t(v),D=>{var F=_e();R(D,F)},D=>{var F=Mt(),L=Ft(F);rt(L,()=>t(C),M=>{var q=pe(),B=n(q,!0);a(q),E(()=>y(B,t(C))),R(M,q)},M=>{var q=Mt(),B=Ft(q);rt(B,()=>{var h,U,I;return((h=t(N))==null?void 0:h.role)==="admin"||((U=t(N))==null?void 0:U.role)==="vice_president"||((I=t(N))==null?void 0:I.role)==="president"},h=>{ce(h,{})},h=>{re(h,{})}),R(M,q)},!0),R(D,F)}),a(k),R(pt,k),Ut()}export{Pe as component};
