import History from './history/history.js';
import Action from './actions/actions.js';
import { generateBoundingRectFromTwoPoints, rectsOverlap } from '../core/utils.js';
import { batchAdd, batchCopy, batchCreate, batchDelete, batchModify, batchMove } from './modules/moduleModify.js';
import { modifySelected } from './selection/helper.js';
import { updateScrollBars } from './viewport/domManipulations.js';
import selectionRender from './viewport/selectionRender.js';
import { screenToWorld, worldToScreen } from '../core/lib.js';
import { createViewport } from './viewport/createViewport.js';
import { destroyViewport } from './viewport/destroyViewport.js';
import { initEditor } from './initEditor.js';
import { zoomAtPoint } from './viewport/helper.js';
import AssetsManager from './assetsManager/AssetsManager.js';
import nid from '../core/nid.js';
import Rectangle from '../elements/rectangle/rectangle.js';
class Editor {
    id = nid();
    // readonly id: UID
    config;
    // private moduleCounter = 0
    moduleMap = new Map();
    action;
    container;
    events = {};
    history;
    viewport;
    selectedModules = new Set();
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
    visibleModuleMap;
    constructor({ container, elements, assets = [], events = {}, config, }) {
        this.visibleModuleMap = new Map();
        this.config = config;
        this.events = events;
        this.action = new Action();
        this.container = container;
        this.history = new History(this);
        this.viewport = createViewport.call(this);
        this.moduleMap = new Map();
        // this.moduleCounter = config.moduleIdCounter
        this.assetsManager = new AssetsManager(assets);
        initEditor.call(this);
        this.action.dispatch('module-add', elements);
    }
    get getVisibleModuleMap() {
        return new Map(this.visibleModuleMap);
    }
    get getVisibleSelected() {
        return new Set(this.visibleSelected);
    }
    get getVisibleSelectedModuleMap() {
        return this.getModulesByIdSet(this.getVisibleSelected);
    }
    get getSelected() {
        return new Set(this.selectedModules);
    }
    get getMaxLayerIndex() {
        let max = 0;
        this.moduleMap.forEach((mod) => {
            // console.log(mod.layer)
            if (mod.layer > max) {
                max = mod.layer;
            }
        });
        return max;
    }
    get getSelectedPropsIfUnique() {
        if (this.selectedModules.size === 1) {
            const unique = [...this.selectedModules.values()][0];
            const module = this.moduleMap.get(unique);
            if (module) {
                return module.toMinimalJSON();
            }
            return null;
        }
        return null;
    }
    // getModulesByLayerIndex() {}
    batchCreate(moduleDataList) {
        return batchCreate.call(this, moduleDataList);
    }
    batchAdd(modules, callback) {
        return batchAdd.call(this, modules, callback);
    }
    batchCopy(from, includeIdentifiers = true) {
        return batchCopy.call(this, from, includeIdentifiers);
    }
    /*updateSnapPoints() {
      this.snapPoints.length = 0
      this.visibleModuleMap.forEach(module => {
        this.snapPoints.push(...module.getSnapPoints())
      })
    }*/
    batchDelete(from) {
        return batchDelete.call(this, from);
    }
    batchMove(from, delta) {
        batchMove.call(this, from, delta);
    }
    batchModify(idSet, data) {
        batchModify.call(this, idSet, data);
    }
    getModulesByIdSet(idSet) {
        const result = new Map();
        idSet.forEach((id) => {
            const mod = this.moduleMap.get(id);
            if (mod) {
                result.set(id, mod);
            }
        });
        return result;
    }
    getModuleList() {
        return [...Object.values(this.moduleMap)];
    }
    updateVisibleModuleMap() {
        this.visibleModuleMap.clear();
        // console.log(this.viewport.offset, this.viewport.worldRect)
        // Create an array from the Map, sort by the 'layer' property, and then add them to visibleModuleMap
        const sortedModules = [...this.moduleMap.values()]
            .filter(module => {
            const boundingRect = module.getBoundingRect();
            return rectsOverlap(boundingRect, this.viewport.worldRect);
        })
            .sort((a, b) => a.layer - b.layer);
        // console.log(this.moduleMap)
        sortedModules.forEach(module => {
            this.visibleModuleMap.set(module.id, module);
        });
    }
    updateVisibleSelected() {
        this.visibleSelected.clear();
        this.operationHandlers.length = 0;
        this.getVisibleModuleMap.forEach((module) => {
            if (this.selectedModules.has(module.id)) {
                this.visibleSelected.add(module.id);
            }
        });
        const moduleProps = this.getSelectedPropsIfUnique;
        if (moduleProps) {
            const module = this.moduleMap.get(moduleProps.id);
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
    createElement(props) {
    }
    modifySelected(idSet, action) {
        modifySelected.call(this, idSet, action);
    }
    addSelected(idSet) {
        modifySelected.call(this, idSet, 'add');
    }
    deleteSelected(idSet) {
        modifySelected.call(this, idSet, 'delete');
    }
    toggleSelected(idSet) {
        modifySelected.call(this, idSet, 'toggle');
    }
    replaceSelected(idSet) {
        modifySelected.call(this, idSet, 'replace');
    }
    selectAll() {
        this.selectedModules.clear();
        this.moduleMap.forEach((module) => {
            this.selectedModules.add(module.id);
        });
        // this.events.onSelectionUpdated?.(this.selectedModules)
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
            // console.log(this.visibleModuleMap.size)
            // deduplicateObjectsByKeyValue
            new Rectangle(frameFill).render(ctx);
            this.visibleModuleMap.forEach((module) => {
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
            new Rectangle(frameBorder).render(ctx);
        };
        requestAnimationFrame(animate);
    }
    /*  public get getModulesInsideOfFrame(): ModuleInstance[] {
        const arr = []
        this.moduleMap.forEach((module) => {
  
        })
      }*/
    printOut(ctx) {
        this.moduleMap.forEach((module) => {
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
        this.moduleMap.forEach((module) => {
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
        this.moduleMap.clear();
    }
}
export default Editor;
