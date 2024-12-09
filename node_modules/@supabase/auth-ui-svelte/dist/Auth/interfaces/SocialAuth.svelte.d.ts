import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient, Provider } from '@supabase/supabase-js';
import { type I18nVariables, type SocialLayout, type ProviderScopes } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        supabaseClient: SupabaseClient;
        socialLayout: SocialLayout;
        redirectTo?: string | undefined;
        onlyThirdPartyProviders: boolean;
        i18n: I18nVariables;
        providers?: Provider[] | undefined;
        providerScopes: Partial<ProviderScopes> | undefined;
        queryParams: {
            [key: string]: string;
        } | undefined;
        appearance: Appearance;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SocialAuthProps = typeof __propDef.props;
export type SocialAuthEvents = typeof __propDef.events;
export type SocialAuthSlots = typeof __propDef.slots;
export default class SocialAuth extends SvelteComponentTyped<SocialAuthProps, SocialAuthEvents, SocialAuthSlots> {
}
export {};
