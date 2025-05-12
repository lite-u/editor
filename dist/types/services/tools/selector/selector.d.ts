import ToolManager from '~/services/tools/toolManager';
declare const selector: {
    cursor: string;
    start(this: ToolManager, e: MouseEvent): "resizing" | "rotating" | "selecting" | undefined;
    move(this: ToolManager, e: PointerEvent): void;
    finish(this: ToolManager, e: MouseEvent): void;
};
export default selector;
