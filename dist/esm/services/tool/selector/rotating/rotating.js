import { getBoundingRectFromBoundingRects } from '../../resize/helper.js';
const rotating = {
    // cursor: 'default',
    mouseMove() {
        console.log(222);
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        const elements = elementManager.getElementsByIdSet(selection.values);
        const rects = elements.map((ele) => {
            return ele.getBoundingRect();
        });
        const rect = getBoundingRectFromBoundingRects(rects);
        const center = { x: rect.cx, y: rect.cy };
        elements.forEach(ele => {
            ele.rotateFrom(10, center);
        });
        // resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction.startRotation)
        this.editor.action.dispatch('element-updated');
        // this.subTool.mouseMove.call(this)
    },
    mouseUp() {
        if (!this.subTool)
            return;
        // this.subTool.mouseUp.call(this)
        this.subTool = null;
    },
};
export default rotating;
