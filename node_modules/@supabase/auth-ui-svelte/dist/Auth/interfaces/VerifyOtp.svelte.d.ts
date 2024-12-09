import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient } from '@supabase/supabase-js';
import { type I18nVariables, type ViewType, type OtpType } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        i18n: I18nVariables;
        supabaseClient: SupabaseClient;
        authView: ViewType;
        otpType?: OtpType | undefined;
        appearance: Appearance;
        showLinks?: boolean | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        token?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type VerifyOtpProps = typeof __propDef.props;
export type VerifyOtpEvents = typeof __propDef.events;
export type VerifyOtpSlots = typeof __propDef.slots;
export default class VerifyOtp extends SvelteComponentTyped<VerifyOtpProps, VerifyOtpEvents, VerifyOtpSlots> {
}
export {};
