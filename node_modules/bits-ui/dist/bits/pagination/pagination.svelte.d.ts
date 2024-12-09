import type { Page, PageItem } from "./types.js";
import type { WithRefProps } from "../../internal/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import { type Orientation } from "../../shared/index.js";
type PaginationRootStateProps = WithRefProps<ReadableBoxedValues<{
    count: number;
    perPage: number;
    siblingCount: number;
    orientation: Orientation;
    loop: boolean;
}> & WritableBoxedValues<{
    page: number;
}>>;
declare class PaginationRootState {
    id: PaginationRootStateProps["id"];
    ref: PaginationRootStateProps["ref"];
    orientation: PaginationRootStateProps["orientation"];
    count: PaginationRootStateProps["count"];
    perPage: PaginationRootStateProps["perPage"];
    siblingCount: PaginationRootStateProps["siblingCount"];
    page: PaginationRootStateProps["page"];
    loop: PaginationRootStateProps["loop"];
    totalPages: number;
    range: {
        start: number;
        end: number;
    };
    pages: PageItem[];
    constructor(props: PaginationRootStateProps);
    setPage: (page: number) => void;
    getPageTriggerNodes: () => HTMLElement[];
    getButtonNode: (type: "prev" | "next") => HTMLElement | null | undefined;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: () => void;
    nextPage: () => void;
    snippetProps: {
        pages: PageItem[];
        range: {
            start: number;
            end: number;
        };
        currentPage: number;
    };
    props: {
        readonly id: string;
        readonly "data-orientation": "horizontal" | "vertical";
        readonly "data-pagination-root": "";
    };
}
type PaginationPageStateProps = WithRefProps<ReadableBoxedValues<{
    page: Page;
    disabled: boolean;
}>>;
declare class PaginationPageState {
    #private;
    page: PaginationPageStateProps["page"];
    constructor(props: PaginationPageStateProps, root: PaginationRootState);
    props: {
        readonly id: string;
        readonly "aria-label": `Page ${number}`;
        readonly "data-value": `${number}`;
        readonly "data-selected": "" | undefined;
        readonly "data-pagination-page": "";
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
type PaginationButtonStateProps = WithRefProps<{
    type: "prev" | "next";
}> & ReadableBoxedValues<{
    disabled: boolean;
}>;
declare class PaginationButtonState {
    #private;
    id: PaginationButtonStateProps["id"];
    type: PaginationButtonStateProps["type"];
    constructor(props: PaginationButtonStateProps, root: PaginationRootState);
    props: {
        readonly id: string;
        readonly "data-pagination-prev": "" | undefined;
        readonly "data-pagination-next": "" | undefined;
        readonly disabled: boolean;
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
export declare function usePaginationRoot(props: PaginationRootStateProps): PaginationRootState;
export declare function usePaginationPage(props: PaginationPageStateProps): PaginationPageState;
export declare function usePaginationButton(props: PaginationButtonStateProps): PaginationButtonState;
export {};
