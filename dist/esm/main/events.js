import resetCanvas from '../services/world/resetCanvas.js';
import { redo } from '../services/history/redo.js';
import { undo } from '../services/history/undo.js';
import { pick } from '../services/history/pick.js';
// import {updateSelectionCanvasRenderData} from '../services/selection/helper'
// import zoom from '../../components/statusBar/zoom'
import { fitRectToViewport } from '../services/world/helper.js';
export function initEvents() {
    const { action } = this;
    const dispatch = action.dispatch.bind(action);
    const on = action.on.bind(action);
    // const {on, dispatch} = this.action
    // container.appendChild(viewport.wrapper)
    // this.toolMap.set('text', selector)
    // this.toolMap.set('ellipse', selector)
    on('world-resized', () => {
        this.updateViewport();
        if (!this.initialized) {
            this.initialized = true;
            // dispatch('switch-tool', 'selector')
            dispatch('world-zoom', 'fit');
            dispatch('element-updated');
            this.events.onInitialized?.();
            this.events.onHistoryUpdated?.(this.history);
            this.events.onElementsUpdated?.(this.elementManager.all);
        }
        else {
            dispatch('world-updated');
        }
    });
    on('world-updated', () => {
        this.world.updateWorldRect();
        // console.log(this.viewport.scale, this.viewport.offset, this.viewport.worldRect)
        this.events.onViewportUpdated?.({
            // width: this.viewport.viewportRect.width,
            // height: this.viewport.viewportRect.height,
            scale: this.world.scale,
            offsetX: this.world.offset.x,
            offsetY: this.world.offset.y,
            // status: this.manipulationStatus,
        });
        dispatch('visible-element-updated');
    });
    on('world-zoom', (arg) => {
        if (arg === 'fit') {
            const { width, height } = this.config.page;
            const { viewportRect } = this;
            const pageRect = {
                x: 0,
                y: 0,
                width,
                height,
            };
            const { scale, offsetX, offsetY } = fitRectToViewport(pageRect, viewportRect, 0.02);
            this.world.scale = scale;
            this.world.offset.x = offsetX;
            this.world.offset.y = offsetY;
            dispatch('world-updated');
        }
        else {
            const { scale, dpr } = this.world;
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
            result = this.world.zoom(newScale, point);
            // return
            // console.log(newScale)
            this.world.scale = newScale;
            this.world.offset.x = result.x;
            this.world.offset.y = result.y;
            dispatch('world-updated');
        }
    });
    on('world-shift', (data) => {
        const { x, y } = data;
        // console.log(x, y)
        const { dpr } = this.world;
        this.world.offset.x += x * dpr;
        this.world.offset.y += y * dpr;
        dispatch('world-updated');
    });
    on('visible-element-updated', () => {
        this.visible.updateVisibleElementMap();
        // this.updateSnapPoints()
        dispatch('render-elements');
        dispatch('visible-selection-updated');
    });
    on('visible-selection-updated', () => {
        this.visible.updateVisibleSelected();
        dispatch('render-selection');
    });
    on('selection-all', () => {
        this.selection.selectAll();
        dispatch('selection-updated');
    });
    on('selection-clear', () => {
        this.selection.clear();
        dispatch('selection-updated');
    });
    on('selection-modify', (data) => {
        const { mode, idSet } = data;
        this.selection.modify(idSet, mode);
        dispatch('selection-updated');
    });
    on('element-updated', (historyData) => {
        dispatch('visible-element-updated');
        dispatch('selection-updated');
        if (historyData) {
            this.history.add(historyData);
            this.events.onHistoryUpdated?.(this.history);
        }
        this.events.onElementsUpdated?.(this.elementManager.all);
    });
    on('selection-updated', () => {
        this.interaction.hoveredElement = null;
        // console.log(this.selectedElements)
        // updateSelectionCanvasRenderData.call(this)
        this.events.onSelectionUpdated?.(this.selection.values, this.selection.pickIfUnique);
        dispatch('visible-selection-updated');
    });
    on('world-mouse-move', () => {
        const p = this.world.getWorldPointByViewportPoint(this.interaction.mouseMovePoint.x, this.interaction.mouseMovePoint.y);
        this.events.onWorldMouseMove?.(p);
    });
    on('drop-image', ({ position, assets }) => {
        // console.log(data)
        const ox = position.x - this.rect.x;
        const oy = position.y - this.rect.y;
        const worldPoint = this.world.getWorldPointByViewportPoint(ox, oy);
        const elementPropsList = assets.map(asset => {
            const { width, height } = asset.imageRef;
            this.assetsManager.add(asset);
            return {
                type: 'image',
                enableLine: false,
                src: asset.id,
                x: worldPoint.x,
                y: worldPoint.y,
                width,
                height,
            };
        });
        dispatch('element-add', elementPropsList);
    });
    on('element-delete', () => {
        const savedSelected = this.selection.values;
        const backup = this.elementManager.batchDelete(savedSelected);
        this.selection.clear();
        dispatch('element-updated', {
            type: 'history-delete',
            payload: {
                elements: backup,
                selectedElements: savedSelected,
            },
        });
    });
    on('element-copy', () => {
        this.clipboard.copiedItems = this.elementManager.batchCopy(this.selection.values, false);
        this.clipboard.updateCopiedItemsDelta();
        this.events.onElementCopied?.(this.clipboard.copiedItems);
    });
    on('element-paste', (position) => {
        if (this.clipboard.copiedItems.length === 0)
            return;
        let newElements;
        if (position) {
            const { x, y } = this.world.getWorldPointByViewportPoint(position.x, position.y);
            const topLeftItem = this.clipboard.copiedItems.reduce((prev, current) => {
                return (current.x < prev.x && current.y < prev.y) ? current : prev;
            });
            const offsetX = x - topLeftItem.x;
            const offsetY = y - topLeftItem.y;
            const offsetItems = this.clipboard.copiedItems.map((item) => {
                return {
                    ...item,
                    x: item.x + offsetX,
                    y: item.y + offsetY,
                };
            });
            newElements = this.elementManager.batchCreate(offsetItems);
        }
        else {
            newElements = this.elementManager.batchCreate(this.clipboard.copiedItems);
        }
        const savedSelected = new Set(newElements.keys());
        this.elementManager.batchAdd(newElements);
        this.selection.replace(savedSelected);
        this.clipboard.updateCopiedItemsDelta();
        dispatch('element-updated', {
            type: 'history-paste',
            payload: {
                elements: [...newElements.values()].map((mod) => mod.toMinimalJSON()),
                selectedElements: savedSelected,
            },
        });
    });
    on('element-duplicate', () => {
        if (this.selection.size === 0)
            return;
        const temp = this.elementManager.batchCopy(this.selection.values, false);
        temp.forEach((copiedItem) => {
            copiedItem.x += this.clipboard.CopyDeltaX;
            copiedItem.y += this.clipboard.CopyDeltaY;
        });
        const newElements = this.elementManager.batchCreate(temp);
        const savedSelected = new Set(newElements.keys());
        this.elementManager.batchAdd(newElements);
        this.selection.replace(savedSelected);
        const elementProps = [...newElements.values()].map((mod) => mod.toMinimalJSON());
        dispatch('element-updated', {
            type: 'history-duplicate',
            payload: {
                elements: elementProps,
                selectedElements: savedSelected,
            },
        });
    });
    on('element-layer', (data) => {
        console.log(data);
        /* const s = this.selection.getSelected
    
         if (s.size === 0) return
         const changes: ElementModifyData[] = []
    
         s.forEach((id) => {
           const element = this.elementManager.all.get(id)
           if (element) {
             changes.push({
               id,
               props: {
                 x: element.x + delta.x,
                 y: element.y + delta.y,
               },
             })
           }
         })*/
        // this.batchMove(s, delta)
        // dispatch('element-modify', changes)
    });
    on('element-move', ({ delta = { x: 0, y: 0 } }) => {
        const s = this.selection.values;
        if (s.size === 0)
            return;
        const changes = [];
        s.forEach((id) => {
            const ele = this.elementManager.all.get(id);
            if (ele) {
                changes.push({
                    id,
                    props: {
                        x: ele.cx + delta.x,
                        y: ele.cy + delta.y,
                    },
                });
            }
        });
        // this.batchMove(s, delta)
        dispatch('element-modify', changes);
    });
    on('element-add', (data) => {
        if (!data || data.length === 0)
            return;
        const newElements = this.elementManager.batchAdd(this.elementManager.batchCreate(data), () => {
            // console.log(9)
            dispatch('render-elements');
        });
        const savedSelected = new Set(newElements.keys());
        /*  this.elementManager.batchAdd(newElements,()=>{
            dispatch('render-elements')
          })*/
        this.selection.replace(savedSelected);
        const elementProps = [...newElements.values()].map((mod) => mod.toMinimalJSON());
        dispatch('element-updated', {
            type: 'history-add',
            payload: {
                elements: elementProps,
                selectedElements: savedSelected,
            },
        });
    });
    on('element-modifying', ({ type, data }) => {
        const s = this.selection.values;
        if (s.size === 0)
            return;
        if (type === 'move') {
            this.elementManager.batchMove(s, data);
        }
        else if (type === 'resize' || type === 'rotate') {
            this.elementManager.batchModify(s, data);
        }
        dispatch('element-updated');
    });
    on('element-modify', (data) => {
        const changes = [];
        // console.log(data)
        data.map(({ id, props: kv }) => {
            const props = {};
            const change = { id, props };
            const element = this.elementManager.getElementById(id);
            if (!element)
                return;
            const keys = Object.keys(kv);
            keys.map((propName) => {
                const fromValue = element[propName];
                const toValue = kv[propName];
                props[propName] = {
                    from: fromValue,
                    to: toValue,
                };
            });
            this.elementManager.batchModify(new Set([id]), kv);
            changes.push(change);
        });
        this.history.add({
            type: 'history-modify',
            payload: {
                selectedElements: this.selection.values,
                changes,
            },
        });
        this.events.onHistoryUpdated?.(this.history);
        this.events.onElementsUpdated?.(this.elementManager.all);
        dispatch('element-updated');
    });
    on('render-elements', () => {
        resetCanvas(this.world.mainCanvasContext, this.world.scale, this.world.offset, this.world.dpr);
        this.world.renderElements();
    });
    on('render-selection', () => {
        resetCanvas(this.world.selectionCanvasContext, this.world.scale, this.world.offset, this.world.dpr);
        this.world.renderSelections();
    });
    on('element-hover-enter', (id) => {
        if (this.interaction.hoveredElement && id && this.interaction.hoveredElement === id) {
            return;
        }
        // console.log(this.hoveredElement, id)
        this.interaction.hoveredElement = id;
        dispatch('visible-selection-updated');
    });
    on('element-hover-leave', () => {
        this.interaction.hoveredElement = null;
        dispatch('visible-selection-updated');
    });
    on('history-undo', () => {
        undo.call(this);
        dispatch('element-updated');
        this.events.onHistoryUpdated?.(this.history);
    });
    on('history-redo', () => {
        redo.call(this);
        dispatch('element-updated');
        this.events.onHistoryUpdated?.(this.history);
    });
    on('history-pick', (data) => {
        pick.call(this, data);
        dispatch('element-updated');
        this.events.onHistoryUpdated?.(this.history);
    });
    on('context-menu', ({ position }) => {
        this.events.onContextMenu?.(position);
    });
    on('switch-tool', (toolName) => {
        this.toolManager.set(toolName);
        // this.toolManager.currentToolName = toolName
        this.events.onSwitchTool?.(toolName);
    });
}
