import{s as C}from"../chunks/supabaseClient.BTuNJN2N.js";import"../chunks/disclose-version.Bg9kRutz.js";import{k as Qe,o as be,y as we,l as Je,v as $e,a5 as Ze,ag as We,af as Xe,K as et,a1 as tt,x as rt,f as p,p as H,a as Y,t as Pe,s as y,a9 as N,aa as Ie,g as S,m as O,a8 as A,b as F,c as ee,n as D,r as te}from"../chunks/utils.CRNn4dtP.js";import{i as Se,q as at,c as T,a as m,t as b,s as Le,b as re,e as ke}from"../chunks/store.B1kL-7Ni.js";import{i as V}from"../chunks/if.CRsBAEFG.js";import{I as ie,s as G}from"../chunks/Icon.CEA2x5sb.js";import{i as Q}from"../chunks/lifecycle.DSkr6FdQ.js";/* empty css                         */import{g as K}from"../chunks/entry.DOGBvY7d.js";import{o as Ae}from"../chunks/index-client.BdGz_wQc.js";import{p as st}from"../chunks/stores.DcEtjLim.js";import{u as R,S as ot,A as nt,a as it,b as lt,c as dt,B as ct,d as mt,e as Ne,f as ut,g as ft,h as ht,i as Me}from"../chunks/breadcrumb-page.CaLZm5r5.js";import{L as gt}from"../chunks/Login.CIQvAph9.js";import{g as le,d as Ve,w as M}from"../chunks/index.DOYwEOHp.js";import{l as de,s as ce,p as _}from"../chunks/preload-helper.Dwm_PvIR.js";import{s as Ke}from"../chunks/attributes.BcfEV1VJ.js";import{a as vt}from"../chunks/render.xPn1qZIb.js";function _t(r,e,o,a,i){var l=r,t="",n;Qe(()=>{if(t===(t=e()??"")){be&&we();return}n!==void 0&&(rt(n),n=void 0),t!==""&&(n=Je(()=>{if(be){$e.data;for(var s=we(),c=s;s!==null&&(s.nodeType!==8||s.data!=="");)c=s,s=Ze(s);if(s===null)throw We(),Xe;Se($e,c),l=et(s);return}var u=t+"",d=at(u);Se(tt(d),d.lastChild),l.before(d)}))})}const pt=async()=>{const{data:{session:r}}=await C.auth.getSession(),{data:{user:e}}=await C.auth.getUser();return{supabase:C,user:e,session:r}},cr=Object.freeze(Object.defineProperty({__proto__:null,load:pt},Symbol.toStringTag,{value:"Module"}));function yt(r,e){const o=de(e,["children","$$slots","$$events","$$legacy"]);ie(r,ce({name:"bell"},()=>o,{iconNode:[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"}]],children:(i,l)=>{var t=T(),n=p(t);G(n,e,"default",{}),m(i,t)},$$slots:{default:!0}}))}let Ee,Ce;function Re(r){if(typeof document>"u")return;clearTimeout(Ee),clearTimeout(Ce);const e=document.createElement("style"),o=document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);e.appendChild(o);const a=()=>document.head.appendChild(e),i=()=>document.head.removeChild(e);if(typeof window.getComputedStyle<"u"){a(),r(),window.getComputedStyle(e).opacity,i();return}if(typeof window.requestAnimationFrame<"u"){a(),r(),window.requestAnimationFrame(i);return}a(),Ee=window.setTimeout(()=>{r(),Ce=window.setTimeout(i,120)},120)}function Te(r){return r.filter(e=>e.length>0)}const xe={getItem:r=>null,setItem:(r,e)=>{}},P=typeof document<"u",bt=["dark","light","system"],ae=M("mode-watcher-mode"),se=M("mode-watcher-theme"),me=$t(),oe=kt(),ze=M(void 0),Be=St(),ue=M(!0),Ue=M([]),qe=M([]),je=Nt(),wt=Mt();function $t(){const r="system",e=P?localStorage:xe,o=e.getItem(i());let a=ne(o)?o:r;function i(){return le(ae)}const{subscribe:l,set:t}=M(a,()=>{if(!P)return;const s=c=>{if(c.key!==i())return;const u=c.newValue;ne(u)?t(a=u):t(a=r)};return addEventListener("storage",s),()=>removeEventListener("storage",s)});function n(s){t(a=s),e.setItem(i(),a)}return{subscribe:l,set:n}}function St(){const r=P?localStorage:xe,e=r.getItem(a());let o=e??"";function a(){return le(se)}const{subscribe:i,set:l}=M(o,()=>{if(!P)return;const n=s=>{if(s.key!==a())return;const c=s.newValue;l(c===null?o="":o=c)};return addEventListener("storage",n),()=>removeEventListener("storage",n)});function t(n){l(o=n),r.setItem(a(),o)}return{subscribe:i,set:t}}function kt(){let e=!0;const{subscribe:o,set:a}=M(void 0,()=>{if(!P)return;const t=s=>{e&&a(s.matches?"light":"dark")},n=window.matchMedia("(prefers-color-scheme: light)");return n.addEventListener("change",t),()=>n.removeEventListener("change",t)});function i(){if(!P)return;const t=window.matchMedia("(prefers-color-scheme: light)");a(t.matches?"light":"dark")}function l(t){e=t}return{subscribe:o,query:i,tracking:l}}function Nt(){const{subscribe:r}=Ve([me,oe,ze,ue,Ue,qe],([e,o,a,i,l,t])=>{if(!P)return;const n=e==="system"?o:e,s=Te(l),c=Te(t);function u(){const d=document.documentElement,g=document.querySelector('meta[name="theme-color"]');n==="light"?(s.length&&d.classList.remove(...s),c.length&&d.classList.add(...c),d.style.colorScheme="light",g&&a&&g.setAttribute("content",a.light)):(c.length&&d.classList.remove(...c),s.length&&d.classList.add(...s),d.style.colorScheme="dark",g&&a&&g.setAttribute("content",a.dark))}return i?Re(u):u(),n});return{subscribe:r}}function Mt(){const{subscribe:r}=Ve([Be,ue],([e,o])=>{if(!P)return;function a(){document.documentElement.setAttribute("data-theme",e)}return o?Re(a):a(),e});return{subscribe:r}}function ne(r){return typeof r!="string"?!1:bt.includes(r)}function Et(){me.set(le(je)==="dark"?"light":"dark")}function Ct(r){me.set(r)}function Tt(r){Be.set(r)}function Pt({defaultMode:r="system",themeColors:e,darkClassNames:o=["dark"],lightClassNames:a=[],defaultTheme:i="",modeStorageKey:l="mode-watcher-mode",themeStorageKey:t="mode-watcher-theme"}){const n=document.documentElement,s=localStorage.getItem(l)||r,c=localStorage.getItem(t)||i,u=s==="light"||s==="system"&&window.matchMedia("(prefers-color-scheme: light)").matches;if(u?(o.length&&n.classList.remove(...o),a.length&&n.classList.add(...a)):(a.length&&n.classList.remove(...a),o.length&&n.classList.add(...o)),n.style.colorScheme=u?"light":"dark",e){const d=document.querySelector('meta[name="theme-color"]');d&&d.setAttribute("content",s==="light"?e.light:e.dark)}c&&(n.setAttribute("data-theme",c),localStorage.setItem(t,c)),localStorage.setItem(l,s)}var It=b('<meta name="theme-color">');function Lt(r,e){H(e,!1);let o=_(e,"themeColors",24,()=>{});Q();var a=T(),i=p(a);V(i,o,l=>{var t=It();Pe(()=>Ke(t,"content",o().dark)),m(l,t)}),m(r,a),Y()}var At=b('<meta name="theme-color">'),Vt=b("<!> <!>",1);function Kt(r,e){H(e,!1);let o=_(e,"trueNonce",8,""),a=_(e,"initConfig",8),i=_(e,"themeColors",24,()=>{});Q(),vt(l=>{var t=Vt(),n=p(t);V(n,i,c=>{var u=At();Pe(()=>Ke(u,"content",i().dark)),m(c,u)});var s=y(n,2);_t(s,()=>`<script${o()?` nonce=${o()}`:""}>(`+Pt.toString()+")("+JSON.stringify(a())+");<\/script>",!1,!1),m(l,t)}),Y()}function Rt(r,e){H(e,!1);const o=Le(),a=()=>re(ae,"$modeStorageKeyStore",o),i=()=>re(se,"$themeStorageKeyStore",o),l=O();let t=_(e,"track",8,!0),n=_(e,"defaultMode",8,"system"),s=_(e,"themeColors",24,()=>{}),c=_(e,"disableTransitions",8,!0),u=_(e,"darkClassNames",24,()=>["dark"]),d=_(e,"lightClassNames",24,()=>[]),g=_(e,"defaultTheme",8,""),w=_(e,"nonce",8,""),h=_(e,"themeStorageKey",8,"mode-watcher-theme"),f=_(e,"modeStorageKey",8,"mode-watcher-mode"),E=_(e,"disableHeadScriptInjection",8,!1);Ae(()=>{const k=je.subscribe(()=>{}),q=wt.subscribe(()=>{});oe.tracking(t()),oe.query();const x=localStorage.getItem(a());Ct(ne(x)?x:n());const z=localStorage.getItem(i());return Tt(z||g()),()=>{k(),q()}});const v={defaultMode:n(),themeColors:s(),darkClassNames:u(),lightClassNames:d(),defaultTheme:g(),modeStorageKey:f(),themeStorageKey:h()};N(()=>A(c()),()=>{ue.set(c())}),N(()=>A(s()),()=>{ze.set(s())}),N(()=>A(u()),()=>{Ue.set(u())}),N(()=>A(d()),()=>{qe.set(d())}),N(()=>A(f()),()=>{ae.set(f())}),N(()=>A(h()),()=>{se.set(h())}),N(()=>A(w()),()=>{F(l,typeof window>"u"?w():"")}),Ie(),Q();var $=T(),I=p($);V(I,E,k=>{Lt(k,{get themeColors(){return s()}})},k=>{Kt(k,{get trueNonce(){return S(l)},initConfig:v,get themeColors(){return s()}})}),m(r,$),Y()}function xt(r,e){const o=de(e,["children","$$slots","$$events","$$legacy"]);ie(r,ce({name:"sun"},()=>o,{iconNode:[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"m17.66 17.66 1.41 1.41"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m6.34 17.66-1.41 1.41"}],["path",{d:"m19.07 4.93-1.41 1.41"}]],children:(i,l)=>{var t=T(),n=p(t);G(n,e,"default",{}),m(i,t)},$$slots:{default:!0}}))}function zt(r,e){const o=de(e,["children","$$slots","$$events","$$legacy"]);ie(r,ce({name:"moon"},()=>o,{iconNode:[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"}]],children:(i,l)=>{var t=T(),n=p(t);G(n,e,"default",{}),m(i,t)},$$slots:{default:!0}}))}var Bt=b('<div class="flex items-center justify-center min-h-screen "><span class="loading loading-spinner loading-lg"></span></div>'),Ut=b("<!> <!> <!>",1),qt=b('<!> <!> <span class="sr-only">Toggle theme</span>',1),jt=b('<!> <span class="sr-only">Notifications</span>',1),Dt=b('<header class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0  z-10"><div class="flex items-center gap-2 px-4"><!> <!> <!></div> <div class="flex items-center gap-3 pr-4"><!> <!></div></header> <!>',1),Ot=b("<!> <!>",1),Ft=b('<div class="flex items-center justify-center min-h-screen "><div class="text-center"><h1 class="text-4xl font-bold  mb-4">Pending for System Access</h1> <p>Your account is under review. Please wait for verification.</p></div></div>'),Ht=b("<!> <!>",1);function mr(r,e){H(e,!1);const o=Le(),a=()=>re(st,"$page",o),i=O();let l=O(!0),t=O({session:null,isVerified:!1,userRole:null,profilePic:null,email:null,departmentName:""});const n=async()=>{var d,g,w;try{if(!S(t).session){const{data:v,error:$}=await C.auth.getSession();if($||!(v!=null&&v.session)){console.log("No active session found. Redirecting to /login."),K("/login");return}R.update(I=>({...I,session:v.session}))}const{session:h}=S(t),{data:f,error:E}=await C.from("profiles").select("id, role, is_verified, profile_pic, department_id, email, first_name, last_name").eq("id",h.user.id).single();if(E)if(E.code==="PGRST116"){console.log("User not found. Adding new user profile.");const{error:v}=await C.from("profiles").insert({id:h.user.id,email:h.user.email,first_name:((d=h.user.user_metadata)==null?void 0:d.first_name)||"New",last_name:((g=h.user.user_metadata)==null?void 0:g.last_name)||"User",role:"user",is_verified:!1});if(v){console.error("Error adding user profile:",v.message),K("/login");return}}else{console.error("Error fetching profile:",E.message),K("/login");return}f&&(R.set({session:h,isVerified:f.is_verified??!1,userRole:f.role??null,profilePic:f.profile_pic,email:f.email,departmentName:f.department_id?((w=(await C.from("departments").select("name").eq("id",f.department_id).single()).data)==null?void 0:w.name)??"No Department":"",firstName:f.first_name||"New",lastName:f.last_name||"User"}),f.is_verified&&S(i)==="/"&&(console.log("Redirecting to /dashboard."),K("/dashboard")))}catch(h){console.error("Error during session check:",h),K("/login")}finally{F(l,!1)}};Ae(()=>{n();const{data:d}=C.auth.onAuthStateChange((g,w)=>{g==="SIGNED_OUT"?(console.log("User signed out, redirecting to /login."),R.set({session:null,isVerified:!1,userRole:null,profilePic:null,email:null,departmentName:"",firstName:"New",lastName:"User"}),K("/login")):w&&(console.log("User signed in or session updated."),R.update(h=>({...h,session:w})),n())});return()=>{d.subscription.unsubscribe()}}),N(()=>a(),()=>{F(i,a().url.pathname)}),N(()=>R,()=>{R.subscribe(d=>{F(t,d)})}),Ie(),Q();var s=Ht(),c=p(s);Rt(c,{});var u=y(c,2);V(u,()=>S(l),d=>{var g=Bt();m(d,g)},d=>{var g=T(),w=p(g);V(w,()=>S(t).session&&S(t).isVerified,h=>{ot(h,{children:(f,E)=>{var v=Ot(),$=p(v);nt($,{get userRole(){return S(t).userRole}});var I=y($,2);it(I,{children:(k,q)=>{var x=Dt(),z=p(x),J=ee(z),fe=ee(J);lt(fe,{class:"-ml-1"});var he=y(fe,2);dt(he,{orientation:"vertical",class:"mr-2 h-4"});var De=y(he,2);ct(De,{children:(B,_e)=>{mt(B,{children:(L,U)=>{var j=Ut(),pe=p(j);Ne(pe,{class:"hidden md:block",children:(Z,Ye)=>{ut(Z,{href:"#",children:(W,Ge)=>{D();var X=ke("Building Your Application");m(W,X)},$$slots:{default:!0}})},$$slots:{default:!0}});var ye=y(pe,2);ft(ye,{class:"hidden md:block"});var He=y(ye,2);Ne(He,{children:(Z,Ye)=>{ht(Z,{children:(W,Ge)=>{D();var X=ke("Data Fetching");m(W,X)},$$slots:{default:!0}})},$$slots:{default:!0}}),m(L,j)},$$slots:{default:!0}})},$$slots:{default:!0}}),te(J);var ge=y(J,2),ve=ee(ge);Me(ve,{onclick:Et,variant:"outline",size:"icon",children:(B,_e)=>{var L=qt(),U=p(L);xt(U,{class:"h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"});var j=y(U,2);zt(j,{class:"absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),D(2),m(B,L)},$$slots:{default:!0}});var Oe=y(ve,2);Me(Oe,{variant:"outline",size:"icon",onclick:()=>alert("Notifications clicked!"),children:(B,_e)=>{var L=jt(),U=p(L);yt(U,{class:"h-[1.2rem] w-[1.2rem]"}),D(2),m(B,L)},$$slots:{default:!0}}),te(ge),te(z);var Fe=y(z,2);G(Fe,e,"default",{}),m(k,x)},$$slots:{default:!0}}),m(f,v)},$$slots:{default:!0}})},h=>{var f=T(),E=p(f);V(E,()=>!S(t).session,v=>{gt(v,{})},v=>{var $=T(),I=p($);V(I,()=>!S(t).isVerified,k=>{var q=Ft();m(k,q)},null,!0),m(v,$)},!0),m(h,f)},!0),m(d,g)}),m(r,s),Y()}export{mr as component,cr as universal};