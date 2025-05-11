import Shape, { ShapeCreationProps } from '../shape/shape';
import { CenterBasedRect, Point, Rect } from '~/type';
import { ModuleInstance } from '../elements';
import { SnapPointData } from '~/engine/type';
import { TransformProps } from '~/elements/rectangle/transform';
export interface RectangleProps extends ShapeCreationProps {
    id: string;
    layer: number;
    width?: number;
    height?: number;
    radius?: number;
}
export type RequiredRectangleProps = Required<RectangleProps>;
export type TypedRectangleProps = RectangleProps & {
    type?: 'rectangle';
};
declare class Rectangle extends Shape {
    id: string;
    layer: number;
    width: number;
    height: number;
    radius: number;
    constructor({ id, layer, width, height, radius, ...rest }: RectangleProps);
    get type(): 'rectangle';
    static applyResizeTransform: (arg: TransformProps) => Rect;
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    toJSON(): RequiredRectangleProps;
    toMinimalJSON(): RectangleProps;
    getRect(): CenterBasedRect;
    getBoundingRect(): import("~/type").BoundingRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle;
    getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance;
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
    }): import("../../engine/selection/type").OperationHandlers[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default Rectangle;
