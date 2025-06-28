import Shape, { ShapeProps } from './shape';
import { SnapPointData } from '../../../main/type';
import Rectangle from './rectangle';
import { ResizeHandleName } from '../../../main/selection/type';
import { CenterBasedRect, Point } from '../../../type';
export interface EllipseProps extends ShapeProps {
    r1: number;
    r2: number;
    type: 'ellipse';
}
declare class Ellipse extends Shape {
    readonly type = "ellipse";
    r1: number;
    r2: number;
    constructor({ fillColor, enableFill, r1, r2, ...rest }: Omit<EllipseProps, 'type'>);
    static applyResizeTransform: ({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: {
        downPoint: {
            x: number;
            y: number;
        };
        movePoint: {
            x: number;
            y: number;
        };
        moduleOrigin: EllipseProps;
        rotation: number;
        handleName: ResizeHandleName;
        scale: number;
        dpr: number;
        altKey?: boolean;
        shiftKey?: boolean;
    }) => Point & {
        r1: number;
        r2: number;
    };
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? EllipseProps : Omit<EllipseProps, 'id' & 'layer'>;
    getBoundingRect(): import("../../../type").BoundingRect;
    getRect(): CenterBasedRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle;
    getHighlightModule(lineWidth: number, lineColor: string): Ellipse;
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
export default Ellipse;
