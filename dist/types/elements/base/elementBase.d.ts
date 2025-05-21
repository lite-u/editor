import { BoundingRect, ElementProps, Point, UID } from '~/type';
import { Fill, Shadow, Stroke, Transform } from '~/elements/props';
export interface ElementBaseProps {
    id: UID;
    layer: number;
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
    id: UID;
    layer: number;
    stroke: Stroke;
    fill: Fill;
    opacity: number;
    shadow: Shadow;
    rotation: number;
    transform: Transform;
    show: boolean;
    protected matrix: DOMMatrix;
    path2D: Path2D;
    constructor({ id, layer, stroke, fill, opacity, shadow, rotation, transform, show, }: ElementBaseProps);
    protected rotate(angle: number): void;
    static transformPoint(x: number, y: number, matrix: DOMMatrix): Point;
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
