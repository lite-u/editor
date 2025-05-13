import nid from '../../../core/nid.js';
const rectangleTool = {
    cursor: 'rectangle',
    start(e) {
        const { elementManager, interaction, action, selection, } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        // this._resizingOperator = operator
        const id = 'rectangle-' + nid();
        const rectProps = {
            type: 'rectangle',
            cx: x - width / 2,
            cy: y - height / 2,
            width,
            height,
            id,
            layer: 0,
        };
        const ele = elementManager.add(elementManager.create(rectProps));
        interaction.state = 'resizing';
        interaction._ele = ele;
        action.dispatch('selection-clear');
        selection.replace(new Set([ele.id]));
        action.dispatch('visible-element-updated');
    },
    move(e) {
        if (!this.editor.interaction._ele)
            return;
        this.editor.container.setPointerCapture(e.pointerId);
        const { altKey, shiftKey } = e;
        const { interaction, world, selection, action, elementManager, rect } = this.editor;
        const { mouseWorldCurrent, mouseWorldStart } = interaction;
        const { cx, cy, width, height } = interaction._ele.original;
        // const dx = mouseCurrent.x - mouseStart.x
        // const dy = mouseCurrent.y - mouseStart.y
        const anchor = {
            x: cx - width / 2,
            y: cy - height / 2,
        };
        const startVec = {
            x: mouseWorldStart.x - anchor.x,
            y: mouseWorldStart.y - anchor.y,
        };
        // Distance from anchor to mouseCurrent (current handle position)
        const currentVec = {
            x: mouseWorldCurrent.x - anchor.x,
            y: mouseWorldCurrent.y - anchor.y,
        };
        // Prevent division by 0
        const scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1;
        const scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1;
        console.log(anchor, scaleX, scaleY);
        interaction._ele.scaleFrom(scaleX, scaleY, anchor);
        action.dispatch('visible-element-updated');
        // const r = applyResize.call(this, altKey, shiftKey)
        /*    this.editor.action.dispatch('element-modifying', {
              type: 'resize',
              data: r,
            })*/
    },
    finish(e) {
        this.editor.interaction._ele = null;
    },
};
export default rectangleTool;
