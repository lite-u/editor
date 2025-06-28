"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pointerUp_1 = __importDefault(require("~/services/tool/baseEvents/pointerUp"));
const keyDown_1 = __importDefault(require("~/services/tool/baseEvents/keyDown"));
const keyUp_1 = __importDefault(require("~/services/tool/baseEvents/keyUp"));
const pointerMove_1 = __importDefault(require("~/services/tool/baseEvents/pointerMove"));
const contextMenu_1 = __importDefault(require("~/services/tool/baseEvents/contextMenu"));
const pointerDown_1 = __importDefault(require("~/services/tool/baseEvents/pointerDown"));
const selector_1 = __importDefault(require("~/services/tool/selector/selector"));
const dselector_1 = __importDefault(require("~/services/tool/dselector/dselector"));
const panning_1 = __importDefault(require("~/services/tool/panning/panning"));
const rectangleTool_1 = __importDefault(require("~/services/tool/rectangle/rectangleTool"));
const ellipseTool_1 = __importDefault(require("~/services/tool/ellipseTool"));
const textTool_1 = __importDefault(require("~/services/tool/textTool"));
const lineSegmentTool_1 = __importDefault(require("~/services/tool/lineSegmentTool"));
const pencilTool_1 = __importDefault(require("~/services/tool/pencil/pencilTool"));
const zoomTool_1 = require("~/services/tool/zoomTool");
class ToolManager {
    constructor(editor) {
        this.eventsController = new AbortController();
        this.toolMap = new Map();
        this.subTool = null;
        const { signal } = this.eventsController;
        // const {container} = editor
        this.editor = editor;
        // window.addEventListener('wheel', handleWheel.bind(this), {signal, passive: false})
        window.addEventListener('keydown', keyDown_1.default.bind(this), { signal });
        window.addEventListener('keyup', keyUp_1.default.bind(this), { signal });
        editor.overlayHost.onmousedown = pointerDown_1.default.bind(this);
        editor.overlayHost.onmouseup = pointerUp_1.default.bind(this);
        editor.overlayHost.onmousemove = pointerMove_1.default.bind(this);
        editor.overlayHost.oncontextmenu = contextMenu_1.default.bind(this);
        // container.addEventListener('pointerdown', handleMouseDown.bind(this), {signal, passive: false})
        // container.addEventListener('pointerup', handleMouseUp.bind(this), {signal})
        // container.addEventListener('pointermove', handlePointerMove.bind(this), {signal})
        // container.addEventListener('contextmenu', handleContextMenu.bind(this), {signal})
        this.toolMap.set('selector', selector_1.default);
        this.toolMap.set('dselector', dselector_1.default);
        this.toolMap.set('panning', panning_1.default);
        this.toolMap.set('rectangle', rectangleTool_1.default);
        this.toolMap.set('ellipse', ellipseTool_1.default);
        this.toolMap.set('text', textTool_1.default);
        this.toolMap.set('lineSegment', lineSegmentTool_1.default);
        this.toolMap.set('zoomIn', zoomTool_1.zoomInTool);
        this.toolMap.set('zoomOut', zoomTool_1.zoomOutTool);
        this.toolMap.set('pencil', pencilTool_1.default);
        this.currentToolName = 'selector';
        this.tool = selector_1.default;
    }
    set(name) {
        const tool = this.toolMap.get(name);
        console.log(tool);
        if (tool) {
            this.currentToolName = name;
            this.tool = tool;
            this.editor.cursor.set(tool.cursor);
            // tool.init?.call(this.editor)
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
exports.default = ToolManager;
