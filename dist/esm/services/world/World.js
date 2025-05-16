import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
import { createWith, screenToWorld, worldToScreen } from '../../lib/lib.js';
import { zoomAtPoint } from './helper.js';
import overlayRender from './overlayRender.js';
import { DEFAULT_STROKE } from '../../elements/defaultProps.js';
const STYLE = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
};
class World {
    editor;
    baseCanvas;
    baseCanvasContext;
    overlayCanvas;
    overlayCanvasContext;
    creationCanvas;
    creationCanvasContext;
    scale;
    offset;
    worldRect;
    // drawCrossLineDefault: boolean = false
    // drawCrossLine: boolean = false
    dpr;
    constructor(editor) {
        this.editor = editor;
        this.baseCanvas = createWith('canvas', 'main-canvas', editor.id, { ...STYLE });
        this.overlayCanvas = createWith('canvas', 'overlay-canvas', editor.id, { ...STYLE });
        this.creationCanvas = createWith('canvas', 'creation-canvas', editor.id, { ...STYLE });
        this.baseCanvasContext = this.baseCanvas.getContext('2d');
        this.overlayCanvasContext = this.overlayCanvas.getContext('2d');
        this.creationCanvasContext = this.creationCanvas.getContext('2d');
        // this.selectionBox = createWith('div', 'editor-selection-box', editor.id)
        this.baseCanvas.setAttribute('id', 'main-canvas');
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.worldRect = generateBoundingRectFromTwoPoints(this.offset, this.offset);
        this.dpr = 2;
        // this.selectionBox.style.pointerEvents = 'none'
        this.editor.container.append(this.baseCanvas, this.overlayCanvas, this.creationCanvas);
    }
    updateWorldRect() {
        const { width, height } = this.editor.viewportRect;
        const { dpr } = this;
        const p1 = this.getWorldPointByViewportPoint(0, 0);
        const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr);
        this.worldRect = generateBoundingRectFromTwoPoints(p1, p2);
        // console.log('worldRect', this.viewport.worldRect)
    }
    zoom(zoom, point) {
        const { rect } = this.editor;
        point = point || { x: rect.width / 2, y: rect.height / 2 };
        return zoomAtPoint.call(this, point, zoom);
    }
    getWorldPointByViewportPoint(x, y) {
        const { offset, scale } = this;
        const dpr = this.dpr;
        return screenToWorld({ x, y }, offset, scale, dpr);
    }
    getViewPointByWorldPoint(x, y) {
        const { offset, scale, dpr } = this;
        return worldToScreen({ x, y }, offset, scale, dpr);
    }
    renderElements() {
        // console.log('renderElements')
        const animate = () => {
            const { scale, dpr, baseCanvasContext: ctx } = this;
            const frameBorder = {
                id: nid() + '-frame',
                cx: this.editor.config.page.width / 2,
                cy: this.editor.config.page.height / 2,
                width: this.editor.config.page.width,
                height: this.editor.config.page.height,
                // borderRadius: [10, 10, 10, 10],
                stroke: {
                    ...DEFAULT_STROKE,
                    weight: 1 / scale * dpr,
                },
                layer: -1,
                opacity: 100,
            };
            const frameFill = { ...frameBorder, fillColor: '#fff', enableLine: false };
            // deduplicateObjectsByKeyValue()
            // console.log(this.visibleelementMap.size)
            // deduplicateObjectsByKeyValue
            new ElementRectangle(frameFill).render(ctx);
            this.editor.visible.values.forEach((element) => {
                element.render(ctx);
                /*   if (element.type === 'image') {
                     const {asset} = element as ElementImage
        
                     const obj = this.editor.assetsManager.getAssetsObj(asset)
                     // console.log(this.assetsManager, src)
                     if (obj) {
                       (element as ElementImage).renderImage(ctx, obj.imageRef!)
                     }
                   }*/
            });
            new ElementRectangle(frameBorder).render(ctx);
        };
        requestAnimationFrame(animate);
    }
    renderOverlay() {
        // console.log('renderSelections')
        const animate = () => {
            overlayRender.call(this);
        };
        requestAnimationFrame(animate);
    }
    destroy() {
        this.baseCanvas.remove();
        this.overlayCanvas.remove();
        this.creationCanvas.remove();
        this.baseCanvas = null;
        this.overlayCanvas = null;
        this.creationCanvas = null;
        this.baseCanvasContext = null;
        this.overlayCanvasContext = null;
        this.creationCanvasContext = null;
    }
}
export default World;
