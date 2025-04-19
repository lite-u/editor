import Editor from '../../main/editor';
import { HexColor, Opacity, Rotation, Shadow, UID } from '../core';
import { BoundingRect } from '../../type';
export interface BasicModuleProps {
    id: UID;
    layer: number;
    enableLine?: boolean;
    lineColor: HexColor;
    lineWidth: number;
    opacity: Opacity;
    shadow?: string;
    rotation?: number;
}
declare class Base {
    id: UID;
    enableLine: boolean;
    lineWidth: number;
    lineColor: HexColor;
    opacity: Opacity;
    rotation: Rotation;
    shadow: Shadow;
    layer: number;
    constructor({ id, lineColor, lineWidth, opacity, layer, rotation, shadow, enableLine, }: BasicModuleProps);
    protected getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? BasicModuleProps : Omit<BasicModuleProps, 'id' & 'layer'>;
    protected getBoundingRect(): BoundingRect;
    protected render(_ctx: CanvasRenderingContext2D): void;
    static applyRotating(this: Editor, shiftKey: boolean): number;
}
export default Base;
