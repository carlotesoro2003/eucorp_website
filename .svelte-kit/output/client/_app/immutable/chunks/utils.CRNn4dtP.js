var Fn=Array.isArray,Mn=Array.from,Ln=Object.defineProperty,dt=Object.getOwnPropertyDescriptor,tn=Object.getOwnPropertyDescriptors,Hn=Object.prototype,Yn=Array.prototype,nn=Object.getPrototypeOf;function jn(t){return typeof t=="function"}const rn=()=>{};function Un(t){return t()}function Tt(t){for(var n=0;n<t.length;n++)t[n]()}const w=2,At=4,U=8,ut=16,m=32,Q=64,R=128,K=256,p=512,g=1024,q=2048,N=4096,B=8192,en=16384,xt=32768,sn=65536,an=1<<18,gt=1<<19,ht=Symbol("$state"),Bn=Symbol("");function St(t){return t===this.v}function un(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function kt(t){return!un(t,this.v)}function ln(t){throw new Error("effect_in_teardown")}function on(){throw new Error("effect_in_unowned_derived")}function fn(t){throw new Error("effect_orphan")}function _n(){throw new Error("effect_update_depth_exceeded")}function Vn(){throw new Error("hydration_failed")}function Gn(t){throw new Error("props_invalid_value")}function Kn(){throw new Error("state_descriptors_fixed")}function $n(){throw new Error("state_prototype_fixed")}function cn(){throw new Error("state_unsafe_local_read")}function vn(){throw new Error("state_unsafe_mutation")}function lt(t){return{f:0,v:t,reactions:null,equals:St,version:0}}function Zn(t){return It(lt(t))}function pn(t,n=!1){var e;const r=lt(t);return n||(r.equals=kt),i!==null&&i.l!==null&&((e=i.l).s??(e.s=[])).push(r),r}function zn(t,n=!1){return It(pn(t,n))}function It(t){return o!==null&&o.f&w&&(y===null?Rn([t]):y.push(t)),t}function Et(t,n){return ot(t,X(()=>vt(t))),n}function ot(t,n){return o!==null&&ct()&&o.f&(w|ut)&&(y===null||!y.includes(t))&&vn(),dn(t,n)}function dn(t,n){return t.equals(n)||(t.v=n,t.version=Zt(),Rt(t,g),ct()&&l!==null&&l.f&p&&!(l.f&m)&&(_!==null&&_.includes(t)?(E(l,g),W(l)):x===null?Cn([t]):x.push(t))),n}function Rt(t,n){var r=t.reactions;if(r!==null)for(var e=ct(),s=r.length,a=0;a<s;a++){var u=r[a],f=u.f;f&g||!e&&u===l||(E(u,n),f&(p|R)&&(f&w?Rt(u,q):W(u)))}}const Jn=1,Qn=2,Wn=4,Xn=8,tr=16,nr=1,rr=2,er=4,sr=8,ar=16,ur=1,lr=2,hn="[",En="[!",yn="]",Ct={},or=Symbol(),ir="http://www.w3.org/2000/svg";function Dt(t){console.warn("hydration_mismatch")}let I=!1;function fr(t){I=t}let h;function H(t){if(t===null)throw Dt(),Ct;return h=t}function _r(){return H(C(h))}function cr(t){if(I){if(C(h)!==null)throw Dt(),Ct;h=t}}function vr(t=1){if(I){for(var n=t,r=h;n--;)r=C(r);h=r}}function pr(){for(var t=0,n=h;;){if(n.nodeType===8){var r=n.data;if(r===yn){if(t===0)return n;t-=1}else(r===hn||r===En)&&(t+=1)}var e=C(n);n.remove(),n=e}}var yt,Ot,bt;function dr(){if(yt===void 0){yt=window;var t=Element.prototype,n=Node.prototype;Ot=dt(n,"firstChild").get,bt=dt(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function nt(t=""){return document.createTextNode(t)}function rt(t){return Ot.call(t)}function C(t){return bt.call(t)}function hr(t,n){if(!I)return rt(t);var r=rt(h);if(r===null)r=h.appendChild(nt());else if(n&&r.nodeType!==3){var e=nt();return r==null||r.before(e),H(e),e}return H(r),r}function Er(t,n){if(!I){var r=rt(t);return r instanceof Comment&&r.data===""?C(r):r}return h}function yr(t,n=1,r=!1){let e=I?h:t;for(;n--;)e=C(e);if(!I)return e;var s=e.nodeType;if(r&&s!==3){var a=nt();return e==null||e.before(a),H(a),a}return H(e),e}function wr(t){t.textContent=""}function wn(t){var n=w|g;l===null?n|=R:l.f|=gt;const r={children:null,ctx:i,deps:null,equals:St,f:n,fn:t,reactions:null,v:null,version:0,parent:l};if(o!==null&&o.f&w){var e=o;(e.children??(e.children=[])).push(r)}return r}function mr(t){const n=wn(t);return n.equals=kt,n}function Nt(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&w?it(e):F(e)}}}function qt(t){var n,r=l;J(t.parent);try{Nt(t),n=zt(t)}finally{J(r)}return n}function Pt(t){var n=qt(t),r=(k||t.f&R)&&t.deps!==null?q:p;E(t,r),t.equals(n)||(t.v=n,t.version=Zt())}function it(t){Nt(t),j(t,0),E(t,B),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Ft(t){l===null&&o===null&&fn(),o!==null&&o.f&R&&on(),_t&&ln()}function mn(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function P(t,n,r,e=!0){var s=(t&Q)!==0,a=l,u={ctx:i,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|g,first:null,fn:n,last:null,next:null,parent:s?null:a,prev:null,teardown:null,transitions:null,version:0};if(r){var f=O;try{wt(!0),V(u),u.f|=en}catch(c){throw F(u),c}finally{wt(f)}}else n!==null&&W(u);var T=r&&u.deps===null&&u.first===null&&u.nodes_start===null&&u.teardown===null&&(u.f&gt)===0;if(!T&&!s&&e&&(a!==null&&mn(u,a),o!==null&&o.f&w)){var A=o;(A.children??(A.children=[])).push(u)}return u}function Tr(){return o===null?!1:!k}function Ar(t){const n=P(U,null,!1);return E(n,p),n.teardown=t,n}function xr(t){Ft();var n=l!==null&&(l.f&m)!==0&&i!==null&&!i.m;if(n){var r=i;(r.e??(r.e=[])).push({fn:t,effect:l,reaction:o})}else{var e=Mt(t);return e}}function gr(t){return Ft(),ft(t)}function Sr(t){const n=P(Q,t,!0);return()=>{F(n)}}function Mt(t){return P(At,t,!1)}function kr(t,n){var r=i,e={effect:null,ran:!1};r.l.r1.push(e),e.effect=ft(()=>{t(),!e.ran&&(e.ran=!0,ot(r.l.r2,!0),X(n))})}function Ir(){var t=i;ft(()=>{if(vt(t.l.r2)){for(var n of t.l.r1){var r=n.effect;r.f&p&&E(r,q),M(r)&&V(r),n.ran=!1}t.l.r2.v=!1}})}function ft(t){return P(U,t,!0)}function Rr(t){return Tn(t)}function Tn(t,n=0){return P(U|ut|n,t,!0)}function Cr(t,n=!0){return P(U|m,t,!0,n)}function Lt(t){var n=t.teardown;if(n!==null){const r=_t,e=o;mt(!0),z(null);try{n.call(null)}finally{mt(r),z(e)}}}function Ht(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)it(n[r])}}function Yt(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;F(r,n),r=e}}function An(t){for(var n=t.first;n!==null;){var r=n.next;n.f&m||F(n),n=r}}function F(t,n=!0){var r=!1;if((n||t.f&an)&&t.nodes_start!==null){for(var e=t.nodes_start,s=t.nodes_end;e!==null;){var a=e===s?null:C(e);e.remove(),e=a}r=!0}Yt(t,n&&!r),Ht(t),j(t,0),E(t,B);var u=t.transitions;if(u!==null)for(const T of u)T.stop();Lt(t);var f=t.parent;f!==null&&f.first!==null&&jt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.parent=t.fn=t.nodes_start=t.nodes_end=null}function jt(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function Dr(t,n){var r=[];Ut(t,r,!0),xn(r,()=>{F(t),n&&n()})}function xn(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var s of t)s.out(e)}else n()}function Ut(t,n,r){if(!(t.f&N)){if(t.f^=N,t.transitions!==null)for(const u of t.transitions)(u.is_global||r)&&n.push(u);for(var e=t.first;e!==null;){var s=e.next,a=(e.f&xt)!==0||(e.f&m)!==0;Ut(e,n,a?r:!1),e=s}}}function Or(t){Bt(t,!0)}function Bt(t,n){if(t.f&N){M(t)&&V(t),t.f^=N;for(var r=t.first;r!==null;){var e=r.next,s=(r.f&xt)!==0||(r.f&m)!==0;Bt(r,s?n:!1),r=e}if(t.transitions!==null)for(const a of t.transitions)(a.is_global||n)&&a.in()}}const gn=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let $=!1,Z=!1,et=[],st=[];function Vt(){$=!1;const t=et.slice();et=[],Tt(t)}function Gt(){Z=!1;const t=st.slice();st=[],Tt(t)}function br(t){$||($=!0,queueMicrotask(Vt)),et.push(t)}function Nr(t){Z||(Z=!0,gn(Gt)),st.push(t)}function Sn(){$&&Vt(),Z&&Gt()}function kn(t){throw new Error("lifecycle_outside_component")}const Kt=0,In=1;let G=Kt,Y=!1,O=!1,_t=!1;function wt(t){O=t}function mt(t){_t=t}let S=[],b=0;let o=null;function z(t){o=t}let l=null;function J(t){l=t}let y=null;function Rn(t){y=t}let _=null,d=0,x=null;function Cn(t){x=t}let $t=0,k=!1,L=!1,D=new Set,i=null;function Zt(){return++$t}function ct(){return i!==null&&i.l===null}function M(t){var u,f;var n=t.f;if(n&g)return!0;if(n&q){var r=t.deps,e=(n&R)!==0;if(r!==null){var s;if(n&K){for(s=0;s<r.length;s++)((u=r[s]).reactions??(u.reactions=[])).push(t);t.f^=K}for(s=0;s<r.length;s++){var a=r[s];if(M(a)&&Pt(a),e&&l!==null&&!k&&!((f=a==null?void 0:a.reactions)!=null&&f.includes(t))&&(a.reactions??(a.reactions=[])).push(t),a.version>t.version)return!0}}e||E(t,p)}return!1}function Dn(t,n,r){throw t}function zt(t){var pt;var n=_,r=d,e=x,s=o,a=k,u=y,f=i,T=t.f;_=null,d=0,x=null,o=T&(m|Q)?null:t,k=!O&&(T&R)!==0,y=null,i=t.ctx;try{var A=(0,t.fn)(),c=t.deps;if(_!==null){var v;if(j(t,d),c!==null&&d>0)for(c.length=d+_.length,v=0;v<_.length;v++)c[d+v]=_[v];else t.deps=c=_;if(!k)for(v=d;v<c.length;v++)((pt=c[v]).reactions??(pt.reactions=[])).push(t)}else c!==null&&d<c.length&&(j(t,d),c.length=d);return A}finally{_=n,d=r,x=e,o=s,k=a,y=u,i=f}}function On(t,n){let r=n.reactions;if(r!==null){var e=r.indexOf(t);if(e!==-1){var s=r.length-1;s===0?r=n.reactions=null:(r[e]=r[s],r.pop())}}r===null&&n.f&w&&(_===null||!_.includes(n))&&(E(n,q),n.f&(R|K)||(n.f^=K),j(n,0))}function j(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)On(t,r[e])}function V(t){var n=t.f;if(!(n&B)){E(t,p);var r=l;l=t;try{n&ut?An(t):Yt(t),Ht(t),Lt(t);var e=zt(t);t.teardown=typeof e=="function"?e:null,t.version=$t}catch(s){Dn(s)}finally{l=r}}}function Jt(){b>1e3&&(b=0,_n()),b++}function Qt(t){var n=t.length;if(n!==0){Jt();var r=O;O=!0;try{for(var e=0;e<n;e++){var s=t[e];s.f&p||(s.f^=p);var a=[];Wt(s,a),bn(a)}}finally{O=r}}}function bn(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];!(e.f&(B|N))&&M(e)&&(V(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?jt(e):e.fn=null))}}function Nn(){if(Y=!1,b>1001)return;const t=S;S=[],Qt(t),Y||(b=0)}function W(t){G===Kt&&(Y||(Y=!0,queueMicrotask(Nn)));for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(Q|m)){if(!(r&p))return;n.f^=p}}S.push(n)}function Wt(t,n){var r=t.first,e=[];t:for(;r!==null;){var s=r.f,a=(s&m)!==0,u=a&&(s&p)!==0;if(!u&&!(s&N))if(s&U){a?r.f^=p:M(r)&&V(r);var f=r.first;if(f!==null){r=f;continue}}else s&At&&e.push(r);var T=r.next;if(T===null){let v=r.parent;for(;v!==null;){if(t===v)break t;var A=v.next;if(A!==null){r=A;continue t}v=v.parent}}r=T}for(var c=0;c<e.length;c++)f=e[c],n.push(f),Wt(f,n)}function Xt(t){var n=G,r=S;try{Jt();const s=[];G=In,S=s,Y=!1,Qt(r);var e=t==null?void 0:t();return Sn(),(S.length>0||s.length>0)&&Xt(),b=0,e}finally{G=n,S=r}}async function qr(){await Promise.resolve(),Xt()}function vt(t){var f;var n=t.f,r=(n&w)!==0;if(r&&n&B){var e=qt(t);return it(t),e}if(L&&D.add(t),o!==null){y!==null&&y.includes(t)&&cn();var s=o.deps;_===null&&s!==null&&s[d]===t?d++:_===null?_=[t]:_.push(t),x!==null&&l!==null&&l.f&p&&!(l.f&m)&&x.includes(t)&&(E(l,g),W(l))}else if(r&&t.deps===null){var a=t,u=a.parent;u!==null&&!((f=u.deriveds)!=null&&f.includes(a))&&(u.deriveds??(u.deriveds=[])).push(a)}return r&&(a=t,M(a)&&Pt(a)),t.v}function Pr(t){var n=L,r=D;L=!0,D=new Set;var e=D,s;try{X(t)}finally{if(L=n,L)for(s of D)r.add(s);D=r}for(s of e)if(s.f&sn)for(const a of s.deps||[])a.f&w||Et(a,null);else Et(s,null)}function X(t){const n=o;try{return o=null,t()}finally{o=n}}const qn=~(g|q|p);function E(t,n){t.f=t.f&qn|n}function Fr(t){return tt().get(t)}function Mr(t,n){return tt().set(t,n),n}function Lr(t){return tt().has(t)}function Hr(){return tt()}function tt(t){return i===null&&kn(),i.c??(i.c=new Map(Pn(i)||void 0))}function Pn(t){let n=t.p;for(;n!==null;){const r=n.c;if(r!==null)return r;n=n.p}return null}function Yr(t,n=1){var r=+vt(t);return ot(t,r+n),r}function jr(t,n=!1,r){i={p:i,c:null,e:null,m:!1,s:t,x:null,l:null},n||(i.l={s:null,u:null,r1:[],r2:lt(!1)})}function Ur(t){const n=i;if(n!==null){const u=n.e;if(u!==null){var r=l,e=o;n.e=null;try{for(var s=0;s<u.length;s++){var a=u[s];J(a.effect),z(a.reaction),Mt(a.fn)}}finally{J(r),z(e)}}i=n.p,n.m=!0}return{}}function Br(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(ht in t)at(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&ht in r&&at(r)}}}function at(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{at(t[e],n)}catch{}const r=nn(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=tn(r);for(let s in e){const a=e[s].get;if(a)try{a.call(t)}catch{}}}}}function Vr(t,n,r){if(t==null)return n(void 0),r&&r(void 0),rn;const e=X(()=>t.subscribe(n,r));return e.unsubscribe?()=>e.unsubscribe():e}export{wr as $,Vr as A,Tt as B,un as C,ct as D,xt as E,i as F,kn as G,xr as H,nt as I,Wn as J,H as K,Fn as L,Mn as M,En as N,pr as O,fr as P,N as Q,Or as R,ht as S,l as T,Jn as U,dn as V,Qn as W,tr as X,pn as Y,lt as Z,Ut as _,Ur as a,xn as a0,rt as a1,yn as a2,o as a3,Xn as a4,C as a5,gr as a6,Un as a7,Br as a8,kr as a9,Q as aA,J as aB,nr as aC,rr as aD,sr as aE,mr as aF,ar as aG,L as aH,ir as aI,Xt as aJ,Ln as aK,qr as aL,Ar as aM,z as aN,ur as aO,lr as aP,Mr as aQ,Lr as aR,Fr as aS,Tr as aT,Hr as aU,yt as aV,Ir as aa,Pr as ab,an as ac,hn as ad,dr as ae,Ct as af,Dt as ag,Vn as ah,Sr as ai,Nr as aj,nn as ak,Bn as al,tn as am,Yr as an,Hn as ao,Yn as ap,Kn as aq,dt as ar,or as as,$n as at,Gn as au,sn as av,er as aw,kt as ax,jn as ay,m as az,ot as b,hr as c,Zn as d,wn as e,Er as f,vt as g,Et as h,Mt as i,ft as j,Tn as k,Cr as l,zn as m,vr as n,I as o,jr as p,br as q,cr as r,yr as s,Rr as t,X as u,h as v,rn as w,F as x,_r as y,Dr as z};