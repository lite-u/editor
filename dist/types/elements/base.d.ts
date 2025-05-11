import { HexColor, Opacity, Rotation, Shadow, UID } from '~/core/core';
import { BoundingRect } from '~/type';
import Editor from '~/engine/editor';
export interface BasicModuleProps {
    id: UID;
    layer?: number;
    enableLine?: boolean;
    lineColor?: HexColor;
    lineWidth?: number;
    opacity?: Opacity;
    shadow?: boolean;
    rotation?: number;
}
declare class Base {
    readonly id: UID;
    rotation: Rotation;
    readonly layer: number;
    protected enableLine: boolean;
    protected lineWidth: number;
    protected lineColor: HexColor;
    protected opacity: Opacity;
    protected shadow: Shadow;
    constructor({ id, lineColor, lineWidth, opacity, layer, rotation, shadow, enableLine, }: BasicModuleProps);
    static applyRotating(this: Editor, shiftKey: boolean): number;
    protected getDetails(): BasicModuleProps;
    protected getBoundingRect(): BoundingRect;
    protected render(_ctx: CanvasRenderingContext2D): void;
}
export default Base;
