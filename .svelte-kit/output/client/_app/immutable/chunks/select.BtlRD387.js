import{w as f}from"./utils.Cx6K9qTo.js";import{l}from"./shared.BiWXoLt3.js";import{i as o}from"./preload-helper.Tg4Km7Zr.js";function v(e,t,u){if(e.multiple)return d(e,t);for(var n of e.options){var r=a(n);if(o(r,t)){n.selected=!0;return}}(!u||t!==void 0)&&(e.selectedIndex=-1)}function _(e,t){f(()=>{var u=new MutationObserver(()=>{var n=e.__value;v(e,n)});return u.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{u.disconnect()}})}function b(e,t,u=t){var n=!0;l(e,"change",()=>{var r;if(e.multiple)r=[].map.call(e.querySelectorAll(":checked"),a);else{var i=e.querySelector(":checked");r=i&&a(i)}u(r)}),f(()=>{var r=t();if(v(e,r,n),n&&r===void 0){var i=e.querySelector(":checked");i!==null&&(r=a(i),u(r))}e.__value=r,n=!1}),_(e)}function d(e,t){for(var u of e.options)u.selected=~t.indexOf(a(u))}function a(e){return"__value"in e?e.__value:e.value}export{b};
