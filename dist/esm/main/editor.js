import History from '../services/history/history.js';
import Action from '../services/actions/actions.js';
import { generateBoundingRectFromTwoPoints, getMinimalBoundingRect, throttle } from '../core/utils.js';
import { initEvents } from './events.js';
import AssetsManager from '../services/assets/AssetsManager.js';
import nid from '../core/nid.js';
import ToolManager from '../services/tool/toolManager.js';
import CanvasHost from '../services/element/CanvasHost.js';
import SelectionManager from '../services/selection/SelectionManager.js';
import Cursor from '../services/cursor/cursor.js';
import World from '../services/world/World.js';
import ClipboardManager from '../services/clipboard/Clipboard.js';
import InteractionState from '../services/interaction/InteractionState.js';
import ElementRectangle from '../elements/rectangle/rectangle.js';
import dragging from '../services/tool/selector/dragging/dragging.js';
import { getManipulationBox } from '../lib/lib.js';
import { getBoundingRectFromBoundingRects } from '../services/tool/resize/helper.js';
import { DEFAULT_STROKE } from '../elements/defaultProps.js';
class Editor {
    id = nid();
    container;
    config;
    events = {};
    resizeObserver;
    // eventManager: EventManager
    world;
    action;
    // visible: VisibleManager
    interaction;
    clipboard;
    cursor;
    history;
    toolManager;
    mainHost;
    overlayHost;
    selection;
    assetsManager;
    rect;
    viewportRect;
    initialized = false;
    // private readonly snapPoints: SnapPointData[] = []
    // private readonly visibleElementMap: ElementMap
    constructor({ container, elements, assets = [], events = {}, config, }) {
        this.config = config;
        this.events = events;
        this.container = container;
        // services
        this.action = new Action();
        // this.eventManager = new EventManager(this)
        // this.visible = new VisibleManager(this)
        this.clipboard = new ClipboardManager();
        this.interaction = new InteractionState(this);
        this.world = new World(this);
        this.toolManager = new ToolManager(this);
        this.cursor = new Cursor(this);
        this.history = new History(this);
        this.selection = new SelectionManager(this);
        this.assetsManager = new AssetsManager(this, assets);
        this.mainHost = new CanvasHost(this);
        this.overlayHost = new CanvasHost(this);
        this.resizeObserver = new ResizeObserver(throttle(() => { this.action.dispatch('world-resized'); }, 200));
        initEvents.call(this);
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 0, y: 0 };
        this.rect = generateBoundingRectFromTwoPoints(p1, p2);
        this.viewportRect = generateBoundingRectFromTwoPoints(p1, p2);
        this.resizeObserver.observe(container);
        // this.toolManager.set('rectangle')
        // this.toolManager.set('selector')
        this.action.dispatch('element-add', elements);
    }
    /*  public get getElementsInsideOfFrame(): ElementInstance[] {
        const arr = []
        this.elementManager.all.forEach((element) => {
  
        })
      }*/
    execute(type, data = null) {
        // console.log('Editor', type)
        // @ts-ignore
        this.action.execute(type, data);
    }
    export() {
        const { scale, offset } = this.world;
        const assetSet = new Set();
        const result = {
            elements: [],
            config: {
                scale,
                offset,
            },
            assets: [],
        };
        this.mainHost.all.forEach((element) => {
            if (element.type === 'image') {
                const { asset } = element;
                if (!asset)
                    return;
                const r = this.assetsManager.getAssetsObj(asset);
                if (r) {
                    if (!assetSet.has(asset)) {
                        assetSet.add(asset);
                        result.assets.push(r);
                    }
                    console.log(result.assets);
                }
            }
            result.elements.push(element.toMinimalJSON());
        });
        return result;
    }
    updateViewport() {
        const { dpr } = this.world;
        const rect = this.container.getBoundingClientRect().toJSON();
        const { x, y, width, height } = rect;
        const viewportWidth = width * dpr;
        const viewportHeight = height * dpr;
        this.rect = { ...rect, cx: x + width / 2, cy: y + height / 2 };
        this.viewportRect = generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: viewportWidth, y: viewportHeight });
        this.mainHost.setSize(viewportWidth, viewportHeight);
        this.overlayHost.setSize(viewportWidth, viewportHeight);
    }
    generateOverlayElements() {
        this.overlayHost.reset();
        const boxColor = '#435fb9';
        const { world, action, toolManager, selection, mainHost, overlayHost } = this;
        const { scale, dpr } = world;
        const ratio = scale * dpr;
        const pointLen = 20 / ratio;
        const idSet = selection.values;
        const elements = mainHost.getElementsByIdSet(idSet);
        let rotations = [];
        if (elements.length <= 1) {
            // this.selectedOutlineElement = null
            if (elements.length === 0)
                return;
        }
        const rectsWithRotation = [];
        const rectsWithoutRotation = [];
        elements.forEach((ele) => {
            const id = ele.id;
            const clone = ele.clone();
            const centerPoint = ElementRectangle.create('handle-move-center', ele.cx, ele.cy, pointLen);
            clone.fill.enabled = false;
            clone.stroke.enabled = true;
            clone.stroke.weight = 2 / scale;
            clone.stroke.color = '#5491f8';
            centerPoint.stroke.enabled = false;
            centerPoint.fill.enabled = true;
            centerPoint.fill.color = 'orange';
            clone.onmouseenter = () => {
                if (this.selection.has(ele.id))
                    return;
            };
            clone.onmouseleave = () => {
                action.dispatch('rerender-overlay');
            };
            clone.onmousedown = () => {
                if (!selection.has(id)) {
                    action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([id]) });
                }
                toolManager.subTool = dragging;
                this.interaction._draggingElements = mainHost.getElementsByIdSet(selection.values);
            };
            overlayHost.append(clone);
            overlayHost.append(centerPoint);
            // this.transformHandles.push(centerPoint)
            rotations.push(ele.rotation);
            rectsWithRotation.push(ele.getBoundingRect());
            rectsWithoutRotation.push(ele.getBoundingRect(true));
        });
        // selectedOutlineElement
        const sameRotation = rotations.every(val => val === rotations[0]);
        const applyRotation = sameRotation ? rotations[0] : 0;
        let rect;
        const specialLineSeg = idSet.size === 1 && elements[0].type === 'lineSegment';
        if (sameRotation) {
            rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation);
            if (specialLineSeg) {
                rect.width = 1;
                rect.cx = elements[0].cx;
            }
            overlayHost.append(...getManipulationBox(rect, applyRotation, ratio, specialLineSeg));
        }
        else {
            rect = getBoundingRectFromBoundingRects(rectsWithRotation);
            overlayHost.append(...getManipulationBox(rect, 0, ratio, specialLineSeg));
        }
        const selectedOutlineElement = new ElementRectangle({
            id: 'selected-elements-outline',
            layer: 0,
            show: !specialLineSeg,
            type: 'rectangle',
            ...rect,
            rotation: applyRotation,
            stroke: {
                ...DEFAULT_STROKE,
                weight: 2 / scale,
                color: boxColor,
            },
        });
        overlayHost.append(selectedOutlineElement);
    }
    destroy() {
        // this.destroy()
        this.action.destroy();
        this.history.destroy();
        this.mainHost.destroy();
        this.overlayHost.destroy();
        // this.eventManager.destroy()
        this.action.destroy();
        // this.visible.destroy()
        this.clipboard.destroy();
        this.interaction.destroy();
        this.world.destroy();
        this.toolManager.destroy();
        this.cursor.destroy();
        this.history.destroy();
        this.selection.destroy();
        this.assetsManager.destroy();
        this.mainHost.destroy();
        this.resizeObserver.disconnect();
    }
}
export default Editor;
