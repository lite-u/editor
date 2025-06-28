"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const history_ts_1 = __importDefault(require("./history/history.ts"));
const actions_ts_1 = __importDefault(require("./actions/actions.ts"));
const utils_ts_1 = require("../core/utils.ts");
const moduleModify_ts_1 = require("./modules/moduleModify.ts");
const helper_ts_1 = require("./selection/helper.ts");
const domManipulations_ts_1 = require("./viewport/domManipulations.ts");
const selectionRender_ts_1 = __importDefault(require("./viewport/selectionRender.ts"));
const lib_ts_1 = require("../lib/lib.ts");
const createViewport_ts_1 = require("./viewport/createViewport.ts");
const destroyViewport_ts_1 = require("./viewport/destroyViewport.ts");
const initEditor_ts_1 = require("./initEditor.ts");
const helper_ts_2 = require("./viewport/helper.ts");
class Editor {
    constructor({ container, data, events = {}, config, }) {
        this.moduleCounter = 0;
        this.events = {};
        this.selectedModules = new Set();
        this.visibleSelected = new Set();
        this.operationHandlers = [];
        // resizeHandleSize: number = 10
        this.copiedItems = [];
        this.hoveredModule = null;
        // highlightedModules: Set<UID> = new Set()
        this.draggingModules = new Set();
        this._selectingModules = new Set();
        this._deselection = null;
        this._resizingOperator = null;
        this._rotatingOperator = null;
        this.selectedShadow = new Set();
        this.manipulationStatus = 'static';
        this.CopyDeltaX = 50;
        this.CopyDeltaY = 100;
        this.initialized = false;
        this.visibleModuleMap = new Map();
        this.id = data.id;
        this.config = config;
        this.events = events;
        this.action = new actions_ts_1.default();
        this.container = container;
        this.history = new history_ts_1.default(this);
        this.viewport = createViewport_ts_1.createViewport.call(this);
        this.moduleMap = new Map();
        this.moduleCounter = config.moduleIdCounter;
        const modules = this.batchCreate(data.modules);
        modules.forEach((module) => {
            this.moduleMap.set(module.id, module);
        });
        this.init();
    }
    init() {
        initEditor_ts_1.initEditor.call(this);
    }
    get createModuleId() {
        return this.id + '-' + ++this.moduleCounter;
    }
    batchCreate(moduleDataList) {
        return moduleModify_ts_1.batchCreate.call(this, moduleDataList);
    }
    batchAdd(modules) {
        return moduleModify_ts_1.batchAdd.call(this, modules);
    }
    batchCopy(from, includeIdentifiers = true) {
        return moduleModify_ts_1.batchCopy.call(this, from, includeIdentifiers);
    }
    batchDelete(from) {
        return moduleModify_ts_1.batchDelete.call(this, from);
    }
    batchMove(from, delta) {
        moduleModify_ts_1.batchMove.call(this, from, delta);
    }
    batchModify(idSet, data) {
        moduleModify_ts_1.batchModify.call(this, idSet, data);
    }
    // getModulesByLayerIndex() {}
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
            return (0, utils_ts_1.rectsOverlap)(boundingRect, this.viewport.worldRect);
        })
            .sort((a, b) => a.layer - b.layer);
        sortedModules.forEach(module => {
            this.visibleModuleMap.set(module.id, module);
        });
    }
    /*updateSnapPoints() {
      this.snapPoints.length = 0
      this.visibleModuleMap.forEach(module => {
        this.snapPoints.push(...module.getSnapPoints())
      })
    }*/
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
            const operators = module.getOperators({
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
    modifySelected(idSet, action) {
        helper_ts_1.modifySelected.call(this, idSet, action);
    }
    addSelected(idSet) {
        helper_ts_1.modifySelected.call(this, idSet, 'add');
    }
    deleteSelected(idSet) {
        helper_ts_1.modifySelected.call(this, idSet, 'delete');
    }
    toggleSelected(idSet) {
        helper_ts_1.modifySelected.call(this, idSet, 'toggle');
    }
    replaceSelected(idSet) {
        helper_ts_1.modifySelected.call(this, idSet, 'replace');
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
    get getSelectedPropsIfUnique() {
        if (this.selectedModules.size === 1) {
            const unique = [...this.selectedModules.values()][0];
            const module = this.moduleMap.get(unique);
            if (module) {
                return module.getDetails();
            }
            return null;
        }
        return null;
    }
    execute(type, data = null) {
        // @ts-ignore
        this.action.execute(type, data);
    }
    // viewport
    renderModules() {
        // console.log('renderModules')
        const animate = () => {
            const { frame, mainCTX: ctx } = this.viewport;
            frame.render(ctx);
            // deduplicateObjectsByKeyValue()
            // console.log(this.visibleModuleMap.size)
            // deduplicateObjectsByKeyValue
            this.visibleModuleMap.forEach((module) => {
                module.render(ctx);
            });
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
    exportToFiles() {
        const { dpr, scale, offset, frame } = this.viewport;
        const result = {
            id: this.id,
            config: {
                moduleIdCounter: this.moduleCounter,
                dpr,
                scale,
                offset,
                frame: frame.getDetails(),
            },
            data: [],
        };
        this.moduleMap.forEach((module) => {
            result.data.push(module.getDetails());
        });
        return result;
    }
    renderSelections() {
        // console.log('renderSelections')
        const animate = () => {
            selectionRender_ts_1.default.call(this);
        };
        requestAnimationFrame(animate);
    }
    updateWorldRect() {
        const { dpr } = this.viewport;
        const { width, height } = this.viewport.viewportRect;
        const p1 = this.getWorldPointByViewportPoint(0, 0);
        const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr);
        this.viewport.worldRect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)(p1, p2);
        // console.log('worldRect', this.viewport.worldRect)
    }
    zoom(zoom, point) {
        const { rect } = this.viewport;
        point = point || { x: rect.width / 2, y: rect.height / 2 };
        return helper_ts_2.zoomAtPoint.call(this, point, zoom);
    }
    updateScrollBar() {
        const { scrollBarX, scrollBarY } = this.viewport;
        (0, domManipulations_ts_1.updateScrollBars)(scrollBarX, scrollBarY);
    }
    updateViewport() {
        const { dpr, mainCanvas, selectionCanvas } = this.viewport;
        const rect = this.container.getBoundingClientRect().toJSON();
        const { x, y, width, height } = rect;
        const viewportWidth = width * dpr;
        const viewportHeight = height * dpr;
        this.viewport.rect = Object.assign(Object.assign({}, rect), { cx: x + width / 2, cy: y + height / 2 });
        this.viewport.viewportRect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)({ x: 0, y: 0 }, { x: viewportWidth, y: viewportHeight });
        mainCanvas.width = selectionCanvas.width = viewportWidth;
        mainCanvas.height = selectionCanvas.height = viewportHeight;
    }
    getWorldPointByViewportPoint(x, y) {
        const { dpr, offset, scale } = this.viewport;
        return (0, lib_ts_1.screenToWorld)({ x, y }, offset, scale, dpr);
    }
    getViewPointByWorldPoint(x, y) {
        const { dpr, offset, scale } = this.viewport;
        return (0, lib_ts_1.worldToScreen)({ x, y }, offset, scale, dpr);
    }
    //eslint-disable-block
    destroy() {
        destroyViewport_ts_1.destroyViewport.call(this);
        this.action.destroy();
        this.history.destroy();
        this.moduleMap.clear();
    }
}
exports.default = Editor;
