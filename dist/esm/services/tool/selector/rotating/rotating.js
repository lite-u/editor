import { getRotateAngle } from '../helper.js';
const rotating = {
    // cursor: 'default',
    mouseMove() {
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        const elements = elementManager.getElementsByIdSet(selection.values);
        const { _resizingData, mouseWorldCurrent } = interaction;
        console.log(_resizingData);
        if (!_resizingData)
            return;
        const { center } = _resizingData;
        const rotate = getRotateAngle(center, mouseWorldCurrent);
        console.log(center, mouseWorldCurrent);
        console.log(rotate);
        /* const rects = elements.map((ele: ElementInstance) => {
           return ele.getBoundingRect()
         })*/
        // const rect = getBoundingRectFromBoundingRects(rects)
        // const center = {x: rect.cx, y: rect.cy}
        elements.forEach(ele => {
            ele.rotateFrom(rotate, center);
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
