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
declare const PopperContent: $$__sveltets_2_IsomorphicComponent<{
    id: string;
    wrapperId?: string;
    style?: import("../../..").StyleProperties | string | null;
    onPlaced?: () => void;
} & import("../floating-layer/types.js").FloatingLayerContentProps & {
    isStatic: boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "">;
type PopperContent = InstanceType<typeof PopperContent>;
export default PopperContent;
