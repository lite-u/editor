import { getRotateAngle } from '../helper.js';
const rotating = {
    // cursor: 'default',
    mouseMove() {
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        const elements = elementManager.getElementsByIdSet(selection.values);
        const { _rotateData, mouseWorldCurrent } = interaction;
        console.log(_rotateData);
        if (!_rotateData)
            return;
        const { targetPoint } = _rotateData;
        const rotate = getRotateAngle(targetPoint, mouseWorldCurrent);
        /*  console.log(
            center, mouseWorldCurrent,
          )*/
        console.log(rotate);
        /* const rects = elements.map((ele: ElementInstance) => {
           return ele.getBoundingRect()
         })*/
        // const rect = getBoundingRectFromBoundingRects(rects)
        // const center = {x: rect.cx, y: rect.cy}
        interaction._outlineElement?.rotateFrom(rotate, targetPoint);
        interaction._manipulationElements.forEach(ele => {
            ele.rotateFrom(rotate, targetPoint);
        });
        elements.forEach(ele => {
            ele.rotateFrom(rotate, targetPoint);
        });
        // resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction.startRotation)
        // dispatch('render-overlay')
        this.editor.action.dispatch('render-overlay');
        this.editor.action.dispatch('render-elements');
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
