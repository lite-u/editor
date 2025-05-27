import { getRotateAngle } from '../helper.js';
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
        elements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint));
        cursor.rotate(mouseCurrentRotation);
        console.log('rotate reset');
        // this.overlayHost.reset()
        this.action.dispatch('reset-overlay');
        this.action.dispatch('rerender-main-host');
        return rotationDiff;
    },
    mouseUp() {
        console.log(this);
        const { interaction, mainHost, action, cursor, selection } = this;
        const elements = mainHost.getElementsByIdSet(selection.values);
        const changes = [];
        const rotation = rotating.mouseMove.call(this);
        elements.forEach(ele => {
            const change = ele.rotateFrom(rotation, interaction._rotateData?.targetPoint, true);
            ele.updateOriginal();
            changes.push(change);
        });
        // cursor.set(selector.cursor)
        action.dispatch('element-modified', changes);
        this.interaction._rotateData = null;
        console.log(this);
    },
};
export default rotating;
