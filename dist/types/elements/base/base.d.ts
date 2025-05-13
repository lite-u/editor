import { BoundingRect } from '~/type';
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
declare class Base {
    stroke: Stroke;
    fill: Fill;
    opacity: number;
    shadow: Shadow;
    rotation: number;
    transform: Transform;
    show: boolean;
    constructor({ stroke, fill, opacity, shadow, rotation, transform, show, }: ElementBaseProps);
    protected toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected _toJSON(): unknown;
    protected render(_ctx: CanvasRenderingContext2D): void;
}
export default Base;
