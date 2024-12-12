import"../chunks/disclose-version.Bg9kRutz.js";import{f as j,p as ge,a as ye,b as p,g as e,t as ee,e as w,c as t,s as i,r as s,n as A}from"../chunks/utils.Cx6K9qTo.js";import{e as B,a as m,d as _e,t as $,f as be,g as E}from"../chunks/store.BALTJZ26.js";import{i as C}from"../chunks/if.Bgpzl8Wa.js";import{r as D,s as he,c as ae}from"../chunks/attributes.rzeD2olC.js";import{s as xe}from"../chunks/class.DKwifj_X.js";import{t as re,a as we,f as $e}from"../chunks/index.3UqCw1jp.js";import{b as te}from"../chunks/input.BVFrb_g3.js";import{l as le,s as ie,a as N}from"../chunks/preload-helper.Tg4Km7Zr.js";import{I as oe,a as ne,s as L}from"../chunks/Icon.Nl6wOSVO.js";import{U as Pe}from"../chunks/user.CufSo2Fj.js";import{L as se}from"../chunks/loader-circle.DGJ4eXRr.js";function Ne(g,f){const n=le(f,["children","$$slots","$$events","$$legacy"]);oe(g,ie({name:"camera"},()=>n,{iconNode:[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"}],["circle",{cx:"12",cy:"13",r:"3"}]],children:(_,b)=>{var d=B(),v=j(d);ne(v,f,"default",{}),m(_,d)},$$slots:{default:!0}}))}function Ue(g,f){const n=le(f,["children","$$slots","$$events","$$legacy"]);oe(g,ie({name:"mail"},()=>n,{iconNode:[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"}]],children:(_,b)=>{var d=B(),v=j(d);ne(v,f,"default",{}),m(_,d)},$$slots:{default:!0}}))}const ke=async(g,f,n)=>{const a=g.target;a.files&&a.files[0]&&(p(f,N(a.files[0])),n())};var Ee=$('<div class="flex flex-col items-center justify-center h-[60vh] gap-3"><!> <p class="text-lg text-gray-600">Loading your profile...</p></div>'),Ce=$('<img alt="Profile" class="w-full h-full object-cover">'),De=$('<div class="w-full h-full bg-gray-100 flex items-center justify-center"><!></div>'),Le=$("<!> Saving...",1),je=$('<div class="bg-white rounded-xl shadow-sm p-6 md:p-8"><h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1> <form class="space-y-6"><div class="flex flex-col items-center gap-4"><div class="relative group cursor-pointer"><div><!></div> <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><!></div> <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"></div> <p class="text-sm text-gray-500">Drag and drop or click to change profile picture</p></div> <div class="grid md:grid-cols-2 gap-6"><div class="space-y-2"><label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label> <input id="firstName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your first name"></div> <div class="space-y-2"><label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label> <input id="lastName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your last name"></div> <div class="space-y-2"><label for="email" class="block text-sm font-medium text-gray-700">Email</label> <div class="relative"><!> <input id="email" type="email" disabled class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"></div></div> <div class="space-y-2"><label for="role" class="block text-sm font-medium text-gray-700">Role</label> <input id="role" type="text" disabled class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"></div></div> <div class="flex justify-end pt-4"><button type="submit" class="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><!></button></div></form></div>'),ze=$('<div class="min-h-screen bg-gray-50 text-gray-900 w-full py-8 px-4"><div class="max-w-2xl mx-auto"><!></div></div>');function Je(g,f){ge(f,!0);let{session:n}=f.data,a=w(null),_=w(!0),b=w(!1),d=w(null),v=w(null),U=w(!1);const de=async()=>{if(n){const{user:o}=n,{data:r,error:u}=await L.from("profiles").select("first_name, last_name, email, role, profile_pic").eq("id",o.id).single();u?console.error("Error fetching user profile:",u.message):(p(a,N(r)),p(v,N(e(a).profile_pic||null)))}p(_,!1)},z=async()=>{if(!e(a)||!n)return;p(b,!0);const{user:o}=n;try{let r=e(a).profile_pic;if(e(d)){const{data:y,error:x}=await L.storage.from("profile-pictures").upload(`public/${o.id}/${e(d).name}`,e(d),{cacheControl:"3600",upsert:!0});if(x)throw x;y&&(r=L.storage.from("profile-pictures").getPublicUrl(y.path).data.publicUrl,p(v,N(r)))}const{error:u}=await L.from("profiles").update({first_name:e(a).first_name,last_name:e(a).last_name,email:e(a).email,profile_pic:r}).eq("id",o.id);if(u)throw u;const h=document.createElement("div");h.className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg",h.textContent="Profile updated successfully!",document.body.appendChild(h),setTimeout(()=>h.remove(),3e3)}catch(r){console.error("Error:",r)}finally{p(b,!1)}},ce=o=>{var r;o.preventDefault(),p(U,!1),(r=o.dataTransfer)!=null&&r.files.length&&(p(d,N(o.dataTransfer.files[0])),z())};de();var I=ze(),G=t(I),pe=t(G);C(pe,()=>e(_),o=>{var r=Ee(),u=t(r);se(u,{class:"w-8 h-8 animate-spin text-primary"}),A(2),s(r),re(1,r,()=>$e),m(o,r)},o=>{var r=B(),u=j(r);C(u,()=>n!==null&&e(a),h=>{var y=je(),x=i(t(y),2),S=t(x),P=t(S),k=t(P),fe=t(k);C(fe,()=>e(v),l=>{var c=Ce();ee(()=>he(c,"src",e(v))),m(l,c)},l=>{var c=De(),V=t(c);Pe(V,{class:"w-12 h-12 text-gray-400"}),s(c),m(l,c)}),s(k);var T=i(k,2),me=t(T);Ne(me,{class:"w-8 h-8 text-white"}),s(T);var ue=i(T,2);ue.__change=[ke,d,z],s(P),A(2),s(S);var q=i(S,2),F=t(q),J=i(t(F),2);D(J),s(F);var M=i(F,2),K=i(t(M),2);D(K),s(M);var H=i(M,2),O=i(t(H),2),Q=t(O);Ue(Q,{class:"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"});var W=i(Q,2);D(W),s(O),s(H);var X=i(H,2),Y=i(t(X),2);D(Y),s(X),s(q);var Z=i(q,2),R=t(Z),ve=t(R);C(ve,()=>e(b),l=>{var c=Le(),V=j(c);se(V,{class:"w-4 h-4 animate-spin"}),A(),m(l,c)},l=>{var c=be("Save Changes");m(l,c)}),s(R),s(Z),s(x),s(y),ee(()=>{xe(k,`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${e(U)?"border-primary scale-105":"border-gray-100"}`),ae(W,e(a).email??""),ae(Y,e(a).role??"User"),R.disabled=e(b)}),E("submit",x,z),E("dragover",P,l=>{l.preventDefault(),p(U,!0)}),E("dragleave",P,()=>p(U,!1)),E("drop",P,ce),te(J,()=>e(a).first_name,l=>e(a).first_name=l),te(K,()=>e(a).last_name,l=>e(a).last_name=l),re(1,y,()=>we,()=>({y:20,duration:600})),m(h,y)},null,!0),m(o,r)}),s(G),s(I),m(g,I),ye()}_e(["change"]);export{Je as component};