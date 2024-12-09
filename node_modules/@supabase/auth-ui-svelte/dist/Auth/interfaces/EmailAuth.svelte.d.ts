import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient } from '@supabase/supabase-js';
import { type I18nVariables, type ViewType, type RedirectTo } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        authView?: ViewType | undefined;
        email?: string | undefined;
        password?: string | undefined;
        supabaseClient: SupabaseClient;
        redirectTo?: RedirectTo;
        additionalData?: {
            [key: string]: any;
        } | undefined;
        showLinks?: boolean | undefined;
        magicLink?: boolean | undefined;
        i18n: I18nVariables;
        appearance: Appearance;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type EmailAuthProps = typeof __propDef.props;
export type EmailAuthEvents = typeof __propDef.events;
export type EmailAuthSlots = typeof __propDef.slots;
export default class EmailAuth extends SvelteComponentTyped<EmailAuthProps, EmailAuthEvents, EmailAuthSlots> {
}
export {};
