import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: never;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type TestIsFocusWithinProps = typeof __propDef.props;
export type TestIsFocusWithinEvents = typeof __propDef.events;
export type TestIsFocusWithinSlots = typeof __propDef.slots;
export default class TestIsFocusWithin extends SvelteComponent<TestIsFocusWithinProps, TestIsFocusWithinEvents, TestIsFocusWithinSlots> {
}
export {};
