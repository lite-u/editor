import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
import { createWith, screenToWorld, worldToScreen } from '../../lib/lib.js';
import { zoomAtPoint } from './helper.js';
import selectionRender from './selectionRender.js';
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
    mainCanvas;
    mainCanvasContext;
    selectionCanvas;
    selectionCanvasContext;
    scale;
    offset;
    worldRect;
    // drawCrossLineDefault: boolean = false
    // drawCrossLine: boolean = false
    dpr;
    constructor(editor) {
        this.editor = editor;
        this.mainCanvas = createWith('canvas', 'main-canvas', editor.id, { ...STYLE });
        this.selectionCanvas = createWith('canvas', 'selection-canvas', editor.id, { ...STYLE });
        this.mainCanvasContext = this.mainCanvas.getContext('2d');
        this.selectionCanvasContext = this.selectionCanvas.getContext('2d');
        // this.selectionBox = createWith('div', 'editor-selection-box', editor.id)
        this.mainCanvas.setAttribute('id', 'main-canvas');
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.worldRect = generateBoundingRectFromTwoPoints(this.offset, this.offset);
        this.dpr = 2;
        // this.selectionBox.style.pointerEvents = 'none'
        this.editor.container.append(this.mainCanvas, this.selectionCanvas);
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
    renderModules() {
        // console.log('renderModules')
        const animate = () => {
            const { scale, dpr, mainCanvasContext: ctx } = this;
            const frameBorder = {
                id: nid() + '-frame',
                x: this.editor.config.page.width / 2,
                y: this.editor.config.page.height / 2,
                width: this.editor.config.page.width,
                height: this.editor.config.page.height,
                fillColor: 'transparent',
                fill: {
                    enabled: true,
                    color: 'transparent',
                    type: 'solid',
                },
                stroke: {
                    color: '#000',
                    weight: 1 / scale * dpr,
                    cap: 'butt',
                    join: 'miter',
                    dashed: false,
                },
                // enableLine: true,
                // lineWidth: 1 / scale * dpr,
                // lineColor: '#000',
                layer: -1,
                opacity: 100,
            };
            const frameFill = { ...frameBorder, fillColor: '#fff', enableLine: false };
            // deduplicateObjectsByKeyValue()
            // console.log(this.visibleelementMap.size)
            // deduplicateObjectsByKeyValue
            new ElementRectangle(frameFill).render(ctx);
            this.editor.visible.values.forEach((module) => {
                module.render(ctx);
                if (module.type === 'image') {
                    const { asset } = module;
                    const obj = this.editor.assetsManager.getAssetsObj(asset);
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
    renderSelections() {
        // console.log('renderSelections')
        const animate = () => {
            selectionRender.call(this);
        };
        requestAnimationFrame(animate);
    }
    destroy() {
        console.log('destroy');
        this.mainCanvas.remove();
        this.selectionCanvas.remove();
        this.mainCanvas = null;
        this.selectionCanvas = null;
        this.mainCanvasContext = null;
        this.selectionCanvasContext = null;
    }
}
export default World;
