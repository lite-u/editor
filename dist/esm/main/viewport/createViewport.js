import { initViewportDom } from './domManipulations.ts';
import { generateBoundingRectFromTwoPoints, throttle, } from '../../core/utils.ts';
import handleMouseDown from './eventHandlers/mouseDown.ts';
import handleMouseUp from './eventHandlers/mouseUp.ts';
import handleKeyDown from './eventHandlers/keyDown.ts';
import handleKeyUp from './eventHandlers/keyUp.ts';
import handleWheel from './eventHandlers/wheel.ts';
import handlePointerMove from './eventHandlers/pointerMove.ts';
import handleContextMenu from './eventHandlers/contextMenu.ts';
import Rectangle from '../../core/modules/shapes/rectangle.ts';
export function createViewport() {
    const { wrapper, mainCanvas, selectionCanvas, selectionBox, scrollBarX, scrollBarY, cursor, } = initViewportDom(this.id);
    const selectionCTX = selectionCanvas.getContext('2d');
    const mainCTX = mainCanvas.getContext('2d');
    const eventsController = new AbortController();
    const resizeObserver = new ResizeObserver(throttle(() => {
        this.action.dispatch('world-resized');
    }, 200));
    const { signal } = eventsController;
    const mouseDownPoint = { x: 0, y: 0 };
    const mouseMovePoint = { x: 0, y: 0 };
    const rect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
    const viewportRect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
    const worldRect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
    wrapper.addEventListener('mousedown', handleMouseDown.bind(this), {
        signal,
        passive: false,
    });
    wrapper.addEventListener('mouseup', handleMouseUp.bind(this), { signal });
    window.addEventListener('keydown', handleKeyDown.bind(this), { signal });
    window.addEventListener('keyup', handleKeyUp.bind(this), { signal });
    window.addEventListener('wheel', handleWheel.bind(this), {
        signal,
        passive: false,
    });
    wrapper.addEventListener('pointermove', handlePointerMove.bind(this), {
        signal,
    });
    wrapper.addEventListener('contextmenu', handleContextMenu.bind(this), {
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
        frame: new Rectangle(Object.assign({}, this.config.frame)),
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
