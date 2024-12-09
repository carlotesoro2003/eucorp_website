export interface Point {
    x: number;
    y: number;
}
export type Polygon = Array<Point>;
export declare function makeHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P>;
export declare function POINT_COMPARATOR(a: Point, b: Point): number;
export declare function makeHullFromElements(els: Array<HTMLElement>): Array<Point>;
export declare function pointInPolygon(point: Point, polygon: Polygon): boolean;
export declare function isPointerInGraceArea(e: Pick<PointerEvent, "clientX" | "clientY">, area?: Polygon): boolean;
