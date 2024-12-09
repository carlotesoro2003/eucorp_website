export type DataTypeahead = ReturnType<typeof useDataTypeahead>;
type UseDataTypeaheadOpts = {
    onMatch: (value: string) => void;
    getCurrentItem: () => string;
    enabled: boolean;
};
export declare function useDataTypeahead(opts: UseDataTypeaheadOpts): {
    search: import("svelte-toolbelt").WritableBox<string>;
    handleTypeaheadSearch: (key: string, candidateValues: string[]) => string | undefined;
    resetTypeahead: () => void;
};
export {};
