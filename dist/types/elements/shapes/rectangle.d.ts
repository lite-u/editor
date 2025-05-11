import Shape, { ShapeProps } from '../shape/shape';
import { ResizeHandleName } from '../../engine/selection/type';
import { CenterBasedRect, Point, Rect } from '../../type';
import { ModuleInstance } from '../elements';
import { SnapPointData } from '../../engine/type';
export interface RectangleProps extends ShapeProps {
    width: number;
    height: number;
    radius?: number;
}
declare class Rectangle extends Shape {
    width: number;
    height: number;
    radius: number;
    constructor({ width, height, radius, ...rest }: Omit<RectangleProps, 'type'>);
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
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>;
    getRect(): CenterBasedRect;
    getBoundingRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        top: number;
        right: number;
        bottom: number;
        cx: number;
        cy: number;
    };
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
    }): import("../../engine/selection/type").OperationHandlers[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default Rectangle;
