import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B1fJTrLP.js","_app/immutable/chunks/supabaseClient.BTuNJN2N.js","_app/immutable/chunks/preload-helper.Dwm_PvIR.js","_app/immutable/chunks/utils.CRNn4dtP.js","_app/immutable/chunks/store.B1kL-7Ni.js","_app/immutable/chunks/disclose-version.Bg9kRutz.js","_app/immutable/chunks/if.CRsBAEFG.js","_app/immutable/chunks/Icon.CEA2x5sb.js","_app/immutable/chunks/each.v0RK4Yef.js","_app/immutable/chunks/attributes.BcfEV1VJ.js","_app/immutable/chunks/lifecycle.DSkr6FdQ.js","_app/immutable/chunks/entry.DOGBvY7d.js","_app/immutable/chunks/index.DOYwEOHp.js","_app/immutable/chunks/index-client.BdGz_wQc.js","_app/immutable/chunks/stores.DcEtjLim.js","_app/immutable/chunks/breadcrumb-page.CaLZm5r5.js","_app/immutable/chunks/snippet.DgQetCpD.js","_app/immutable/chunks/this.CcPsTaMA.js","_app/immutable/chunks/svelte-component.CsbbSknF.js","_app/immutable/chunks/render.xPn1qZIb.js","_app/immutable/chunks/x.DaAqSZOK.js","_app/immutable/chunks/chevron-right.UwGiIHNd.js","_app/immutable/chunks/plus.BBSv_QI7.js","_app/immutable/chunks/class.CstC7PuZ.js","_app/immutable/chunks/Login.CIQvAph9.js","_app/immutable/chunks/input.o7SqHMM4.js","_app/immutable/chunks/shared.Cih4jaEk.js","_app/immutable/chunks/event-modifiers.CWmzcjye.js","_app/immutable/chunks/eye.C9SOZpvn.js"];
export const stylesheets = ["_app/immutable/assets/0.B-Nb9PdU.css","_app/immutable/assets/tailwind.C0ikdeTC.css"];
export const fonts = [];
