import handleMouseUp from './events/pointerUp.js';
import handleKeyDown from './events/keyDown.js';
import handleKeyUp from './events/keyUp.js';
import handleWheel from './events/wheel.js';
import handlePointerMove from './events/pointerMove.js';
import handleContextMenu from './events/contextMenu.js';
import handleMouseDown from './events/pointerDown.js';
import selector from './selector/selector.js';
import rectangleTool from './rectangle/rectangleTool.js';
import panning from './panning/panning.js';
import ellipseTool from './ellipseTool.js';
import textTool from './textTool.js';
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
        container.addEventListener('pointerdown', handleMouseDown.bind(this), { signal, passive: false });
        container.addEventListener('pointerup', handleMouseUp.bind(this), { signal });
        container.addEventListener('pointermove', handlePointerMove.bind(this), { signal });
        container.addEventListener('contextmenu', handleContextMenu.bind(this), { signal });
        this.toolMap.set('selector', selector);
        this.toolMap.set('panning', panning);
        this.toolMap.set('rectangle', rectangleTool);
        this.toolMap.set('ellipse', ellipseTool);
        this.toolMap.set('text', textTool);
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
