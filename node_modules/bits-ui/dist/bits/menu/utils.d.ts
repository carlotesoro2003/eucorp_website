import type { Direction } from "../../shared/index.js";
export type CheckedState = boolean | "indeterminate";
export declare const ITEM_NAME = "MenuItem";
export declare const SELECTION_KEYS: string[];
export declare const FIRST_KEYS: string[];
export declare const LAST_KEYS: string[];
export declare const FIRST_LAST_KEYS: string[];
export declare const SUB_OPEN_KEYS: Record<Direction, string[]>;
export declare const SUB_CLOSE_KEYS: Record<Direction, string[]>;
export declare function isIndeterminate(checked?: CheckedState): checked is "indeterminate";
export declare function getCheckedState(checked: CheckedState): "checked" | "unchecked" | "indeterminate";
export interface Point {
    x: number;
    y: number;
}
export type Polygon = Point[];
export type Side = "left" | "right";
export interface GraceIntent {
    area: Polygon;
    side: Side;
}
export declare function isMouseEvent(event: PointerEvent): boolean;
