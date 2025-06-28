"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("~/services/tool/selector/helper");
const rotating = {
    // cursor: 'default',
    mouseMove: function () {
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        const elements = mainHost.getElementsByIdSet(selection.values);
        const { _rotateData, _modifier, mouseWorldCurrent, mouseWorldStart } = interaction;
        const { shiftKey } = _modifier;
        if (!_rotateData)
            return;
        const { targetPoint } = _rotateData;
        const mouseStartRotation = (0, helper_1.getRotateAngle)(targetPoint, mouseWorldStart);
        const mouseCurrentRotation = (0, helper_1.getRotateAngle)(targetPoint, mouseWorldCurrent);
        let rotationDiff = mouseCurrentRotation - mouseStartRotation;
        if (shiftKey) {
            rotationDiff = Math.round(rotationDiff / 15) * 15;
        }
        elements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint));
        cursor.rotate(mouseCurrentRotation);
        // console.log('rotate reset')
        // this.overlayHost.reset()
        action.dispatch('reset-overlay');
        action.dispatch('rerender-main-host');
        return rotationDiff;
    },
    mouseUp() {
        // console.log(this)
        const { interaction, mainHost, action, cursor, selection } = this.editor;
        const elements = mainHost.getElementsByIdSet(selection.values);
        const changes = [];
        const rotation = rotating.mouseMove.call(this);
        elements.forEach(ele => {
            var _a;
            const change = ele.rotateFrom(rotation, (_a = interaction._rotateData) === null || _a === void 0 ? void 0 : _a.targetPoint, true);
            ele.updateOriginal();
            changes.push(change);
        });
        // cursor.set(selector.cursor)
        interaction._rotateData = null;
        action.dispatch('element-modified', changes);
    },
};
exports.default = rotating;
