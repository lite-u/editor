import { RenderPropsList } from './renderer/type';
export declare const generateBoundingRectFromRotatedRect: ({ x, y, width, height }: Rect, rotation: number) => BoundingRect;
export declare const generateBoundingRectFromRect: (rect: Rect) => BoundingRect;
export declare const generateBoundingRectFromTwoPoints: (p1: Point, p2: Point) => BoundingRect;
export declare function rectsOverlap(r1: BoundingRect, r2: BoundingRect): boolean;
export declare const isInsideRotatedRect: ({ x: mouseX, y: mouseY }: Point, rect: Rect, rotation: number) => boolean;
export declare const isNegativeZero: (x: number) => boolean;
export declare function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void;
export declare const setFloatOnProps: <T extends RenderPropsList, K extends keyof RenderPropsList>(obj: T, keys: K[]) => void;
