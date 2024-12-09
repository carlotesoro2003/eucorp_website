export type StartNotifier<T> = (set: (value: T) => void, insideEffect: boolean) => void | VoidFunction;
/**
 * A class that contains a reactive `current` property
 *
 * Accepts an initial value, and an optional `start` function, which has a `set` function as its first argument,
 * which is used to update the value of the `current` property.
 *
 * @example
 * ```html
 * <script>
 * const now = new Readable(new Date(), (set) => {
 * 	const interval = setInterval(() => set(new Date()), 1000);
 * 	return () => clearInterval(interval);
 * });
 * </script>
 *
 * <p>{now.current.toLocaleTimeString()}</p>
 * ```
 *
 * @see {@link https://runed.dev/docs/utilities/readable}
 *
 */
export declare class Readable<T> {
    #private;
    constructor(initialValue: T, start: StartNotifier<T>);
    get current(): T;
}
