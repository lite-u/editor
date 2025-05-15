import Editor from '~/main/editor';
import { CursorName } from '~/services/cursor/cursor';
export type ToolType = {
    cursor: CursorName;
    mouseDown: (this: ToolManager, e: MouseEvent) => void;
    mouseMove: (this: ToolManager, e: PointerEvent) => void;
    mouseUp: (this: ToolManager, e: MouseEvent) => void;
    keyDown: (this: ToolManager, e: KeyboardEvent) => void;
    keyUp: (this: ToolManager, e: KeyboardEvent) => void;
};
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning';
declare class ToolManager {
    editor: Editor;
    eventsController: AbortController;
    toolMap: Map<ToolName, ToolType>;
    tool: ToolType;
    currentToolName: ToolName;
    constructor(editor: Editor);
    set(name: ToolName): void;
    destroy(): void;
}
export default ToolManager;
