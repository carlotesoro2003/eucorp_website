import{l as n,Y as E,Z as b,_ as g,q as I,$ as R}from"./runtime.CLSstnwU.js";import{i as S,f as $,d as B,n as G,g as M}from"./utils.kA-YjkFf.js";import{a as P,b as Y}from"./misc.C2nsS1Cr.js";function Z(s){if(n){var r=!1,i=()=>{if(!r){if(r=!0,s.hasAttribute("value")){var t=s.value;h(s,"value",null),s.value=t}if(s.hasAttribute("checked")){var _=s.checked;h(s,"checked",null),s.checked=_}}};s.__on_r=i,E(i),P()}}function j(s,r){var i=s.__attributes??(s.__attributes={});i.value===(i.value=r)||s.value===r&&(r!==0||s.nodeName!=="PROGRESS")||(s.value=r)}function h(s,r,i,t){var _=s.__attributes??(s.__attributes={});n&&(_[r]=s.getAttribute(r),r==="src"||r==="srcset"||r==="href"&&s.nodeName==="LINK")||_[r]!==(_[r]=i)&&(r==="style"&&"__styles"in s&&(s.__styles={}),r==="loading"&&(s[g]=i),i==null?s.removeAttribute(r):typeof i!="string"&&q(s).includes(r)?s[r]=i:s.setAttribute(r,i))}function H(s,r,i,t,_=!1,l=!1,C=!1){var f=r||{},w=s.tagName==="OPTION";for(var y in r)y in i||(i[y]=null);var z=q(s),L=s.__attributes??(s.__attributes={}),e=[];for(const a in i){let o=i[a];if(w&&a==="value"&&o==null){s.value=s.__value="",f[a]=o;continue}var p=f[a];if(o!==p){f[a]=o;var A=a[0]+a[1];if(A!=="$$"){if(A==="on"){const v={},d="$$"+a;let u=a.slice(2);var k=M(u);if(S(u)&&(u=u.slice(0,-7),v.capture=!0),!k&&p){if(o!=null)continue;s.removeEventListener(u,f[d],v),f[d]=null}if(o!=null)if(k)s[`__${u}`]=o,B([u]);else{let N=function(T){f[a].call(this,T)};r?f[d]=$(u,s,N,v):e.push([a,o,()=>f[d]=$(u,s,N,v)])}}else if(a==="style"&&o!=null)s.style.cssText=o+"";else if(a==="autofocus")Y(s,!!o);else if(a==="__value"||a==="value"&&o!=null)s.value=s[a]=s.__value=o;else{var c=a;_||(c=G(c)),o==null&&!l?(L[a]=null,s.removeAttribute(a)):z.includes(c)&&(l||typeof o!="string")?s[c]=o:typeof o!="function"&&(n&&(c==="src"||c==="href"||c==="srcset")||h(s,c,o))}a==="style"&&"__styles"in s&&(s.__styles={})}}}return r||I(()=>{if(s.isConnected)for(const[a,o,v]of e)f[a]===o&&v()}),f}var O=new Map;function q(s){var r=O.get(s.nodeName);if(r)return r;O.set(s.nodeName,r=[]);for(var i,t=b(s),_=Element.prototype;_!==t;){i=R(t);for(var l in i)i[l].set&&r.push(l);t=b(t)}return r}function J(s){if(!n&&s.loading==="lazy"){var r=s.src;s[g]=null,s.loading="eager",s.removeAttribute("src"),requestAnimationFrame(()=>{s[g]!=="eager"&&(s.loading="lazy"),s.src=r})}}export{j as a,H as b,J as h,Z as r,h as s};
