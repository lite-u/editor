import Shape, { ShapeProps } from './shape';
import { SnapPointData } from '../../../main/type';
import { ResizeHandleName } from '../../../main/selection/type';
import { ModuleInstance } from '../type';
import { CenterBasedRect, Point, Rect } from '../../../type';
export interface RectangleProps extends ShapeProps {
    width: number;
    height: number;
    radius?: number;
    type: 'rectangle';
}
declare class Rectangle extends Shape {
    readonly type = "rectangle";
    width: number;
    height: number;
    radius: number;
    constructor({ width, height, radius, ...rest }: Omit<RectangleProps, 'type'>);
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    static applyResizeTransform: ({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: {
        downPoint: {
            x: number;
            y: number;
        };
        movePoint: {
            x: number;
            y: number;
        };
        moduleOrigin: RectangleProps;
        rotation: number;
        handleName: ResizeHandleName;
        scale: number;
        dpr: number;
        altKey?: boolean;
        shiftKey?: boolean;
    }) => Rect;
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>;
    getRect(): CenterBasedRect;
    getBoundingRect(): import("../../../type").BoundingRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle;
    getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance;
    getOperators(resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }): import("../../../main/selection/type").OperationHandlers[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default Rectangle;
