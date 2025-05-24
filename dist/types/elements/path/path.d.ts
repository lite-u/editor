import { BoundingRect, Point } from '~/type';
import { BezierPoint } from '~/elements/props';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { HistoryChangeItem } from '~/services/actions/type';
export interface PathProps extends ElementBaseProps {
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
}
export type RequiredShapeProps = Required<PathProps>;
declare class ElementPath extends ElementBase {
    readonly type = "path";
    private points;
    closed: boolean;
    constructor({ points, closed, ...rest }: PathProps);
    static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point;
    updateOriginal(): void;
    /**
     * Return absolute position points
     */
    getBezierPoints(): BezierPoint[];
    protected updatePath2D(): void;
    translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    static _getBoundingRect(points: BezierPoint[]): BoundingRect;
    static _rotatePoints(cx: number, cy: number, rotation: number, points: BezierPoint[]): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): PathProps;
}
export default ElementPath;
