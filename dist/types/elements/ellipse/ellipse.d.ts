import Shape, { ShapeProps } from '../shape/shape';
import ElementRectangle from '../rectangle/rectangle';
import { ResizeHandleName } from '~/services/selection/type';
import { Point } from '~/type';
export interface EllipseProps extends ShapeProps {
    id: string;
    layer: number;
    type?: 'ellipse';
    r1: number;
    r2: number;
}
export type RequiredEllipseProps = Required<EllipseProps>;
declare class ElementEllipse extends Shape {
    readonly type = "ellipse";
    id: string;
    layer: number;
    r1: number;
    r2: number;
    constructor({ r1, r2, id, layer, ...rest }: EllipseProps);
    static applyResizeTransform: (props: {
        downPoint: {
            x: number;
            y: number;
        };
        movePoint: {
            x: number;
            y: number;
        };
        elementOrigin: RequiredEllipseProps;
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
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    getBoundingRect(): import("~/type").BoundingRect;
    getSelectedBoxElement(lineWidth: number, lineColor: string): ElementRectangle;
    getHighlightElement(lineWidth: number, lineColor: string): ElementEllipse;
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
    }): import("~/services/selection/type").OperationHandler[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementEllipse;
