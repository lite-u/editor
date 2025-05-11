import Shape, { ShapeProps } from '../shape/shape';
import { CenterBasedRect, Point, Rect } from '~/type';
import { SnapPointData } from '~/engine/type';
import { TransformProps } from '~/elements/rectangle/transform';
import ElementRectangle from '~/elements/rectangle/rectangle';
export interface RectangleLikeProps extends ShapeProps {
    id: string;
    layer: number;
    width?: number;
    height?: number;
    radius?: number;
}
export type RequiredRectangleLikeProps = Required<RectangleLikeProps>;
declare class RectangleLike extends Shape {
    id: string;
    layer: number;
    width: number;
    height: number;
    radius: number;
    constructor({ id, layer, width, height, radius, ...rest }: RectangleLikeProps);
    static applyResizeTransform: (arg: TransformProps) => Rect;
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    toJSON(): RequiredRectangleLikeProps;
    toMinimalJSON(): RectangleLikeProps;
    getRect(): CenterBasedRect;
    getBoundingRect(): import("~/type").BoundingRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): ElementRectangle;
    getHighlightModule(lineWidth: number, lineColor: string): ElementRectangle;
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
    }): import("../../services/selection/type").OperationHandlers[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default RectangleLike;
