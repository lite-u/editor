import { Point } from '~/type';
export declare function rotatePointAroundPoint(px: number, py: number, cx: number, cy: number, rotation: number): {
    x: number;
    y: number;
};
export declare function transformPoints(points: Point[], matrix: DOMMatrix): Point[];
export declare function getCornerByRect(rect: any): void;
