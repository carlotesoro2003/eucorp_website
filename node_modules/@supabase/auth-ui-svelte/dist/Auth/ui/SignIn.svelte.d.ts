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
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SignInProps = typeof __propDef.props;
export type SignInEvents = typeof __propDef.events;
export type SignInSlots = typeof __propDef.slots;
export default class SignIn extends SvelteComponentTyped<SignInProps, SignInEvents, SignInSlots> {
}
export {};
