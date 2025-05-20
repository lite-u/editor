import ToolManager from '~/services/tool/toolManager';
import { Point } from '~/type';
export declare function applyRotating(this: ToolManager, shiftKey: boolean): number;
export declare function isPointNearStroke(ctx: CanvasRenderingContext2D, path: Path2D, point: Point, tolerance?: number, step?: number): Point | null;
export declare function isPointNearStroke2(ctx: CanvasRenderingContext2D, path: Path2D, point: Point, tolerance: number | undefined, baseLineWidth: number): boolean;
