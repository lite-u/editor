import ElementBase, { ElementBaseProps } from '../base/elementBase';
import { OperationHandler } from '~/services/selection/type';
import { BoundingRect, Point, UID } from '~/type';
import { ElementProps } from '../type';
import { BasePath } from '~/elements/basePath/basePath';
import { BezierPoint } from '~/elements/props';
export interface PathProps extends ElementBaseProps {
    id: UID;
    layer: number;
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
    group: string | null;
}
export type RequiredShapeProps = Required<PathProps>;
declare class ElementPath extends ElementBase implements BasePath {
    readonly id: UID;
    readonly layer: number;
    readonly type = "path";
    private points;
    closed: boolean;
    constructor({ id, layer, points, closed, ...rest }: PathProps);
    static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point;
    getBoundingRect(): BoundingRect;
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
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
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementPath;
