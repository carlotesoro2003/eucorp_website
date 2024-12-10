import"./disclose-version.Bg9kRutz.js";import{f as O,p as le,t as F,a as ce,g as t,s as o,b as r,m as u,c as n,r as l}from"./utils.CRNn4dtP.js";import{s as j}from"./render.xPn1qZIb.js";import{i as h}from"./if.CRsBAEFG.js";import{c as de,a as m,f as _,t as w}from"./store.B1kL-7Ni.js";import{r as P,s as V}from"./attributes.BcfEV1VJ.js";import{b as E}from"./input.o7SqHMM4.js";import{p as pe}from"./event-modifiers.CWmzcjye.js";import{i as ue}from"./lifecycle.DSkr6FdQ.js";import{s as $}from"./supabaseClient.BTuNJN2N.js";import{E as X}from"./eye.C9SOZpvn.js";import{I as ve,s as fe}from"./Icon.CEA2x5sb.js";import{l as me,s as ge}from"./preload-helper.Dwm_PvIR.js";function ee(q,z){const b=me(z,["children","$$slots","$$events","$$legacy"]);ve(q,ge({name:"eye-off"},()=>b,{iconNode:[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{d:"m2 2 20 20"}]],children:(y,k)=>{var g=de(),i=O(g);fe(i,z,"default",{}),m(y,g)},$$slots:{default:!0}}))}var he=w('<div class="flex gap-4"><input type="text" placeholder="First Name" required class="input input-bordered w-full"> <input type="text" placeholder="Last Name" required class="input input-bordered w-full"></div>'),we=w('<div class="relative"><input placeholder="Confirm Password" required class="input input-bordered w-full"> <button type="button" class="absolute inset-y-0 right-4 flex items-center"><!></button></div>'),be=w('<span class="loading loading-spinner loading-sm"></span>'),xe=w('<p class="text-sm text-center mt-4 text-error"> </p>'),_e=w(`Don't have an account? <button class="text-primary font-medium">Register</button>`,1),ye=w('Already have an account? <button class="text-primary font-medium">Login</button>',1),ke=w(`<div class="h-screen grid lg:grid-cols-2"><div class="relative hidden lg:block" style="
      background-image: 
        linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%),
        url('/images/login_bg.png');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    "><div class="relative z-10 h-full flex flex-col items-center justify-center space-y-4 p-10"><div class="text-center"><h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">EuCorp</h1> <p class="text-xl text-gray-300 max-w-md">Our Institutional Planning System</p></div> <div class="mt-6 space-y-2 text-gray-200"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Streamline Project Management</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Enhance Collaboration</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Monitor Progress Effectively</p></div></div></div></div> <div class="flex items-center justify-center px-8"><div class="w-full max-w-md"><div class="text-center mb-8"><h1 class="text-2xl font-semibold"> </h1> <p class="text-gray-600"> </p></div> <form class="space-y-4"><!> <input type="email" placeholder="name@example.com" required class="input input-bordered w-full"> <div class="relative"><input placeholder="Password" required class="input input-bordered w-full"> <button type="button" class="absolute inset-y-0 right-4 flex items-center"><!></button></div> <!> <button type="submit" class="btn bg-rose-700 w-full text-white"><!> <span> </span></button></form> <!> <div class="divider">OR</div> <button type="button" class="btn bg-blue-600 w-full text-white flex items-center justify-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-5 h-5" fill="none"><path d="M126.23 14.7L0 207.43h71.54L126.23 80.7l54.7 126.74h71.54L126.23 14.7Z" fill="#0078D4"></path><path d="M88.73 213.22H176l-44.76-79.55-42.51 79.55Z" fill="#008AD7"></path><path d="M176 213.22H252L200.28 127l-24.28 86.22Z" fill="#0079B7"></path></svg> <span>Sign in with Azure</span></button> <p class="text-sm text-center mt-4"><!></p></div></div></div>`);function Be(q,z){le(z,!1);let b=u(""),x=u(""),y=u(""),k=u(""),g=u(""),i=u(""),d=u(!1),p=u(!0),v=u(!1);async function te(){if(r(d,!0),r(i,""),t(p)){const{data:e,error:s}=await $.auth.signInWithPassword({email:t(b),password:t(x)});if(s){r(i,`Failed to login: ${s.message}`),console.error("Login error:",s),r(d,!1);return}const a=e==null?void 0:e.user;if(a){const{data:c,error:f}=await $.from("profiles").select("is_verified").eq("id",a.id).single();if(f){console.error("Error fetching profile:",f),r(i,"Error checking verification status."),r(d,!1);return}if(!(c!=null&&c.is_verified)){r(i,"Your account is pending verification."),r(d,!1);return}r(i,"Login successful! Redirecting..."),setTimeout(()=>{window.location.href="/dashboard"},1e3)}}else{if(t(x)!==t(y)){r(i,"Passwords do not match."),r(d,!1);return}const{data:e,error:s}=await $.auth.signUp({email:t(b),password:t(x),options:{data:{first_name:t(k),last_name:t(g)}}});if(s){r(i,`Failed to register: ${s.message}`),console.error("Registration error:",s),r(d,!1);return}const a=e==null?void 0:e.user;if(a){const{error:c}=await $.from("profiles").insert({id:a.id,email:a.email,first_name:t(k),last_name:t(g),role:"user",is_verified:!1});if(c){console.error("Error inserting profile:",c),r(i,"Profile creation failed. Please try again later."),r(d,!1);return}}r(i,"Registration successful! Please check your email for verification.")}r(d,!1)}async function re(){try{const{error:e,data:s}=await $.auth.signInWithOAuth({provider:"azure",options:{scopes:"email openid profile",redirectTo:"https://eqkwwbmbswmpjpfzttov.supabase.co/auth/v1/callback"}});if(e){r(i,`Failed to initiate Azure login: ${e.message}`),console.error("Azure login initiation error:",e);return}r(i,"Redirecting to Azure login...")}catch(e){console.error("Error during Azure sign-in:",e),r(i,"Unexpected error occurred. Please try again.")}}ue();var C=ke(),Z=o(n(C),2),H=n(Z),R=n(H),I=n(R),se=n(I,!0);l(I);var T=o(I,2),ae=n(T,!0);l(T),l(R);var A=o(R,2),U=n(A);h(U,()=>!t(p),e=>{var s=he(),a=n(s);P(a);var c=o(a,2);P(c),l(s),E(a,()=>t(k),f=>r(k,f)),E(c,()=>t(g),f=>r(g,f)),m(e,s)});var N=o(U,2);P(N);var B=o(N,2),M=n(B);P(M);var S=o(M,2),ie=n(S);h(ie,()=>t(v),e=>{ee(e,{class:"w-5 h-5"})},e=>{X(e,{class:"w-5 h-5"})}),l(S),l(B);var W=o(B,2);h(W,()=>!t(p),e=>{var s=we(),a=n(s);P(a);var c=o(a,2),f=n(c);h(f,()=>t(v),L=>{ee(L,{class:"w-5 h-5"})},L=>{X(L,{class:"w-5 h-5"})}),l(c),l(s),F(()=>V(a,"type",t(v)?"text":"password")),E(a,()=>t(y),L=>r(y,L)),_("click",c,()=>r(v,!t(v))),m(e,s)});var D=o(W,2),Y=n(D);h(Y,()=>t(d),e=>{var s=be();m(e,s)});var G=o(Y,2),oe=n(G,!0);l(G),l(D),l(A);var J=o(A,2);h(J,()=>t(i),e=>{var s=xe(),a=n(s,!0);l(s),F(()=>j(a,t(i))),m(e,s)});var K=o(J,4),Q=o(K,2),ne=n(Q);h(ne,()=>t(p),e=>{var s=_e(),a=o(O(s));_("click",a,()=>r(p,!1)),m(e,s)},e=>{var s=ye(),a=o(O(s));_("click",a,()=>r(p,!0)),m(e,s)}),l(Q),l(H),l(Z),l(C),F(()=>{j(se,t(p)?"Login":"Create an Account"),j(ae,t(p)?"Sign in to continue":"Enter your details to register"),V(M,"type",t(v)?"text":"password"),D.disabled=t(d),j(oe,t(d)?"Processing...":t(p)?"Login":"Register")}),E(N,()=>t(b),e=>r(b,e)),E(M,()=>t(x),e=>r(x,e)),_("click",S,()=>r(v,!t(v))),_("submit",A,pe(te)),_("click",K,re),m(q,C),ce()}export{Be as L};