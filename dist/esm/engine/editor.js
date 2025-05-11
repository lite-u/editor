import History from '../services/history/history.js';
import Action from '../services/actions/actions.js';
import { generateBoundingRectFromTwoPoints, rectsOverlap } from '../core/utils.js';
// import {modifySelected} from '../services/selection/helper.js'
import { updateScrollBars } from './viewport/domManipulations.js';
import selectionRender from './viewport/selectionRender.js';
import { screenToWorld, worldToScreen } from '../core/lib.js';
import { createViewport } from './viewport/createViewport.js';
import { destroyViewport } from './viewport/destroyViewport.js';
import { initEditor } from './initEditor.js';
import { zoomAtPoint } from './viewport/helper.js';
import AssetsManager from '../services/assetsManager/AssetsManager.js';
import nid from '../core/nid.js';
import ElementRectangle from '../elements/rectangle/rectangle.js';
import ElementManager from '../services/elementManager/ElementManager.js';
import Selection from '../services/selection/Selection.js';
class Editor {
    id = nid();
    // readonly id: UID
    config;
    // private moduleCounter = 0
    // readonly elementMap: ElementMap = new Map()
    refs = {};
    action;
    container;
    events = {};
    // services
    history;
    elementManager;
    selection;
    viewport;
    selectedElementIDSet = new Set();
    visibleSelected = new Set();
    operationHandlers = [];
    assetsManager;
    // resizeHandleSize: number = 10
    copiedItems = [];
    hoveredModule = null;
    // highlightedModules: Set<UID> = new Set()
    draggingModules = new Set();
    _selectingModules = new Set();
    _deselection = null;
    _resizingOperator = null;
    _rotatingOperator = null;
    selectedShadow = new Set();
    manipulationStatus = 'static';
    toolMap = new Map();
    CopyDeltaX = 50;
    CopyDeltaY = 100;
    initialized = false;
    currentToolName = 'selector';
    // private readonly snapPoints: SnapPointData[] = []
    visibleElementMap;
    constructor({ container, elements, assets = [], events = {}, config, }) {
        this.visibleElementMap = new Map();
        this.config = config;
        this.events = events;
        this.container = container;
        this.viewport = createViewport.call(this);
        this.action = new Action();
        this.history = new History(this);
        this.selection = new Selection(this);
        this.assetsManager = new AssetsManager(assets);
        this.elementManager = new ElementManager(this);
        initEditor.call(this);
        this.action.dispatch('module-add', elements);
    }
    get getVisibleElementMap() {
        return new Map(this.visibleElementMap);
    }
    get getVisibleSelected() {
        return new Set(this.visibleSelected);
    }
    get getVisibleSelectedElementMap() {
        return this.elementManager.getElementMapByIdSet(this.getVisibleSelected);
    }
    get getSelectedPropsIfUnique() {
        if (this.selectedElementIDSet.size === 1) {
            const unique = [...this.selectedElementIDSet.values()][0];
            const module = this.elementMap.get(unique);
            if (module) {
                return module.toMinimalJSON();
            }
            return null;
        }
        return null;
    }
    // getModulesByLayerIndex() {}
    /*
  
      batchCreate(moduleDataList: ElementProps[]): ElementMap {
        return batchCreate.call(this, moduleDataList)
      }
  
      batchAdd(modules: ElementMap, callback?: VoidFunction): ElementMap {
        return batchAdd.call(this, modules, callback)
      }
    */
    /*
  
      batchCopy(
        from: Set<UID>,
        includeIdentifiers = true,
      ): ElementProps[] {
        return batchCopy.call(this, from, includeIdentifiers)
      }
    */
    /*updateSnapPoints() {
      this.snapPoints.length = 0
      this.visibleelementMap.forEach(module => {
        this.snapPoints.push(...module.getSnapPoints())
      })
    }*/
    /*  batchDelete(from: Set<UID>): ElementProps[] {
        return batchDelete.call(this, from)
      }
  
      batchMove(from: Set<UID>, delta: Point) {
        batchMove.call(this, from, delta)
      }
  
      batchModify(
        idSet: Set<UID>,
        data: Partial<ElementProps>,
      ) {
        batchModify.call(this, idSet, data)
      }*/
    getModuleList() {
        return [...Object.values(this.elementMap)];
    }
    updateVisibleElementMap() {
        this.visibleElementMap.clear();
        // console.log(this.viewport.offset, this.viewport.worldRect)
        // Create an array from the Map, sort by the 'layer' property, and then add them to visibleelementMap
        const sortedModules = [...this.elementMap.values()]
            .filter(module => {
            const boundingRect = module.getBoundingRect();
            return rectsOverlap(boundingRect, this.viewport.worldRect);
        })
            .sort((a, b) => a.layer - b.layer);
        // console.log(this.elementMap)
        sortedModules.forEach(module => {
            this.visibleElementMap.set(module.id, module);
        });
    }
    updateVisibleSelected() {
        this.visibleSelected.clear();
        this.operationHandlers.length = 0;
        this.getVisibleElementMap.forEach((module) => {
            if (this.selectedElementIDSet.has(module.id)) {
                this.visibleSelected.add(module.id);
            }
        });
        const moduleProps = this.selection.getSelectedPropsIfUnique;
        if (moduleProps) {
            const module = this.elementMap.get(moduleProps.id);
            const { scale, dpr } = this.viewport;
            const lineWidth = 1 / scale * dpr;
            const resizeSize = 10 / scale * dpr;
            const rotateSize = 15 / scale * dpr;
            const lineColor = '#5491f8';
            const operators = module.getOperators(module.id, {
                size: resizeSize,
                lineColor,
                lineWidth,
                fillColor: '#fff',
            }, {
                size: rotateSize,
                lineColor: 'transparent',
                lineWidth: 0,
                fillColor: 'transparent',
            });
            this.operationHandlers.push(...operators);
        }
    }
    updateCopiedItemsDelta() {
        this.copiedItems.forEach((copiedItem) => {
            copiedItem.x += this.CopyDeltaX;
            copiedItem.y += this.CopyDeltaY;
        });
    }
    execute(type, data = null) {
        // console.log('Editor', type)
        // @ts-ignore
        this.action.execute(type, data);
    }
    // viewport
    renderModules() {
        // console.log('renderModules')
        const animate = () => {
            const { scale, dpr, mainCTX: ctx } = this.viewport;
            const frameBorder = {
                id: nid() + '-frame',
                x: this.config.page.width / 2,
                y: this.config.page.height / 2,
                width: this.config.page.width,
                height: this.config.page.height,
                fillColor: 'transparent',
                enableLine: true,
                lineWidth: 1 / scale * dpr,
                lineColor: '#000',
                layer: -1,
                opacity: 100,
            };
            const frameFill = { ...frameBorder, fillColor: '#fff', enableLine: false };
            // deduplicateObjectsByKeyValue()
            // console.log(this.visibleelementMap.size)
            // deduplicateObjectsByKeyValue
            new ElementRectangle(frameFill).render(ctx);
            this.visibleElementMap.forEach((module) => {
                module.render(ctx);
                if (module.type === 'image') {
                    const { src } = module;
                    const obj = this.assetsManager.getAssetsObj(src);
                    // console.log(this.assetsManager, src)
                    if (obj) {
                        module.renderImage(ctx, obj.imageRef);
                    }
                }
            });
            new ElementRectangle(frameBorder).render(ctx);
        };
        requestAnimationFrame(animate);
    }
    /*  public get getModulesInsideOfFrame(): ModuleInstance[] {
        const arr = []
        this.elementMap.forEach((module) => {
  
        })
      }*/
    printOut(ctx) {
        this.elementMap.forEach((module) => {
            module.render(ctx);
        });
    }
    export() {
        const { scale, offset } = this.viewport;
        const assetSet = new Set();
        const result = {
            elements: [],
            config: {
                scale,
                offset,
            },
            assets: [],
        };
        this.elementMap.forEach((module) => {
            if (module.type === 'image') {
                const { src } = module;
                if (!src)
                    return;
                const r = this.assetsManager.getAssetsObj(src);
                if (r) {
                    if (!assetSet.has(src)) {
                        assetSet.add(src);
                        result.assets.push(r);
                    }
                    console.log(result.assets);
                }
            }
            result.elements.push(module.toMinimalJSON());
        });
        return result;
    }
    renderSelections() {
        // console.log('renderSelections')
        const animate = () => {
            selectionRender.call(this);
        };
        requestAnimationFrame(animate);
    }
    updateWorldRect() {
        const { dpr } = this.viewport;
        const { width, height } = this.viewport.viewportRect;
        const p1 = this.getWorldPointByViewportPoint(0, 0);
        const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr);
        this.viewport.worldRect = generateBoundingRectFromTwoPoints(p1, p2);
        // console.log('worldRect', this.viewport.worldRect)
    }
    zoom(zoom, point) {
        const { rect } = this.viewport;
        point = point || { x: rect.width / 2, y: rect.height / 2 };
        return zoomAtPoint.call(this, point, zoom);
    }
    updateScrollBar() {
        const { scrollBarX, scrollBarY } = this.viewport;
        updateScrollBars(scrollBarX, scrollBarY);
    }
    updateViewport() {
        const { dpr, mainCanvas, selectionCanvas } = this.viewport;
        const rect = this.container.getBoundingClientRect().toJSON();
        const { x, y, width, height } = rect;
        const viewportWidth = width * dpr;
        const viewportHeight = height * dpr;
        this.viewport.rect = { ...rect, cx: x + width / 2, cy: y + height / 2 };
        this.viewport.viewportRect = generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: viewportWidth, y: viewportHeight });
        mainCanvas.width = selectionCanvas.width = viewportWidth;
        mainCanvas.height = selectionCanvas.height = viewportHeight;
    }
    getWorldPointByViewportPoint(x, y) {
        const { dpr, offset, scale } = this.viewport;
        return screenToWorld({ x, y }, offset, scale, dpr);
    }
    getViewPointByWorldPoint(x, y) {
        const { dpr, offset, scale } = this.viewport;
        return worldToScreen({ x, y }, offset, scale, dpr);
    }
    //eslint-disable-block
    destroy() {
        destroyViewport.call(this);
        this.action.destroy();
        this.history.destroy();
        this.elementManager.destroy();
    }
}
export default Editor;
