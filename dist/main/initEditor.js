"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEditor = initEditor;
const resetCanvas_tsx_1 = __importDefault(require("./viewport/resetCanvas.tsx"));
const redo_ts_1 = require("./history/redo.ts");
const undo_ts_1 = require("./history/undo.ts");
const pick_ts_1 = require("./history/pick.ts");
const helper_ts_1 = require("./selection/helper.ts");
const helper_ts_2 = require("./viewport/helper.ts");
function initEditor() {
    const { container, viewport, action } = this;
    const dispatch = action.dispatch.bind(action);
    const on = action.on.bind(action);
    container.appendChild(viewport.wrapper);
    viewport.resizeObserver.observe(container);
    on('world-resized', () => {
        var _a, _b, _c, _d, _e, _f;
        this.updateViewport();
        if (!this.initialized) {
            this.initialized = true;
            dispatch('world-zoom', 'fit');
            dispatch('module-updated');
            (_b = (_a = this.events).onInitialized) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.events).onHistoryUpdated) === null || _d === void 0 ? void 0 : _d.call(_c, this.history);
            (_f = (_e = this.events).onModulesUpdated) === null || _f === void 0 ? void 0 : _f.call(_e, this.moduleMap);
        }
        else {
            dispatch('world-updated');
        }
    });
    on('world-updated', () => {
        var _a, _b;
        this.updateWorldRect();
        // console.log(this.viewport.scale, this.viewport.offset, this.viewport.worldRect)
        (_b = (_a = this.events).onViewportUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, {
            width: this.viewport.viewportRect.width,
            height: this.viewport.viewportRect.height,
            scale: this.viewport.scale,
            offsetX: this.viewport.offset.x,
            offsetY: this.viewport.offset.y,
            status: this.manipulationStatus,
        });
        dispatch('visible-module-updated');
    });
    on('world-zoom', (arg) => {
        if (arg === 'fit') {
            const { frame, viewportRect } = this.viewport;
            const frameRect = frame.getBoundingRect();
            const { scale, offsetX, offsetY } = (0, helper_ts_2.fitRectToViewport)(frameRect, viewportRect, 0.02);
            this.viewport.scale = scale;
            this.viewport.offset.x = offsetX;
            this.viewport.offset.y = offsetY;
            dispatch('world-updated');
        }
        else {
            const { scale, dpr } = this.viewport;
            let result = null;
            let newScale = 1;
            const minScale = 0.01 * dpr;
            const maxScale = 500 * dpr;
            let point = arg.physicalPoint;
            if (arg.zoomTo) {
                newScale = arg.zoomFactor;
            }
            else if (arg.zoomBy) {
                newScale = scale + arg.zoomFactor;
            }
            // clamp
            newScale = Math.max(minScale, Math.min(newScale, maxScale));
            result = this.zoom(newScale, point);
            // return
            // console.log(newScale)
            this.viewport.scale = newScale;
            this.viewport.offset.x = result.x;
            this.viewport.offset.y = result.y;
            dispatch('world-updated');
        }
    });
    on('world-shift', (data) => {
        const { x, y } = data;
        // console.log(x, y)
        const { dpr } = this.viewport;
        this.viewport.offset.x += x * dpr;
        this.viewport.offset.y += y * dpr;
        dispatch('world-updated');
    });
    on('visible-module-updated', () => {
        this.updateVisibleModuleMap();
        // this.updateSnapPoints()
        dispatch('render-modules');
        dispatch('visible-selection-updated');
    });
    on('visible-selection-updated', () => {
        this.updateVisibleSelected();
        dispatch('render-selection');
    });
    on('selection-all', () => {
        this.selectAll();
        dispatch('selection-updated');
    });
    on('selection-clear', () => {
        this.selectedModules.clear();
        dispatch('selection-updated');
    });
    on('selection-modify', (data) => {
        const { mode, idSet } = data;
        this.modifySelected(idSet, mode);
        dispatch('selection-updated');
    });
    on('module-updated', (historyData) => {
        var _a, _b;
        dispatch('visible-module-updated');
        dispatch('selection-updated');
        if (historyData) {
            this.history.add(historyData);
            (_b = (_a = this.events).onHistoryUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, this.history);
        }
    });
    on('selection-updated', () => {
        var _a, _b;
        this.hoveredModule = null;
        // console.log(this.selectedModules)
        helper_ts_1.updateSelectionCanvasRenderData.call(this);
        (_b = (_a = this.events).onSelectionUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, this.selectedModules, this.getSelectedPropsIfUnique);
        dispatch('visible-selection-updated');
    });
    on('world-mouse-move', () => {
        var _a, _b;
        const p = this.getWorldPointByViewportPoint(this.viewport.mouseMovePoint.x, this.viewport.mouseMovePoint.y);
        (_b = (_a = this.events).onWorldMouseMove) === null || _b === void 0 ? void 0 : _b.call(_a, p);
    });
    on('module-delete', () => {
        const savedSelected = this.getSelected;
        const backup = this.batchDelete(savedSelected);
        this.selectedModules.clear();
        dispatch('module-updated', {
            type: 'history-delete',
            payload: {
                modules: backup,
                selectedModules: savedSelected,
            },
        });
    });
    on('module-copy', () => {
        var _a, _b;
        this.copiedItems = this.batchCopy(this.getSelected, false);
        this.updateCopiedItemsDelta();
        (_b = (_a = this.events).onModuleCopied) === null || _b === void 0 ? void 0 : _b.call(_a, this.copiedItems);
    });
    on('module-paste', (position) => {
        if (this.copiedItems.length === 0)
            return;
        let newModules;
        if (position) {
            const { x, y } = this.getWorldPointByViewportPoint(position.x, position.y);
            const topLeftItem = this.copiedItems.reduce((prev, current) => {
                return (current.x < prev.x && current.y < prev.y) ? current : prev;
            });
            const offsetX = x - topLeftItem.x;
            const offsetY = y - topLeftItem.y;
            const offsetItems = this.copiedItems.map((item) => {
                return Object.assign(Object.assign({}, item), { x: item.x + offsetX, y: item.y + offsetY });
            });
            newModules = this.batchCreate(offsetItems);
        }
        else {
            newModules = this.batchCreate(this.copiedItems);
        }
        const savedSelected = new Set(newModules.keys());
        this.batchAdd(newModules);
        this.replaceSelected(savedSelected);
        this.updateCopiedItemsDelta();
        dispatch('module-updated', {
            type: 'history-paste',
            payload: {
                modules: [...newModules.values()].map((mod) => mod.getDetails()),
                selectedModules: savedSelected,
            },
        });
    });
    on('module-duplicate', () => {
        if (this.selectedModules.size === 0)
            return;
        const temp = this.batchCopy(this.selectedModules, false);
        temp.forEach((copiedItem) => {
            copiedItem.x += this.CopyDeltaX;
            copiedItem.y += this.CopyDeltaY;
        });
        const newModules = this.batchCreate(temp);
        const savedSelected = new Set(newModules.keys());
        this.batchAdd(newModules);
        this.replaceSelected(savedSelected);
        const moduleProps = [...newModules.values()].map((mod) => mod.getDetails());
        dispatch('module-updated', {
            type: 'history-duplicate',
            payload: {
                modules: moduleProps,
                selectedModules: savedSelected,
            },
        });
    });
    on('module-layer', (data) => {
        console.log(data);
        /* const s = this.getSelected
    
         if (s.size === 0) return
         const changes: ModuleModifyData[] = []
    
         s.forEach((id) => {
           const module = this.moduleMap.get(id)
           if (module) {
             changes.push({
               id,
               props: {
                 x: module.x + delta.x,
                 y: module.y + delta.y,
               },
             })
           }
         })*/
        // this.batchMove(s, delta)
        // dispatch('module-modify', changes)
    });
    on('module-move', ({ delta = { x: 0, y: 0 } }) => {
        const s = this.getSelected;
        if (s.size === 0)
            return;
        const changes = [];
        s.forEach((id) => {
            const module = this.moduleMap.get(id);
            if (module) {
                changes.push({
                    id,
                    props: {
                        x: module.x + delta.x,
                        y: module.y + delta.y,
                    },
                });
            }
        });
        // this.batchMove(s, delta)
        dispatch('module-modify', changes);
    });
    on('module-add', (data) => {
        const newModules = this.batchAdd(this.batchCreate(data));
        const savedSelected = new Set(newModules.keys());
        this.batchAdd(newModules);
        this.replaceSelected(savedSelected);
        const moduleProps = [...newModules.values()].map((mod) => mod.getDetails());
        dispatch('module-updated', {
            type: 'history-add',
            payload: {
                modules: moduleProps,
                selectedModules: savedSelected,
            },
        });
    });
    on('module-modifying', ({ type, data }) => {
        const s = this.getSelected;
        if (s.size === 0)
            return;
        if (type === 'move') {
            this.batchMove(s, data);
        }
        else if (type === 'resize' || type === 'rotate') {
            this.batchModify(s, data);
        }
        dispatch('module-updated');
    });
    on('module-modify', (data) => {
        var _a, _b, _c, _d;
        const changes = [];
        // console.log(data)
        data.map(({ id, props: kv }) => {
            const props = {};
            const change = { id, props };
            const module = this.moduleMap.get(id);
            if (!module)
                return;
            Object.keys(kv).map((keyName) => {
                const fromValue = module[keyName];
                const toValue = kv[keyName];
                // console.log(fromValue, toValue)
                return props[keyName] = {
                    from: fromValue,
                    to: toValue,
                };
            });
            this.batchModify(new Set([id]), kv);
            changes.push(change);
        });
        this.history.add({
            type: 'history-modify',
            payload: {
                selectedModules: this.getSelected,
                changes,
            },
        });
        (_b = (_a = this.events).onHistoryUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, this.history);
        (_d = (_c = this.events).onModulesUpdated) === null || _d === void 0 ? void 0 : _d.call(_c, this.moduleMap);
        dispatch('module-updated');
    });
    on('render-modules', () => {
        (0, resetCanvas_tsx_1.default)(this.viewport.mainCTX, this.viewport.scale, this.viewport.offset);
        this.renderModules();
    });
    on('render-selection', () => {
        (0, resetCanvas_tsx_1.default)(this.viewport.selectionCTX, this.viewport.scale, this.viewport.offset);
        this.renderSelections();
    });
    on('module-hover-enter', (id) => {
        if (this.hoveredModule && id && this.hoveredModule === id) {
            return;
        }
        // console.log(this.hoveredModule, id)
        this.hoveredModule = id;
        dispatch('visible-selection-updated');
    });
    on('module-hover-leave', () => {
        this.hoveredModule = null;
        dispatch('visible-selection-updated');
    });
    on('history-undo', () => {
        var _a, _b;
        undo_ts_1.undo.call(this);
        dispatch('module-updated');
        (_b = (_a = this.events).onHistoryUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, this.history);
    });
    on('history-redo', () => {
        var _a, _b;
        redo_ts_1.redo.call(this);
        dispatch('module-updated');
        (_b = (_a = this.events).onHistoryUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, this.history);
    });
    on('history-pick', (data) => {
        var _a, _b;
        pick_ts_1.pick.call(this, data);
        dispatch('module-updated');
        (_b = (_a = this.events).onHistoryUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, this.history);
    });
    on('context-menu', ({ position }) => {
        var _a, _b;
        (_b = (_a = this.events).onContextMenu) === null || _b === void 0 ? void 0 : _b.call(_a, position);
    });
}
