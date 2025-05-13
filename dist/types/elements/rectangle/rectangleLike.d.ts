import Shape, { ShapeProps } from '../shape/shape';
import { CenterBasedRect, Point, Rect } from '~/type';
import { SnapPointData } from '~/main/type';
import { TransformProps } from '~/elements/rectangle/transform';
import ElementRectangle from '~/elements/rectangle/rectangle';
import { BorderRadius } from '~/elements/props';
export interface RectangleLikeProps extends ShapeProps {
    id: string;
    layer: number;
    width?: number;
    height?: number;
    borderRadius?: BorderRadius;
}
export type RequiredRectangleLikeProps = Required<RectangleLikeProps>;
declare class RectangleLike extends Shape {
    id: string;
    layer: number;
    width: number;
    height: number;
    borderRadius: BorderRadius;
    private original;
    constructor({ id, layer, width, height, borderRadius, ...rest }: RectangleLikeProps);
    protected get center(): Point;
    protected get corners(): Point[];
    applyMatrix(matrix: DOMMatrix): void;
    translate(dx: number, dy: number): void;
    rotate(angle: number, center?: Point): void;
    scale(sx: number, sy: number, pivot?: Point): void;
    getTransformedPoints(): Point[];
    static applyResizeTransform: (arg: TransformProps) => Rect;
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    toJSON(): RequiredRectangleLikeProps;
    toMinimalJSON(): RectangleLikeProps;
    getRect(): CenterBasedRect;
    getBoundingRect(): import("~/type").BoundingRect;
    getSelectedBoxElement(lineWidth: number, lineColor: string): ElementRectangle;
    getHighlightElement(lineWidth: number, lineColor: string): ElementRectangle;
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
    }): import("../../services/selection/type").OperationHandler[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default RectangleLike;
