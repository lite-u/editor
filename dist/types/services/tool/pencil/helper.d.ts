import { Point } from '~/type';
import { BezierPoint } from '~/elements/props';
export declare function convertDrawPointsToBezierPoints(points: Point[], tension?: number): {
    center: Point;
    points: BezierPoint[];
    closed: boolean;
};
export declare function drawLine(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, lineWidth?: number): void;
