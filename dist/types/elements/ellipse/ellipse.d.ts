import ElementShape, { ShapeProps } from '../shape/shape';
import ElementRectangle from '../rectangle/rectangle';
import { Point } from '~/type';
export interface EllipseProps extends ShapeProps {
    type?: 'ellipse';
    r1: number;
    r2: number;
}
export type RequiredEllipseProps = Required<EllipseProps>;
declare class ElementEllipse extends ElementShape {
    readonly type = "ellipse";
    r1: number;
    r2: number;
    constructor({ r1, r2, ...rest }: EllipseProps);
    get getPoints(): Point[];
    protected updatePath2D(): void;
    protected updateOriginal(): void;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    getBoundingRect(): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(): import("~/type").BoundingRect;
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
    }): import("../../services/selection/type").OperationHandler[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementEllipse;
