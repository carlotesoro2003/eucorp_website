import { SvelteComponentTyped } from "svelte";
import type { Provider } from '@supabase/supabase-js';
declare const __propDef: {
    props: {
        provider: Provider;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IconsProps = typeof __propDef.props;
export type IconsEvents = typeof __propDef.events;
export type IconsSlots = typeof __propDef.slots;
export default class Icons extends SvelteComponentTyped<IconsProps, IconsEvents, IconsSlots> {
}
export {};
