import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
class MapView {
    editor;
    mainCanvas;
    mainCanvasContext;
    selectionCanvas;
    selectionCanvasContext;
    // dpr: number
    offset;
    scale;
    worldRect;
    constructor(editor) {
        this.editor = editor;
        this.mainCanvas = document.createElement('canvas');
        this.mainCanvasContext = this.mainCanvas.getContext('2d');
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvasContext = this.selectionCanvas.getContext('2d');
    }
    destroy() {
        this.mainCanvas.remove();
        this.selectionCanvas.remove();
        this.mainCanvas = null;
        this.selectionCanvas = null;
        this.mainCanvasContext = null;
        this.selectionCanvasContext = null;
    }
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
}
export default MapView;
