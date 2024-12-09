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
declare const Menu: $$__sveltets_2_IsomorphicComponent<{
    open?: boolean;
    onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean>;
    dir?: import("../../../index.js").Direction;
    controlledOpen?: boolean;
} & {
    children?: import("svelte").Snippet | undefined;
} & {
    _internal_variant?: "context-menu" | "dropdown-menu" | "menubar";
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "open">;
type Menu = InstanceType<typeof Menu>;
export default Menu;
