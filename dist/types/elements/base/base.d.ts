import { Shadow } from '~/core/core';
import { BoundingRect } from '~/type';
import { Fill, Stroke, Transform } from '~/elements/defaultProps';
export interface ElementBaseProps {
    stroke?: Stroke;
    fill?: Fill;
    opacity?: number;
    shadow?: Shadow;
    rotation?: number;
    transform?: Transform;
}
export type RequiredBaseProps = Required<ElementBaseProps>;
declare class Base {
    stroke: Stroke;
    fill: Fill;
    opacity: number;
    shadow: Shadow;
    rotation: number;
    transform: Transform;
    constructor({ stroke, fill, opacity, shadow, rotation, transform, }: ElementBaseProps);
    protected toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected render(_ctx: CanvasRenderingContext2D): void;
}
export default Base;
