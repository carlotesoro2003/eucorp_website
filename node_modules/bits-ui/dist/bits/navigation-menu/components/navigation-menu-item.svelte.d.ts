import type { NavigationMenuItemProps } from "../types.js";
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
declare const NavigationMenuItem: $$__sveltets_2_IsomorphicComponent<NavigationMenuItemProps, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "ref">;
type NavigationMenuItem = InstanceType<typeof NavigationMenuItem>;
export default NavigationMenuItem;
