import Editor from '~/main/editor';
export type ToolType = {
    start: (this: ToolManager, e: MouseEvent) => void;
    move: (this: ToolManager, e: PointerEvent) => void;
    finish: (this: ToolManager, e: MouseEvent) => void;
};
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning';
declare class ToolManager {
    editor: Editor;
    eventsController: AbortController;
    toolMap: Map<ToolName, ToolType>;
    tool: ToolType;
    currentToolName: ToolName;
    constructor(editor: Editor);
    set(tool: ToolName): void;
    destroy(): void;
}
export default ToolManager;
