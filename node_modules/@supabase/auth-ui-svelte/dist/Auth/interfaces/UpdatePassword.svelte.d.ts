import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient } from '@supabase/supabase-js';
import { type I18nVariables, type ViewType } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        i18n: I18nVariables;
        supabaseClient: SupabaseClient;
        authView: ViewType;
        appearance: Appearance;
        showLinks?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type UpdatePasswordProps = typeof __propDef.props;
export type UpdatePasswordEvents = typeof __propDef.events;
export type UpdatePasswordSlots = typeof __propDef.slots;
export default class UpdatePassword extends SvelteComponentTyped<UpdatePasswordProps, UpdatePasswordEvents, UpdatePasswordSlots> {
}
export {};
