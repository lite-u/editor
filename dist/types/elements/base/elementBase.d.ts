import { BoundingRect, ElementProps, Point } from '~/type';
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
    path2D: Path2D;
    constructor({ stroke, fill, opacity, shadow, rotation, transform, show, }: ElementBaseProps);
    protected rotate(angle: number): void;
    protected transformPoint(x: number, y: number, matrix: DOMMatrix): Point;
    protected toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected updatePath2D(): void;
    protected restore(props: Partial<ElementProps>): void;
    protected getTransformedPoints(): Point[];
    protected getCenter(): Point;
    protected resetTransform(): void;
    protected applyTransform(matrix: DOMMatrix): void;
    protected getTransformMatrix(): DOMMatrix;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementBase;
