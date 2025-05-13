import nid from '../../../core/nid.js';
const rectangleTool = {
    cursor: 'rectangle',
    start(e) {
        const { elementManager, interaction, action, selection, } = this.editor;
        const { x, y } = interaction.mouseMove;
        const { x: cx, y: cy } = this.editor.world.getWorldPointByViewportPoint(x, y);
        const width = 2;
        const height = 2;
        // this._resizingOperator = operator
        const id = 'rectangle-' + nid();
        const rectProps = {
            type: 'rectangle',
            id,
            layer: 0,
            lineColor: '#000',
            fillColor: '#fff',
            lineWidth: 1,
            opacity: 100,
            cx: cx - width / 2,
            cy: cy - height / 2,
            width,
            height,
        };
        const ele = elementManager.add(elementManager.create(rectProps));
        interaction.state = 'resizing';
        interaction._ele = ele;
        action.dispatch('selection-clear');
        selection.replace(new Set([ele.id]));
        action.dispatch('visible-element-updated');
        // const r = this.editor.interaction.operationHandlers.find(o => o.type === 'resize' && o.name === 'br')
        /*  if (r) {
            this.editor.interaction._resizingOperator = r as ResizeHandle
          }*/
    },
    move(e) {
        // if (!this.editor.interaction._resizingOperator) return
        const { altKey, shiftKey } = e;
        const { interaction, world, selection, action, elementManager, rect } = this.editor;
        const { mouseMove, mouseStart } = interaction;
        const dx = mouseMove.x - mouseStart.x;
        const dy = mouseMove.y - mouseStart.y;
        this.editor.container.setPointerCapture(e.pointerId);
        interaction._ele.translate(dx, dy);
        console.log(dx, dy);
        action.dispatch('visible-element-updated');
        // const r = applyResize.call(this, altKey, shiftKey)
        /*    this.editor.action.dispatch('element-modifying', {
              type: 'resize',
              data: r,
            })*/
    },
    finish(e) {
    },
};
export default rectangleTool;
