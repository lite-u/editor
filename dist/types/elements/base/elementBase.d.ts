import { BoundingRect, Point } from '~/type';
import { Fill, Shadow, Stroke, Transform } from '~/elements/props';
export interface ElementBaseProps {
    stroke?: Stroke;
    fill?: Fill;
    opacity?: number;
    shadow?: Shadow;
    rotation?: number;
    transform?: Transform;
    show?: boolean;
}
export type RequiredBaseProps = Required<ElementBaseProps>;
declare class ElementBase {
    stroke: Stroke;
    fill: Fill;
    opacity: number;
    shadow: Shadow;
    rotation: number;
    transform: Transform;
    show: boolean;
    protected matrix: DOMMatrix;
    constructor({ stroke, fill, opacity, shadow, rotation, transform, show, }: ElementBaseProps);
    protected rotate(angle: number, center?: Point): void;
    protected transformPoint(x: number, y: number, matrix: DOMMatrix): Point;
    protected toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected getTransformedPoints(): Point[];
    protected getCenter(): Point;
    protected resetTransform(): void;
    protected applyTransform(matrix: DOMMatrix): void;
    protected getTransformMatrix(): DOMMatrix;
    protected render(_: CanvasRenderingContext2D): void;
}
export default ElementBase;
