import handleMouseUp from './eventHandlers/mouseUp.js';
import handleKeyDown from './eventHandlers/keyDown.js';
import handleKeyUp from './eventHandlers/keyUp.js';
import handleWheel from './eventHandlers/wheel.js';
import handlePointerMove from './eventHandlers/pointerMove.js';
import handleContextMenu from './eventHandlers/contextMenu.js';
import handleMouseDown from './eventHandlers/mouseDown.js';
import selector from './selector/selector.js';
class ToolManager {
    editor;
    eventsController = new AbortController();
    toolMap = new Map();
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
        this.toolMap.set('selector', selector);
        this.currentToolName = 'selector';
        this.tool = selector;
    }
    set(name) {
        const tool = this.toolMap.get(name);
        if (tool) {
            this.currentToolName = name;
            this.tool = tool;
            this.editor.cursor.set(tool.cursor);
        }
    }
    destroy() {
        this.eventsController.abort();
        this.eventsController = null;
        this.editor = null;
        this.toolMap.clear();
        this.toolMap = null;
        this.tool = null;
        this.currentToolName = null;
    }
}
export default ToolManager;
