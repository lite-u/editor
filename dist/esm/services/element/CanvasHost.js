import deepClone from '../../core/deepClone.js';
import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
import ElementEllipse from '../../elements/ellipse/ellipse.js';
import ElementText from '../../elements/text/text.js';
import ElementImage from '../../elements/image/image.js';
import ElementLineSegment from '../../elements/lines/lineSegment.js';
import ElementPath from '../../elements/path/path.js';
import { createWith } from '../../lib/lib.js';
import { rectsOverlap } from '../../core/utils.js';
const STYLE = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
};
class CanvasHost {
    elementMap = new Map();
    visible = new Map();
    editor;
    eventsController = new AbortController();
    canvas;
    _ctx;
    dpr = 4;
    _hoveredElement = null;
    _locked = false;
    onmousedown;
    onmouseup;
    onmousemove;
    oncontextmenu;
    constructor(editor, identifier) {
        this.editor = editor;
        const { signal } = this.eventsController;
        const { container } = editor;
        this.editor = editor;
        this.canvas = createWith('canvas', { ...STYLE });
        this._ctx = this.canvas.getContext('2d');
        this._locked = false;
        if (identifier) {
            this.canvas.setAttribute('role', identifier);
        }
        // this.canvas.style.imageRendering = 'pixelate'
        container.appendChild(this.canvas);
        container.addEventListener('pointerdown', e => {
            if (e.button === 0) {
                container.setPointerCapture(e.pointerId);
                this.dispatchEvent(e, 'mousedown');
                this.onmousedown?.({
                    element: this._hoveredElement,
                    originalEvent: e,
                });
            }
        }, { signal, passive: false });
        container.addEventListener('pointerup', e => {
            container.releasePointerCapture(e.pointerId);
            if (e.button === 0) {
                this.dispatchEvent(e, 'mouseup');
                this.onmouseup?.({
                    element: this._hoveredElement,
                    originalEvent: e,
                });
            }
            if (e.button === 2) {
                this.dispatchEvent(e, 'contextmenu');
                this.oncontextmenu?.({
                    element: this._hoveredElement,
                    originalEvent: e,
                });
            }
        }, { signal });
        container.addEventListener('pointermove', e => {
            this.dispatchEvent(e, 'mousemove');
            this.onmousemove?.({
                element: this._hoveredElement,
                originalEvent: e,
            });
        }, { signal });
        container.addEventListener('contextmenu', e => {
            e.preventDefault();
            e.stopPropagation();
        }, { signal });
    }
    lock() { this._locked = true; }
    unlock() { this._locked = false; }
    dispatchEvent(domEvent, type, options) {
        const { _ctx } = this;
        const dpr = this.editor.config.dpr;
        const { offsetX: x, offsetY: y, pointerId } = domEvent;
        const elements = this.visibleElements.sort((a, b) => b.layer - a.layer);
        const vx = x * dpr;
        const vy = y * dpr;
        let _ele = null;
        for (const el of elements) {
            const { path2D, fill } = el;
            let f1 = false;
            let f2 = false;
            if (el.stroke.enabled) {
                _ctx.save();
                // console.log(el.stroke.weight)
                _ctx.lineWidth = el.stroke.weight;
                f1 = _ctx.isPointInStroke(path2D, vx, vy);
                _ctx.restore();
            }
            f2 = _ctx.isPointInPath(path2D, vx, vy);
            if (f1 || (f2 && fill.enabled)) {
                _ele = el;
                break;
            }
        }
        if (type === 'mousemove') {
            if (_ele !== this._hoveredElement) {
                // mouseleave for old
                this._hoveredElement?.dispatchEvent?.({
                    type: 'mouseleave',
                    x,
                    y,
                    pointerId,
                    target: this._hoveredElement,
                    originalEvent: domEvent,
                    isPropagationStopped: false,
                    stopPropagation() { },
                });
                // mouseenter for new
                _ele?.dispatchEvent?.({
                    type: 'mouseenter',
                    x,
                    y,
                    pointerId,
                    target: _ele,
                    originalEvent: domEvent,
                    isPropagationStopped: false,
                    stopPropagation() { },
                });
                this._hoveredElement = _ele;
            }
        }
        if (!_ele)
            return;
        const event = {
            type,
            x,
            y,
            pointerId,
            originalEvent: domEvent,
            target: _ele,
            isPropagationStopped: false,
            stopPropagation() {
                event.isPropagationStopped = true;
            },
        };
        // console.log(type, this._hoveredElement)
        _ele.dispatchEvent?.(event);
    }
    has(id) {
        return this.elementMap.has(id);
    }
    get ctx() {
        return this._ctx;
    }
    get size() {
        return this.elementMap.size;
    }
    get allIds() {
        const set = new Set();
        this.elementMap.forEach((element) => {
            set.add(element.id);
        });
        return set;
    }
    get elements() {
        return [...this.elementMap.values()];
    }
    get all() {
        return new Map(this.elementMap);
    }
    get visibleElements() {
        return [...this.visible.values()];
    }
    updateVisible() {
        this.visible.clear();
        // let _start = Date.now()
        // Create an array from the Map, sort by the 'layer' property,
        const sortedElements = this.elements
            .filter((element) => {
            const boundingRect = element.boundingRect;
            return rectsOverlap(boundingRect, this.editor.world.worldRect);
        })
            .sort((a, b) => a.layer - b.layer);
        sortedElements.forEach(element => {
            this.visible.set(element.id, element);
        });
    }
    get getMaxLayerIndex() {
        let max = 0;
        this.elementMap.forEach((mod) => {
            // console.log(mod.layer)
            if (mod.layer > max) {
                max = mod.layer;
            }
        });
        return max;
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    getElementById(id) {
        return this.elementMap.get(id);
    }
    getElementsByIdSet(idSet) {
        const result = [];
        [...idSet.values()].map(id => {
            const mod = this.elementMap.get(id);
            if (mod) {
                result.push(mod);
            }
        });
        return result;
    }
    getVisibleElementsByIdSet(idSet) {
        const result = [];
        idSet.forEach(id => {
            const mod = this.visible.get(id);
            if (mod) {
                result.push(mod);
            }
        });
        return result;
    }
    getElementMapByIdSet(idSet) {
        const result = new Map();
        idSet.forEach((id) => {
            const mod = this.elementMap.get(id);
            if (mod) {
                result.set(id, mod);
            }
        });
        return result;
    }
    create(data) {
        if (!data || !data.type) {
            console.error('Data or Type missed');
            return false;
        }
        if (!data.id) {
            let id = data.type + '-' + nid();
            // ensure short id no repeat
            if (this.elementMap.has(id)) {
                id = nid();
            }
            data.id = id;
        }
        if (isNaN(data.layer)) {
            const maxLayer = this.getMaxLayerIndex;
            data.layer = maxLayer + 1;
        }
        if (data.type === 'rectangle') {
            return new ElementRectangle(data);
        }
        if (data.type === 'ellipse') {
            return new ElementEllipse(data);
        }
        if (data.type === 'text') {
            return new ElementText(data);
        }
        if (data.type === 'image') {
            return new ElementImage(data);
        }
        if (data.type === 'lineSegment') {
            return new ElementLineSegment(data);
        }
        if (data.type === 'path') {
            return new ElementPath(data);
        }
        return false;
    }
    batchCreate(elementDataList) {
        const clonedData = deepClone(elementDataList);
        const newMap = new Map();
        // let localMaxLayer = 0
        /*    if (isNaN(data.layer)) {
              const maxFromelementMap = this.getMaxLayerIndex
    
              localMaxLayer = Math.max(localMaxLayer, maxFromelementMap)
              localMaxLayer++
    
              data.layer = localMaxLayer
            }*/
        clonedData.forEach(data => {
            const element = this.create(data);
            if (element) {
                newMap.set(data.id, element);
            }
        });
        return newMap;
    }
    append(...args) {
        args.forEach(el => {
            this.elementMap.set(el.id, el);
        });
    }
    batchAdd(elements, callback) {
        elements.forEach(mod => {
            this.append(mod);
        });
        callback && callback();
        //       this.assetsManager.add('image', data.src)
        // this.events.onElementsUpdated?.(this.elementMap)
        /* if (callback) {
           const pArr = []
           elements.forEach(mod => {
             if (mod.type === 'image') {
               const {src} = mod as ElementImage
    
               if (src && !this.assetsManager.getAssetsObj(src)) {
                 // @ts-ignore
                 pArr.push(this.assetsManager.add('image', src))
               }
             }
           })
    
           // @ts-ignore
           Promise.all(pArr).then((objs: VisionEditorAssetType[]) => objs).finally((objs) => {
             callback(objs)
           })
         }*/
        return elements;
    }
    batchCopy(idSet, includeIdentifiers = true) {
        // const elementsMap: ElementMap = new Map()
        const elementArr = [];
        idSet.forEach(id => {
            const mod = this.elementMap.get(id);
            if (mod) {
                elementArr.push(mod);
                // elementsMap.set(id, mod)
            }
        });
        elementArr.sort((a, b) => a.layer - b.layer);
        return elementArr.map(mod => {
            let { id, layer, ...rest } = mod.toMinimalJSON();
            if (includeIdentifiers) {
                return { id, layer, ...rest };
            }
            return rest;
        });
    }
    batchDelete(idSet) {
        const backup = this.batchCopy(idSet);
        backup.forEach(element => {
            this.elementMap.delete(element.id);
        });
        // this.events.onElementsUpdated?.(this.elementMap)
        return backup;
    }
    batchMove(from, delta) {
        const elementsMap = this.getElementMapByIdSet(from);
        elementsMap.forEach((element) => {
            element.cx += delta.x;
            element.cy += delta.y;
        });
    }
    batchModify(idSet, data) {
        const elementsMap = this.getElementMapByIdSet(idSet);
        elementsMap.forEach((element) => {
            Object.keys(data).forEach((key) => {
                const keyName = key;
                // @ts-ignore
                element[keyName] = data[key];
            });
        });
    }
    render() {
        this.visibleElements.forEach((element) => {
            element.render(this._ctx);
        });
    }
    reset() {
        // console.log('de')
        this.elementMap.clear();
        this.visible.clear();
        this._hoveredElement = null;
    }
    destroy() {
        // cancelAnimationFrame(this._rqId)
        /*this._timer = requestAnimationFrame(() => {
          this.render()
        })*/
        this.canvas.remove();
        this.elementMap.clear();
        this.visible.clear();
        this.eventsController.abort();
        this.canvas = null;
        this.elementMap = null;
        this.visible = null;
        this.eventsController = null;
    }
}
export default CanvasHost;
