/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener(s) from the target element.
 */
export declare function addEventListener<TEvent extends keyof WindowEventMap>(target: Window, event: TEvent | TEvent[], handler: (this: Window, event: WindowEventMap[TEvent]) => unknown, options?: boolean | AddEventListenerOptions): VoidFunction;
/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener(s) from the target element.
 */
export declare function addEventListener<TEvent extends keyof DocumentEventMap>(target: Document, event: TEvent | TEvent[], handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown, options?: boolean | AddEventListenerOptions): VoidFunction;
/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener(s) from the target element.
 */
export declare function addEventListener<TElement extends HTMLElement, TEvent extends keyof HTMLElementEventMap>(target: TElement, event: TEvent | TEvent[], handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown, options?: boolean | AddEventListenerOptions): VoidFunction;
/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener(s) from the target element.
 */
export declare function addEventListener<TEvent extends keyof MediaQueryListEventMap>(target: MediaQueryList, event: TEvent | TEvent[], handler: (this: MediaQueryList, event: MediaQueryListEventMap[TEvent]) => unknown, options?: boolean | AddEventListenerOptions): VoidFunction;
/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener(s) from the target element.
 */
export declare function addEventListener(target: EventTarget, event: string | string[], handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): VoidFunction;
