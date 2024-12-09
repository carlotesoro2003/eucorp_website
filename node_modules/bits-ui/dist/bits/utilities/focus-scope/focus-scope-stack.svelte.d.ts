export type FocusScopeAPI = {
    id: string;
    paused: boolean;
    pause: () => void;
    resume: () => void;
};
export declare function createFocusScopeStack(): {
    add(focusScope: FocusScopeAPI): void;
    remove(focusScope: FocusScopeAPI): void;
};
export declare function createFocusScopeAPI(): FocusScopeAPI;
export declare function removeLinks(items: HTMLElement[]): HTMLElement[];
