export function addEventListener(target, event, handler, options) {
    const events = Array.isArray(event) ? event : [event];
    for (const event of events) {
        target.addEventListener(event, handler, options);
    }
    return () => {
        for (const event of events) {
            target.removeEventListener(event, handler, options);
        }
    };
}
