import { DPR, Point } from '../type';
/** Convert screen (mouse) coordinates to canvas coordinates */
export declare function screenToWorld(point: Point, offset: Point, scale: number, dpr: DPR): Point;
/** Convert canvas coordinates to screen coordinates */
export declare function worldToScreen(point: Point, offset: Point, scale: number, dpr: DPR): Point;
export declare const areSetsEqual: <T>(setA: Set<T>, setB: Set<T>) => boolean;
export declare const getSymmetricDifference: <T>(setA: Set<T>, setB: Set<T>) => Set<T>;
export declare function removeIntersectionAndMerge(setA: Set<unknown>, setB: Set<unknown>): Set<unknown>;
export declare const deduplicateObjectsByKeyValue: <T>(objects: T[]) => T[];
export declare const createWith: <T extends keyof HTMLElementTagNameMap>(tagName: T, style?: Partial<CSSStyleDeclaration>) => HTMLElementTagNameMap[T];
export declare const setStyle: (dom: HTMLElement, styles: Partial<CSSStyleDeclaration>) => void;
export declare const isEqual: (o1: string | number | object, o2: string | number | object) => boolean;
