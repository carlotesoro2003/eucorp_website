import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient } from '@supabase/supabase-js';
import { type I18nVariables, type ViewType } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        i18n: I18nVariables;
        supabaseClient: SupabaseClient;
        authView: ViewType;
        redirectTo?: string | undefined;
        appearance: Appearance;
        showLinks?: boolean | undefined;
        email?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type MagicLinkProps = typeof __propDef.props;
export type MagicLinkEvents = typeof __propDef.events;
export type MagicLinkSlots = typeof __propDef.slots;
export default class MagicLink extends SvelteComponentTyped<MagicLinkProps, MagicLinkEvents, MagicLinkSlots> {
}
export {};
