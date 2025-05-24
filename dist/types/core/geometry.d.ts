import { Point } from '~/type';
export declare function rotatePointAroundPoint(px: number, py: number, cx: number, cy: number, rotation: number): {
    x: number;
    y: number;
};
export declare function transformPoints(points: Point[], matrix: DOMMatrix): Point[];
export declare function isPointNear(p1: Point, p2: Point, tolerance?: number): boolean;
export declare function nearestPointOnCurve(anchor: Point, cp1: Point | null, cp2: Point | null, nextAnchor: Point, target: Point, steps?: number): Point;
