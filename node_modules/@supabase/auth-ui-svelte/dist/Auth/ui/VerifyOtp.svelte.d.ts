import { SvelteComponentTyped } from "svelte";
import type { SupabaseClient } from '@supabase/supabase-js';
import type { I18nVariables, OtpType } from '@supabase/auth-ui-shared';
import type { Appearance } from '../../types';
declare const __propDef: {
    props: {
        supabaseClient: SupabaseClient;
        otpType?: OtpType | undefined;
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
export type VerifyOtpProps = typeof __propDef.props;
export type VerifyOtpEvents = typeof __propDef.events;
export type VerifyOtpSlots = typeof __propDef.slots;
export default class VerifyOtp extends SvelteComponentTyped<VerifyOtpProps, VerifyOtpEvents, VerifyOtpSlots> {
}
export {};
