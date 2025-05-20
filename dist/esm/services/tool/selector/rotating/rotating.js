import { getRotateAngle } from '../helper.js';
const rotating = {
    // cursor: 'default',
    mouseMove() {
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        const elements = elementManager.getElementsByIdSet(selection.values);
        const { _rotateData, mouseWorldCurrent, mouseWorldStart } = interaction;
        console.log(_rotateData);
        if (!_rotateData)
            return;
        const { startRotation, targetPoint } = _rotateData;
        const mouseStartRotation = getRotateAngle(targetPoint, mouseWorldStart);
        const mouseCurrentRotation = getRotateAngle(targetPoint, mouseWorldCurrent);
        /*  console.log(
            center, mouseWorldCurrent,
          )*/
        const rotationDiff = mouseCurrentRotation - mouseStartRotation;
        console.log(rotationDiff);
        // const center = {x: rect.cx, y: rect.cy}
        interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint);
        interaction._manipulationElements.forEach(ele => {
            ele.rotateFrom(rotationDiff, targetPoint);
        });
        elements.forEach(ele => {
            ele.rotateFrom(rotationDiff, targetPoint);
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
