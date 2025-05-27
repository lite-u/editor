import { Point } from '~/type';
import { BezierPoint } from '~/elements/props';
export declare function convertPointsToBezierPoints(points: Point[], tension?: number): {
    center: Point;
    points: BezierPoint[];
    closed: boolean;
};
export declare function drawLine(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, offset: {
    x: number;
    y: number;
}, lineWidth?: number): void;
