import { initViewportDom } from './domManipulations.js';
import { generateBoundingRectFromTwoPoints, throttle } from '../../core/utils.js';
import handleMouseDown from '../tools/eventHandlers/mouseDown.js';
import handleMouseUp from '../tools/eventHandlers/mouseUp.js';
import handleKeyDown from '../tools/eventHandlers/keyDown.js';
import handleKeyUp from '../tools/eventHandlers/keyUp.js';
import handleWheel from '../tools/eventHandlers/wheel.js';
import handlePointerMove from '../tools/eventHandlers/pointerMove.js';
import handleContextMenu from '../tools/eventHandlers/contextMenu.js';
class Viewport {
    editor;
    refs;
    // mainCTX: CanvasRenderingContext2D
    // selectionCTX: CanvasRenderingContext2D
    resizeObserver;
    eventsController;
    initialized;
    dpr;
    spaceKeyDown;
    // zooming: boolean
    rect;
    viewportRect;
    worldRect;
    offset;
    scale;
    enableCrossLine = false;
    drawCrossLineDefault = false;
    drawCrossLine = false;
    constructor(editor) {
        const id = editor.id;
        this.editor = editor;
        this.refs = initViewportDom(id);
        const { 
        // mainCanvas,
        // selectionCanvas,
        wrapper,
        // selectionBox,
        // cursor,
        // scrollBarY,
        // scrollBarX,
         } = this.refs;
        // this.selectionCTX = selectionCanvas.getContext('2d') as CanvasRenderingContext2D
        // this.mainCTX = mainCanvas.getContext('2d') as CanvasRenderingContext2D
        this.eventsController = new AbortController();
        this.resizeObserver = new ResizeObserver(throttle(() => {
            // console.log('resize')
            this.editor.action.dispatch('world-resized');
        }, 200));
        const { signal } = this.eventsController;
        const mouseDownPoint = { x: 0, y: 0 };
        const mouseMovePoint = { x: 0, y: 0 };
        this.rect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
        this.viewportRect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
        this.worldRect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
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
    }
    destroy() {
        this.resizeObserver.disconnect();
        this.eventsController.abort();
        this.refs.wrapper.style.width = '100%';
        this.refs.wrapper.style.height = '100%';
        this.refs.wrapper.remove();
    }
}
export default Viewport;
