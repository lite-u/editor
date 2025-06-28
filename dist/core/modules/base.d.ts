import Editor from '../../main/editor.ts';
export interface BasicModuleProps {
    id: UID;
    layer: number;
    type: keyof ModuleTypeMap;
    enableLine?: boolean;
    lineColor: HexColor;
    lineWidth: number;
    opacity: Opacity;
    shadow?: boolean;
    rotation?: number;
}
declare class Base {
    readonly id: UID;
    readonly type: string;
    protected enableLine: boolean;
    protected lineWidth: number;
    protected lineColor: HexColor;
    protected opacity: Opacity;
    rotation: Rotation;
    protected shadow: Shadow;
    readonly layer: number;
    constructor({ id, lineColor, lineWidth, opacity, type, layer, rotation, shadow, enableLine, }: BasicModuleProps);
    protected getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? BasicModuleProps : Omit<BasicModuleProps, 'id' & 'layer'>;
    protected getBoundingRect(): BoundingRect;
    protected render(_ctx: CanvasRenderingContext2D): void;
    static applyRotating(this: Editor, shiftKey: boolean): number;
}
export default Base;
