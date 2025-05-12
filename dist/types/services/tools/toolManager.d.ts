import Editor from '~/main/editor';
export type ToolType = {
    start: (this: Editor, e: MouseEvent) => void;
    move: (this: Editor, e: PointerEvent) => void;
    finish: (this: Editor, e: MouseEvent) => void;
};
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning';
declare class ToolManager {
    editor: Editor;
    eventsController: AbortController;
    toolMap: Map<ToolName, ToolType>;
    protected tool: ToolType;
    currentToolName: ToolName;
    constructor(editor: Editor);
    set(tool: ToolName): void;
    destroy(): void;
}
export default ToolManager;
