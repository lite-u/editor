import Editor from '~/main/editor';
import { CursorName } from '~/services/cursor/cursor';
export type ToolType = {
    cursor: CursorName;
    mouseDown: (this: ToolManager) => void;
    mouseMove: (this: ToolManager) => unknown;
    mouseUp: (this: ToolManager) => void;
};
export type SubToolType = Omit<ToolType, 'mouseDown' | 'cursor'> & {
    cursor?: CursorName;
};
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning' | 'lineSegment' | 'path' | 'pencil' | 'zoomIn' | 'zoomOut';
declare class ToolManager {
    editor: Editor;
    eventsController: AbortController;
    toolMap: Map<ToolName, ToolType>;
    tool: ToolType;
    subTool: SubToolType | null;
    currentToolName: ToolName;
    constructor(editor: Editor);
    set(name: ToolName): void;
    destroy(): void;
}
export default ToolManager;
