import { getRotateAngle } from '../helper.js';
const rotating = {
    // cursor: 'default',
    mouseMove() {
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        const elements = elementManager.getElementsByIdSet(selection.values);
        const { _rotateData, _modifier, mouseWorldCurrent, mouseWorldStart } = interaction;
        const { shiftKey } = _modifier;
        if (!_rotateData)
            return;
        const { startRotation, targetPoint } = _rotateData;
        const mouseStartRotation = getRotateAngle(targetPoint, mouseWorldStart);
        const mouseCurrentRotation = getRotateAngle(targetPoint, mouseWorldCurrent);
        let rotationDiff = mouseCurrentRotation - mouseStartRotation;
        if (shiftKey) {
            rotationDiff = Math.round(rotationDiff / 15) * 15;
        }
        interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint);
        interaction._manipulationElements.forEach(ele => {
            ele.rotateFrom(rotationDiff, targetPoint);
        });
        elements.forEach(ele => {
            ele.rotateFrom(rotationDiff, targetPoint);
        });
        cursor.rotate(rotationDiff);
        this.editor.action.dispatch('render-overlay');
        this.editor.action.dispatch('render-elements');
    },
    mouseUp() {
        const { interaction, elementManager, action, selection } = this.editor;
        const elements = elementManager.getElementsByIdSet(selection.values);
        const changes = [];
        elements.forEach(ele => {
            const change = ele.rotateFrom(0, interaction._rotateData?.targetPoint, true);
            ele.updateOriginal();
            changes.push(change);
        });
        console.log(changes);
        action.dispatch('element-modified', changes);
        this.subTool = null;
    },
};
export default rotating;
/*

const rotating: SubToolType = {
  data:{},
  start:()=>{},
  end:()=>{}
}*/
