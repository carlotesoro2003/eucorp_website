/// <reference types="svelte" />
import { type Readable, type Writable } from "svelte/store";
type ReadableValue<T> = T extends Readable<infer U> ? U : never;
export declare class Store<T extends Readable<unknown>> {
    #private;
    constructor(store: T);
    get current(): ReadableValue<T>;
    /**
     * In case the expected type to set is never, this means that the store is not `writable`.
     */
    set current(v: T extends Writable<unknown> ? ReadableValue<T> : never);
}
export {};
