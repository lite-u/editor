import History from '../services/history/history.js';
import Action from '../services/actions/actions.js';
import { generateBoundingRectFromTwoPoints, throttle } from '../core/utils.js';
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
import { generateElementsClones, generateTransformHandles, getSelectedBoundingElement } from './helper.js';
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
    reCalcViewport() {
        const { dpr } = this.world;
        const rect = this.container.getBoundingClientRect().toJSON();
        const { x, y, width, height } = rect;
        const viewportWidth = width * dpr;
        const viewportHeight = height * dpr;
        this.rect = { ...rect, cx: x + width / 2, cy: y + height / 2 };
        this.viewportRect = generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: viewportWidth, y: viewportHeight });
        /*
            this.mainHost.setSize(viewportWidth, viewportHeight)
            this.overlayHost.setSize(viewportWidth, viewportHeight)*/
    }
    regenerateOverlayElements() {
        generateElementsClones.call(this);
        const ele = getSelectedBoundingElement.call(this);
        console.log(ele);
        generateTransformHandles.call(this, ele);
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
