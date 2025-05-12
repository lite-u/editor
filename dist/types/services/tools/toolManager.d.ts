import Editor from '~/main/editor';
import { Point } from '~/type';
export type ToolType = {
    start: (this: Editor, e: MouseEvent) => void;
    move: (this: Editor, e: PointerEvent) => void;
    finish: (this: Editor, e: MouseEvent) => void;
};
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning';
declare class ToolManager {
    editor: Editor;
    eventsController: AbortController;
    mouseDownPoint: Point;
    mouseMovePoint: Point;
    toolMap: Map<ToolName, ToolType>;
    spaceKeyDown: boolean;
    protected tool: ToolType;
    currentToolName: ToolName;
    constructor(editor: Editor);
    set(tool: ToolName): void;
    register(): void;
    destroy(): void;
}
export default ToolManager;
