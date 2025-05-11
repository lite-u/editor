import { ResizeHandleName, ResizeTransform } from '../engine/selection/type';
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
export declare function rotatePoint(px: number, py: number, cx: number, cy: number, rotation: number): {
    x: number;
    y: number;
};
export declare function getResizeTransform(name: ResizeHandleName, symmetric?: boolean): ResizeTransform;
export {};
