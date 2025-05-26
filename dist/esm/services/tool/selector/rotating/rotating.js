import { getRotateAngle } from '../helper.js';
import selector from '../selector.js';
const rotating = {
    // cursor: 'default',
    mouseMove: function () {
        const { interaction, mainHost, selection, cursor } = this;
        const elements = mainHost.getElementsByIdSet(selection.values);
        const { _rotateData, _modifier, mouseWorldCurrent, mouseWorldStart } = interaction;
        const { shiftKey } = _modifier;
        if (!_rotateData)
            return;
        const { targetPoint } = _rotateData;
        const mouseStartRotation = getRotateAngle(targetPoint, mouseWorldStart);
        const mouseCurrentRotation = getRotateAngle(targetPoint, mouseWorldCurrent);
        let rotationDiff = mouseCurrentRotation - mouseStartRotation;
        if (shiftKey) {
            rotationDiff = Math.round(rotationDiff / 15) * 15;
        }
        // interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
        // interaction._manipulationElements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint))
        elements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint));
        cursor.rotate(mouseCurrentRotation);
        this.action.dispatch('rerender-overlay');
        this.action.dispatch('rerender-main-host');
        return rotationDiff;
    },
    mouseUp() {
        const { interaction, mainHost, action, cursor, selection } = this;
        const elements = mainHost.getElementsByIdSet(selection.values);
        const changes = [];
        const rotation = rotating.mouseMove.call(this);
        elements.forEach(ele => {
            const change = ele.rotateFrom(rotation, interaction._rotateData?.targetPoint, true);
            ele.updateOriginal();
            changes.push(change);
        });
        cursor.set(selector.cursor);
        action.dispatch('element-modified', changes);
        this.interaction.subTool = null;
    },
};
export default rotating;
