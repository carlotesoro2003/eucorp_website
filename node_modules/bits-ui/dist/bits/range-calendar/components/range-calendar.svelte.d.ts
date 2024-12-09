import type { RangeCalendarRootProps } from "../types.js";
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
declare const RangeCalendar: $$__sveltets_2_IsomorphicComponent<RangeCalendarRootProps, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "value" | "placeholder" | "ref">;
type RangeCalendar = InstanceType<typeof RangeCalendar>;
export default RangeCalendar;
