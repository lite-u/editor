import ElementBase, { ElementBaseProps } from '../base/elementBase';
import { OperationHandler } from '~/services/selection/type';
import { BoundingRect, Point, UID } from '~/type';
import { ElementProps } from '../type';
import { BezierPoint } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
export interface PathProps extends ElementBaseProps {
    id: UID;
    layer: number;
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
}
export type RequiredShapeProps = Required<PathProps>;
declare class ElementPath extends ElementBase {
    readonly id: UID;
    readonly layer: number;
    readonly type = "path";
    private points;
    closed: boolean;
    constructor({ id, layer, points, closed, ...rest }: PathProps);
    static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point;
    get center(): Point;
    get getPoints(): Point[];
    protected updatePath2D(): void;
    translate(dx: number, dy: number): HistoryChangeItem;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    getBoundingRect(): BoundingRect;
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): PathProps;
    getOperators(id: string, resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, boundingRect: BoundingRect, elementOrigin: ElementProps): OperationHandler[];
    isInsideRect(outer: BoundingRect): boolean;
}
export default ElementPath;
