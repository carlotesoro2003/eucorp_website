import{I as ee,k as ae,J as W,o as N,K as O,y as re,L as ne,M as Z,N as fe,O as B,P as b,v as H,Q as S,R as $,l as F,z as le,q as ie,T as J,U as y,V as K,W as V,X as se,Y as ue,Z as P,_ as te,$ as ve,a0 as _e,x as de,a1 as ce,a2 as oe,a3 as he,a4 as Ee,a5 as pe}from"./utils.CRNn4dtP.js";let g=null;function Ce(l){g=l}function Ne(l,e){return e}function Te(l,e,r,u){for(var t=[],_=e.length,s=0;s<_;s++)te(e[s].e,t,!0);var c=_>0&&t.length===0&&r!==null;if(c){var T=r.parentNode;ve(T),T.append(r),u.clear(),C(l,e[0].prev,e[_-1].next)}_e(t,()=>{for(var h=0;h<_;h++){var v=e[h];c||(u.delete(v.k),C(l,v.prev,v.next)),de(v.e,!c)}})}function we(l,e,r,u,t,_=null){var s=l,c={flags:e,items:new Map,first:null},T=(e&W)!==0;if(T){var h=l;s=N?O(ce(h)):h.appendChild(ee())}N&&re();var v=null,w=!1;ae(()=>{var n=r(),d=ne(n)?n:n==null?[]:Z(n),a=d.length;if(w&&a===0)return;w=a===0;let I=!1;if(N){var E=s.data===fe;E!==(a===0)&&(s=B(),O(s),b(!1),I=!0)}if(N){for(var p=null,A,o=0;o<a;o++){if(H.nodeType===8&&H.data===oe){s=H,I=!0,b(!1);break}var f=d[o],i=u(f,o);A=G(H,c,p,null,f,i,o,t,e),c.items.set(i,A),p=A}a>0&&O(B())}if(!N){var k=he;Ae(d,c,s,t,e,(k.f&S)!==0,u)}_!==null&&(a===0?v?$(v):v=F(()=>_(s)):v!==null&&le(v,()=>{v=null})),I&&b(!0),r()}),N&&(s=H)}function Ae(l,e,r,u,t,_,s){var m,q,U,X;var c=(t&Ee)!==0,T=(t&(y|V))!==0,h=l.length,v=e.items,w=e.first,n=w,d,a=null,I,E=[],p=[],A,o,f,i;if(c)for(i=0;i<h;i+=1)A=l[i],o=s(A,i),f=v.get(o),f!==void 0&&((m=f.a)==null||m.measure(),(I??(I=new Set)).add(f));for(i=0;i<h;i+=1){if(A=l[i],o=s(A,i),f=v.get(o),f===void 0){var k=n?n.e.nodes_start:r;a=G(k,e,a,a===null?e.first:a.next,A,o,i,u,t),v.set(o,a),E=[],p=[],n=a.next;continue}if(T&&Ie(f,A,i,t),f.e.f&S&&($(f.e),c&&((q=f.a)==null||q.unfix(),(I??(I=new Set)).delete(f))),f!==n){if(d!==void 0&&d.has(f)){if(E.length<p.length){var M=p[0],x;a=M.prev;var Y=E[0],D=E[E.length-1];for(x=0;x<E.length;x+=1)Q(E[x],M,r);for(x=0;x<p.length;x+=1)d.delete(p[x]);C(e,Y.prev,D.next),C(e,a,Y),C(e,D,M),n=M,a=D,i-=1,E=[],p=[]}else d.delete(f),Q(f,n,r),C(e,f.prev,f.next),C(e,f,a===null?e.first:a.next),C(e,a,f),a=f;continue}for(E=[],p=[];n!==null&&n.k!==o;)(_||!(n.e.f&S))&&(d??(d=new Set)).add(n),p.push(n),n=n.next;if(n===null)continue;f=n}E.push(f),a=f,n=f.next}if(n!==null||d!==void 0){for(var R=d===void 0?[]:Z(d);n!==null;)(_||!(n.e.f&S))&&R.push(n),n=n.next;var L=R.length;if(L>0){var j=t&W&&h===0?r:null;if(c){for(i=0;i<L;i+=1)(U=R[i].a)==null||U.measure();for(i=0;i<L;i+=1)(X=R[i].a)==null||X.fix()}Te(e,R,j,v)}}c&&ie(()=>{var z;if(I!==void 0)for(f of I)(z=f.a)==null||z.apply()}),J.first=e.first&&e.first.e,J.last=a&&a.e}function Ie(l,e,r,u){u&y&&K(l.v,e),u&V?K(l.i,r):l.i=r}function G(l,e,r,u,t,_,s,c,T){var h=g;try{var v=(T&y)!==0,w=(T&se)===0,n=v?w?ue(t):P(t):t,d=T&V?P(s):s,a={i:d,v:n,k:_,a:null,e:null,prev:r,next:u};return g=a,a.e=F(()=>c(l,n,d),N),a.e.prev=r&&r.e,a.e.next=u&&u.e,r===null?e.first=a:(r.next=a,r.e.next=a.e),u!==null&&(u.prev=a,u.e.prev=a.e),a}finally{g=h}}function Q(l,e,r){for(var u=l.next?l.next.e.nodes_start:r,t=e?e.e.nodes_start:r,_=l.e.nodes_start;_!==u;){var s=pe(_);t.before(_),_=s}}function C(l,e,r){e===null?l.first=r:(e.next=r,e.e.next=r&&r.e),r!==null&&(r.prev=e,r.e.prev=e&&e.e)}export{g as c,we as e,Ne as i,Ce as s};
