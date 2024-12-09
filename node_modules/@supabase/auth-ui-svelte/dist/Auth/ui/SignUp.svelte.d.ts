import { SvelteComponentTyped } from "svelte";
import type { Provider, SupabaseClient } from '@supabase/supabase-js';
import type { I18nVariables, ProviderScopes } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        supabaseClient: SupabaseClient;
        socialLayout?: "horizontal" | "vertical" | undefined;
        providers?: Provider[] | undefined;
        providerScopes?: Partial<ProviderScopes> | undefined;
        queryParams?: {
            [key: string]: string;
        } | undefined;
        redirectTo?: string | undefined;
        magicLink?: boolean | undefined;
        showLinks?: boolean | undefined;
        appearance?: Appearance | undefined;
        theme?: string | undefined;
        localization?: {
            variables?: I18nVariables | undefined;
        } | undefined;
        additionalData?: {
            [key: string]: any;
        } | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type SignUpProps = typeof __propDef.props;
export type SignUpEvents = typeof __propDef.events;
export type SignUpSlots = typeof __propDef.slots;
export default class SignUp extends SvelteComponentTyped<SignUpProps, SignUpEvents, SignUpSlots> {
}
export {};
