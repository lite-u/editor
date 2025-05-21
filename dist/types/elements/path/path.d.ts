import { BoundingRect, Point } from '~/type';
import { BezierPoint } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
import ElementShape, { ShapeProps } from '~/elements/shape/shape';
export interface PathProps extends ShapeProps {
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
}
export type RequiredShapeProps = Required<PathProps>;
declare class ElementPath extends ElementShape {
    readonly type = "path";
    private points;
    closed: boolean;
    constructor({ points, closed, ...rest }: PathProps);
    static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point;
    protected updateOriginal(): void;
    get center(): Point;
    get getPoints(): Point[];
    protected updatePath2D(): void;
    rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    static _getBoundingRect(points: BezierPoint[]): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): PathProps;
}
export default ElementPath;
