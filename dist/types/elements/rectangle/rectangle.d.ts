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
    toMinimalJSON(): TypedRectangleProps;
    getRect(): CenterBasedRect;
    getBoundingRect(): import("~/type").BoundingRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle;
    getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance;
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default Rectangle;
