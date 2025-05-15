import { ResizeDirectionName, ResizeTransform } from '../services/selection/type';
import { BoundingRect, DPR, Point } from '../type';
interface DrawCrossLineProps {
    ctx: CanvasRenderingContext2D;
    mousePoint: Point;
    scale: number;
    dpr: DPR;
    offset: Point;
    virtualRect: BoundingRect;
}
/** Convert screen (mouse) coordinates to canvas coordinates */
export declare function screenToWorld(point: Point, offset: Point, scale: number, dpr: DPR): {
    x: number;
    y: number;
};
/** Convert canvas coordinates to screen coordinates */
export declare function worldToScreen(point: Point, offset: Point, scale: number, dpr: DPR): {
    x: number;
    y: number;
};
export declare const drawCrossLine: ({ ctx, mousePoint, scale, dpr, offset, virtualRect: { left: minX, top: minY, right: maxX, bottom: maxY }, }: DrawCrossLineProps) => void;
export declare const areSetsEqual: <T>(setA: Set<T>, setB: Set<T>) => boolean;
export declare const getSymmetricDifference: <T>(setA: Set<T>, setB: Set<T>) => Set<T>;
export declare function getResizeTransform(name: ResizeDirectionName, symmetric?: boolean): ResizeTransform;
export declare const deduplicateObjectsByKeyValue: <T>(objects: T[]) => T[];
export declare const createWith: <T extends keyof HTMLElementTagNameMap>(tagName: T, role: string, id: string, style?: Partial<CSSStyleDeclaration>) => HTMLElementTagNameMap[T];
export declare const setStyle: (dom: HTMLElement, styles: Partial<CSSStyleDeclaration>) => void;
export declare const isEqual: (o1: string | number | object, o2: string | number | object) => boolean;
export {};
