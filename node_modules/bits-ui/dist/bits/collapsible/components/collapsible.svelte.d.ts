import type { CollapsibleRootProps } from "../types.js";
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const Collapsible: $$__sveltets_2_IsomorphicComponent<CollapsibleRootProps, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "ref" | "open">;
type Collapsible = InstanceType<typeof Collapsible>;
export default Collapsible;
