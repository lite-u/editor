"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepClone_1 = __importDefault(require("~/core/deepClone"));
const nid_1 = __importDefault(require("~/core/nid"));
const rectangle_1 = __importDefault(require("~/elements/rectangle/rectangle"));
const ellipse_1 = __importDefault(require("~/elements/ellipse/ellipse"));
const text_1 = __importDefault(require("~/elements/text/text"));
const image_1 = __importDefault(require("~/elements/image/image"));
const lineSegment_1 = __importDefault(require("~/elements/lines/lineSegment"));
const path_1 = __importDefault(require("~/elements/path/path"));
const lib_1 = require("~/lib/lib");
const utils_1 = require("~/core/utils");
const STYLE = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
};
class CanvasHost {
    constructor(editor, identifier) {
        this.elementMap = new Map();
        this.visible = new Map();
        this.eventsController = new AbortController();
        this.dpr = 4;
        this._hoveredElement = null;
        this._locked = false;
        this.editor = editor;
        const { signal } = this.eventsController;
        const { container } = editor;
        this.editor = editor;
        this.canvas = (0, lib_1.createWith)('canvas', Object.assign({}, STYLE));
        this._ctx = this.canvas.getContext('2d');
        this._locked = false;
        if (identifier) {
            this.canvas.setAttribute('role', identifier);
        }
        // this.canvas.style.imageRendering = 'pixelate'
        container.appendChild(this.canvas);
        container.addEventListener('pointerdown', e => {
            var _a;
            if (e.button === 0) {
                container.setPointerCapture(e.pointerId);
                this.dispatchEvent(e, 'mousedown');
                (_a = this.onmousedown) === null || _a === void 0 ? void 0 : _a.call(this, {
                    element: this._hoveredElement,
                    originalEvent: e,
                });
            }
        }, { signal, passive: false });
        container.addEventListener('pointerup', e => {
            var _a, _b;
            container.releasePointerCapture(e.pointerId);
            if (e.button === 0) {
                this.dispatchEvent(e, 'mouseup');
                (_a = this.onmouseup) === null || _a === void 0 ? void 0 : _a.call(this, {
                    element: this._hoveredElement,
                    originalEvent: e,
                });
            }
            if (e.button === 2) {
                this.dispatchEvent(e, 'contextmenu');
                (_b = this.oncontextmenu) === null || _b === void 0 ? void 0 : _b.call(this, {
                    element: this._hoveredElement,
                    originalEvent: e,
                });
            }
        }, { signal });
        container.addEventListener('pointermove', e => {
            var _a;
            this.dispatchEvent(e, 'mousemove');
            (_a = this.onmousemove) === null || _a === void 0 ? void 0 : _a.call(this, {
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
        var _a, _b, _c, _d;
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
                (_b = (_a = this._hoveredElement) === null || _a === void 0 ? void 0 : _a.dispatchEvent) === null || _b === void 0 ? void 0 : _b.call(_a, {
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
                (_c = _ele === null || _ele === void 0 ? void 0 : _ele.dispatchEvent) === null || _c === void 0 ? void 0 : _c.call(_ele, {
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
        (_d = _ele.dispatchEvent) === null || _d === void 0 ? void 0 : _d.call(_ele, event);
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
            return (0, utils_1.rectsOverlap)(boundingRect, this.editor.world.worldRect);
        })
            .sort((a, b) => a.layer - b.layer);
        sortedElements.forEach(element => {
            this.visible.set(element.id, element);
        });
    }
    get getMaxLayerIndex() {
        let max = Number.MIN_SAFE_INTEGER;
        this.elementMap.forEach((ele) => {
            max = Math.max(ele.layer, max);
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
            let id = (0, nid_1.default)();
            // ensure short id no repeat
            if (this.elementMap.has(id)) {
                id = (0, nid_1.default)();
            }
            data.id = id;
        }
        if (isNaN(data.layer)) {
            const maxLayer = this.getMaxLayerIndex;
            data.layer = maxLayer + 1;
        }
        if (data.type === 'rectangle') {
            return new rectangle_1.default(data);
        }
        if (data.type === 'ellipse') {
            return new ellipse_1.default(data);
        }
        if (data.type === 'text') {
            return new text_1.default(data);
        }
        if (data.type === 'image') {
            return new image_1.default(data);
        }
        if (data.type === 'lineSegment') {
            return new lineSegment_1.default(data);
        }
        if (data.type === 'path') {
            return new path_1.default(data);
        }
        return false;
    }
    replace(args) {
        args.forEach((arg) => {
            this.elementMap.set(arg.from.id, arg.to);
        });
    }
    batchCreate(elementDataList) {
        const clonedData = (0, deepClone_1.default)(elementDataList);
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
            let _a = mod.toMinimalJSON(), { id, layer } = _a, rest = __rest(_a, ["id", "layer"]);
            if (includeIdentifiers) {
                return Object.assign({ id, layer }, rest);
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
exports.default = CanvasHost;
