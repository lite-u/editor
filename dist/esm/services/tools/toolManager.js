import handleMouseUp from './eventHandlers/mouseUp.js';
import handleKeyDown from './eventHandlers/keyDown.js';
import handleKeyUp from './eventHandlers/keyUp.js';
import handleWheel from './eventHandlers/wheel.js';
import handlePointerMove from './eventHandlers/pointerMove.js';
import handleContextMenu from './eventHandlers/contextMenu.js';
import handleMouseDown from './eventHandlers/mouseDown.js';
class ToolManager {
    editor;
    eventsController = new AbortController();
    mouseDownPoint = { x: 0, y: 0 };
    mouseMovePoint = { x: 0, y: 0 };
    toolMap = new Map();
    spaceKeyDown = false;
    tool;
    currentToolName;
    constructor(editor) {
        const { signal } = this.eventsController;
        const { container } = editor;
        this.editor = editor;
        window.addEventListener('keydown', handleKeyDown.bind(this), { signal });
        window.addEventListener('keyup', handleKeyUp.bind(this), { signal });
        window.addEventListener('wheel', handleWheel.bind(this), { signal, passive: false });
        container.addEventListener('mousedown', handleMouseDown.bind(this), { signal, passive: false });
        container.addEventListener('mouseup', handleMouseUp.bind(this), { signal });
        container.addEventListener('pointermove', handlePointerMove.bind(this), { signal });
        container.addEventListener('contextmenu', handleContextMenu.bind(this), { signal });
    }
    set(tool) {
        this.currentToolName = tool;
        this.tool = this.toolMap.get(tool);
    }
    // currentTool: Tool
    register() { }
    destroy() {
        this.eventsController.abort();
        this.eventsController = null;
        this.editor = null;
        this.mouseDownPoint = null;
        this.mouseMovePoint = null;
        this.toolMap.clear();
        this.toolMap = null;
        this.spaceKeyDown = null;
        this.tool = null;
        this.currentToolName = null;
    }
}
export default ToolManager;
