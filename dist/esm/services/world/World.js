import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
import { screenToWorld, worldToScreen } from '../../core/lib.js';
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
        this.mainCanvas = document.createElement('canvas');
        this.mainCanvasContext = this.mainCanvas.getContext('2d');
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvasContext = this.selectionCanvas.getContext('2d');
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.worldRect = generateBoundingRectFromTwoPoints(this.offset, this.offset);
        this.dpr = 2;
    }
    updateWorldRect() {
        const { width, height } = this.editor.viewportRect;
        const { dpr } = this;
        const p1 = this.getWorldPointByViewportPoint(0, 0);
        const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr);
        this.worldRect = generateBoundingRectFromTwoPoints(p1, p2);
        // console.log('worldRect', this.viewport.worldRect)
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
    getWorldPointByViewportPoint(x, y) {
        const { offset, scale } = this;
        const dpr = this.editor.dpr;
        return screenToWorld({ x, y }, offset, scale, dpr);
    }
    getViewPointByWorldPoint(x, y) {
        const { offset, scale } = this;
        const dpr = this.editor.dpr;
        return worldToScreen({ x, y }, offset, scale, dpr);
    }
    destroy() {
        this.mainCanvas.remove();
        this.selectionCanvas.remove();
        this.mainCanvas = null;
        this.selectionCanvas = null;
        this.mainCanvasContext = null;
        this.selectionCanvasContext = null;
    }
}
export default World;
