"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/core/utils");
const lib_1 = require("~/lib/lib");
const helper_1 = require("~/services/world/helper");
const overlayRender_1 = __importDefault(require("~/services/world/overlayRender"));
const STYLE = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
};
class World {
    constructor(editor) {
        this.editor = editor;
        // this.baseCanvas = createWith('canvas', 'main-canvas',  {...STYLE})
        // this.overlayCanvas = createWith('canvas', 'overlay-canvas',  {...STYLE})
        this.creationCanvas = (0, lib_1.createWith)('canvas', Object.assign({}, STYLE));
        this.creationCanvasContext = this.creationCanvas.getContext('2d');
        // this.baseCanvasContext = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D
        // this.overlayCanvasContext = this.overlayCanvas.getContext('2d') as CanvasRenderingContext2D
        // this.selectionBox = createWith('div', 'editor-selection-box', editor.id)
        // this.baseCanvas.setAttribute('id', 'main-canvas')
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.worldRect = (0, utils_1.generateBoundingRectFromTwoPoints)(this.offset, this.offset);
        this.dpr = editor.config.dpr;
        // this.selectionBox.style.pointerEvents = 'none'
        this.editor.container.append(/*this.baseCanvas, this.overlayCanvas, */ this.creationCanvas);
    }
    updateWorldRect() {
        const { width, height } = this.editor.viewportRect;
        const { dpr } = this;
        const p1 = this.getWorldPointByViewportPoint(0, 0);
        const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr);
        this.worldRect = (0, utils_1.generateBoundingRectFromTwoPoints)(p1, p2);
    }
    zoom(zoom, point) {
        const { rect } = this.editor;
        point = point || { x: rect.width / 2, y: rect.height / 2 };
        return helper_1.zoomAtPoint.call(this, point, zoom);
    }
    getWorldPointByViewportPoint(x, y) {
        const { offset, scale } = this;
        const dpr = this.dpr;
        return (0, lib_1.screenToWorld)({ x, y }, offset, scale, dpr);
    }
    getViewPointByWorldPoint(x, y) {
        const { offset, scale, dpr } = this;
        return (0, lib_1.worldToScreen)({ x, y }, offset, scale, dpr);
    }
    /* renderElements() {
       const animate = () => {
         const {scale, dpr, baseCanvasContext: ctx} = this
         const {width, height} = this.editor.config.page
         const frameBorder: RectangleProps = {
           id: nid() + '-frame',
           cx: width / 2,
           cy: height / 2,
           width,
           height,
           // borderRadius: [0, 10, 0, 10],
           stroke: {
             ...DEFAULT_STROKE,
             weight: 1 / scale * dpr,
           },
           layer: -1,
           opacity: 100,
         }
   
         const frameFill = {
           ...frameBorder, fill: {
             enabled: true,
             color: '#fff',
           },
         }
         // deduplicateObjectsByKeyValue()
         // console.log(this.visibleelementMap.size)
         // deduplicateObjectsByKeyValue
   
         new ElementRectangle(frameFill).render(ctx)
   
         this.editor.visible.values.forEach((element) => {
           element.render(ctx)
   
           /!*   if (element.type === 'image') {
                const {asset} = element as ElementImage
   
                const obj = this.editor.assetsManager.getAssetsObj(asset)
                // console.log(this.assetsManager, src)
                if (obj) {
                  (element as ElementImage).renderImage(ctx, obj.imageRef!)
                }
              }*!/
         })
   
   /!*      this.editor.interaction.transformHandles.forEach(handle => {
           handle.render(ctx)
         })*!/
   
         new ElementRectangle(frameBorder).render(ctx)
   
       }
   
       requestAnimationFrame(animate)
     }*/
    /*  renderTransformHandles() {
        const animate = () => {
          console.log(this.editor.interaction.transformHandles)
        }
    
        requestAnimationFrame(animate)
      }*/
    renderOverlay() {
        // console.log('renderOverlay')
        const animate = () => {
            overlayRender_1.default.call(this);
        };
        requestAnimationFrame(animate);
    }
    destroy() {
        // this.baseCanvas.remove()
        // this.overlayCanvas.remove()
        this.creationCanvas.remove();
        // this.baseCanvas = null!
        // this.overlayCanvas = null!
        this.creationCanvas = null;
        // this.baseCanvasContext = null!
        // this.overlayCanvasContext = null!
        this.creationCanvasContext = null;
    }
}
exports.default = World;
