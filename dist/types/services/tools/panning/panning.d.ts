import ToolManager from '~/services/tools/toolManager';
declare const panning: {
    cursor: string;
    start(this: ToolManager): void;
    move(this: ToolManager, e: PointerEvent): void;
    finish(this: ToolManager): void;
};
export default panning;
