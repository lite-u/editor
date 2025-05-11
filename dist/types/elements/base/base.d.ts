import { Rotation } from '~/core/core';
import { BoundingRect } from '~/type';
import Editor from '~/engine/editor';
export interface ElementBaseProps {
    enableLine?: boolean;
    lineColor?: CanvasRenderingContext2D['strokeStyle'];
    lineWidth?: CanvasRenderingContext2D['lineWidth'];
    opacity?: CanvasRenderingContext2D['globalAlpha'];
    enableShadow?: boolean;
    shadow?: string;
    rotation?: number;
}
export type RequiredBaseProps = Required<ElementBaseProps>;
declare class Base {
    rotation: Rotation;
    protected enableLine: boolean;
    protected lineWidth: CanvasRenderingContext2D['lineWidth'];
    protected lineColor: CanvasRenderingContext2D['strokeStyle'];
    protected opacity: CanvasRenderingContext2D['globalAlpha'];
    protected enableShadow: boolean;
    protected shadow: string;
    constructor({ enableLine, lineColor, lineWidth, opacity, rotation, enableShadow, shadow, }: ElementBaseProps);
    static applyRotating(this: Editor, shiftKey: boolean): number;
    protected toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected render(_ctx: CanvasRenderingContext2D): void;
}
export default Base;
