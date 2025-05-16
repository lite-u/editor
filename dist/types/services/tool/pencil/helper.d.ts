import { Point } from '~/type';
import { BezierPoint } from '~/elements/props';
export declare function convertPointsToBezierPoints(points: Point[], tension?: number): BezierPoint[];
export declare function drawLine(ctx: CanvasRenderingContext2D, p1: Point, p2: Point): void;
