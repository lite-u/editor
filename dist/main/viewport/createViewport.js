"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewport = createViewport;
const domManipulations_ts_1 = require("./domManipulations.ts");
const utils_ts_1 = require("../../core/utils.ts");
const mouseDown_ts_1 = __importDefault(require("./eventHandlers/mouseDown.ts"));
const mouseUp_ts_1 = __importDefault(require("./eventHandlers/mouseUp.ts"));
const keyDown_ts_1 = __importDefault(require("./eventHandlers/keyDown.ts"));
const keyUp_ts_1 = __importDefault(require("./eventHandlers/keyUp.ts"));
const wheel_ts_1 = __importDefault(require("./eventHandlers/wheel.ts"));
const pointerMove_ts_1 = __importDefault(require("./eventHandlers/pointerMove.ts"));
const contextMenu_ts_1 = __importDefault(require("./eventHandlers/contextMenu.ts"));
const rectangle_ts_1 = __importDefault(require("../../core/modules/shapes/rectangle.ts"));
function createViewport() {
    const { wrapper, mainCanvas, selectionCanvas, selectionBox, scrollBarX, scrollBarY, cursor, } = (0, domManipulations_ts_1.initViewportDom)(this.id);
    const selectionCTX = selectionCanvas.getContext('2d');
    const mainCTX = mainCanvas.getContext('2d');
    const eventsController = new AbortController();
    const resizeObserver = new ResizeObserver((0, utils_ts_1.throttle)(() => {
        this.action.dispatch('world-resized');
    }, 200));
    const { signal } = eventsController;
    const mouseDownPoint = { x: 0, y: 0 };
    const mouseMovePoint = { x: 0, y: 0 };
    const rect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)(mouseDownPoint, mouseMovePoint);
    const viewportRect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)(mouseDownPoint, mouseMovePoint);
    const worldRect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)(mouseDownPoint, mouseMovePoint);
    wrapper.addEventListener('mousedown', mouseDown_ts_1.default.bind(this), {
        signal,
        passive: false,
    });
    wrapper.addEventListener('mouseup', mouseUp_ts_1.default.bind(this), { signal });
    window.addEventListener('keydown', keyDown_ts_1.default.bind(this), { signal });
    window.addEventListener('keyup', keyUp_ts_1.default.bind(this), { signal });
    window.addEventListener('wheel', wheel_ts_1.default.bind(this), {
        signal,
        passive: false,
    });
    wrapper.addEventListener('pointermove', pointerMove_ts_1.default.bind(this), {
        signal,
    });
    wrapper.addEventListener('contextmenu', contextMenu_ts_1.default.bind(this), {
        signal,
    });
    return {
        drawCrossLine: false,
        drawCrossLineDefault: false,
        enableCrossLine: false,
        // handlingModules: undefined,
        // hoveredModules: undefined,
        initialized: false,
        // manipulationStatus: undefined,
        scale: 1,
        spaceKeyDown: false,
        zooming: false,
        dpr: this.config.dpr,
        frame: new rectangle_ts_1.default(Object.assign({}, this.config.frame)),
        offset: { x: 0, y: 0 },
        viewportRect,
        worldRect,
        mouseDownPoint,
        mouseMovePoint,
        rect,
        wrapper,
        mainCanvas,
        selectionCanvas,
        selectionCTX,
        mainCTX,
        scrollBarX,
        scrollBarY,
        selectionBox,
        cursor,
        resizeObserver,
        eventsController,
    };
}
