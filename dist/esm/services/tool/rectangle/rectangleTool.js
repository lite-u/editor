import nid from '../../../core/nid.js';
const rectangleTool = {
    cursor: 'rectangle',
    mouseDown() {
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
        // console.log(ele)
        interaction.state = 'resizing';
        interaction._ele = ele;
        action.dispatch('selection-clear');
        selection.replace(new Set([ele.id]));
        action.dispatch('visible-element-updated');
    },
    mouseMove() {
        if (!this.editor.interaction._ele)
            return;
        const { interaction, world, selection, action, elementManager, rect } = this.editor;
        const { mouseWorldCurrent, _modifier, mouseWorldStart, _ele } = interaction;
        const { altKey, shiftKey } = _modifier;
        const { cx, cy, width, height } = _ele.original;
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
        let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1;
        let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1;
        /*
            if (shiftKey) {
              anchor.x = _ele.cx
              anchor.y = _ele.cy
            }
        */
        if (shiftKey) {
            const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));
            scaleX = Math.sign(scaleX) * uniformScale;
            scaleY = Math.sign(scaleY) * uniformScale;
        }
        const scalingAnchor = altKey
            ? { x: cx, y: cy }
            : anchor;
        interaction._ele.scaleFrom(scaleX, scaleY, scalingAnchor);
        action.dispatch('visible-element-updated');
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default rectangleTool;
