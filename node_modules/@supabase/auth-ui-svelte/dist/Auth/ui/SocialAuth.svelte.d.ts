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
export type SocialAuthProps = typeof __propDef.props;
export type SocialAuthEvents = typeof __propDef.events;
export type SocialAuthSlots = typeof __propDef.slots;
export default class SocialAuth extends SvelteComponentTyped<SocialAuthProps, SocialAuthEvents, SocialAuthSlots> {
}
export {};
