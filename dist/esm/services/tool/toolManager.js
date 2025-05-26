import handleMouseUp from './baseEvents/pointerUp.js';
import handleKeyDown from './baseEvents/keyDown.js';
import handleKeyUp from './baseEvents/keyUp.js';
import handlePointerMove from './baseEvents/pointerMove.js';
import handleContextMenu from './baseEvents/contextMenu.js';
import handleMouseDown from './baseEvents/pointerDown.js';
import selector from './selector/selector.js';
import dSelector from './dselector/dselector.js';
import panning from './panning/panning.js';
import rectangleTool from './rectangle/rectangleTool.js';
import ellipseTool from './ellipseTool.js';
import textTool from './textTool.js';
import lineSegmentTool from './lineSegmentTool.js';
import pencilTool from './pencil/pencilTool.js';
import { zoomInTool, zoomOutTool } from './zoomTool.js';
class ToolManager {
    editor;
    eventsController = new AbortController();
    toolMap = new Map();
    tool;
    subTool = null;
    currentToolName;
    constructor(editor) {
        const { signal } = this.eventsController;
        const { container } = editor;
        this.editor = editor;
        // window.addEventListener('wheel', handleWheel.bind(this), {signal, passive: false})
        window.addEventListener('keydown', handleKeyDown.bind(this), { signal });
        window.addEventListener('keyup', handleKeyUp.bind(this), { signal });
        editor.overlayHost.onmousedown = handleMouseDown.bind(this);
        // container.addEventListener('pointerdown', handleMouseDown.bind(this), {signal, passive: false})
        container.addEventListener('pointerup', handleMouseUp.bind(this), { signal });
        container.addEventListener('pointermove', handlePointerMove.bind(this), { signal });
        container.addEventListener('contextmenu', handleContextMenu.bind(this), { signal });
        this.toolMap.set('selector', selector);
        this.toolMap.set('dselector', dSelector);
        this.toolMap.set('panning', panning);
        this.toolMap.set('rectangle', rectangleTool);
        this.toolMap.set('ellipse', ellipseTool);
        this.toolMap.set('text', textTool);
        this.toolMap.set('lineSegment', lineSegmentTool);
        this.toolMap.set('zoomIn', zoomInTool);
        this.toolMap.set('zoomOut', zoomOutTool);
        this.toolMap.set('pencil', pencilTool);
        this.currentToolName = 'selector';
        this.tool = selector;
    }
    set(name) {
        const tool = this.toolMap.get(name);
        console.log(tool);
        if (tool) {
            this.currentToolName = name;
            this.tool = tool;
            this.editor.cursor.set(tool.cursor);
            tool.init?.call(this.editor);
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
