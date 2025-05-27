import Editor from '~/main/editor';
import { CursorName } from '~/services/cursor/cursor';
import { CanvasHostEvent } from '~/services/element/CanvasHost';
export type ToolType = {
    cursor: CursorName;
    init: (this: Editor) => unknown;
    mouseDown?: (this: Editor, event: CanvasHostEvent) => void;
    mouseMove: (this: Editor, event: CanvasHostEvent) => unknown;
    mouseUp: (this: Editor, event: CanvasHostEvent) => void;
};
export type SubToolType = Omit<ToolType, 'mouseDown' | 'cursor'> & {
    cursor?: CursorName;
};
export type ToolName = 'selector' | 'dselector' | 'rectangle' | 'text' | 'ellipse' | 'panning' | 'lineSegment' | 'path' | 'pencil' | 'zoomIn' | 'zoomOut';
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
