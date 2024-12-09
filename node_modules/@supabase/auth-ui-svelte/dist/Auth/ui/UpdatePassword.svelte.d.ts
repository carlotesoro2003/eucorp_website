import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient } from '@supabase/supabase-js';
import type { I18nVariables } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        supabaseClient: SupabaseClient;
        redirectTo?: string | undefined;
        showLinks?: boolean | undefined;
        appearance?: Appearance | undefined;
        theme?: string | undefined;
        localization?: {
            variables?: I18nVariables | undefined;
        } | undefined;
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
