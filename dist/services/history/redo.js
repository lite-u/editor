"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redo = redo;
const helpers_1 = require("./helpers");
function redo(quiet = false) {
    if (this.history.current === this.history.tail)
        return false;
    this.history.forward();
    const { type, payload } = this.history.current.data;
    const { selectedElements } = payload;
    switch (type) {
        case 'history-init':
            break;
        case 'history-add':
        case 'history-paste':
        case 'history-duplicate':
            // delete elements from added
            this.mainHost.batchAdd(this.mainHost.batchCreate(payload.elements));
            break;
        case 'history-modify':
            payload.changes.map(({ id, to, type }) => {
                const ele = this.mainHost.getElementById(id);
                if (type === 'expand') {
                    const targetEle = this.mainHost.getElementById(id);
                    const replaceEle = this.mainHost.create(to);
                    if (targetEle && replaceEle) {
                        this.mainHost.replace([{ from: targetEle, to: replaceEle }]);
                        replaceEle.updatePath2D();
                        replaceEle.updateBoundingRect();
                        replaceEle.updateOriginalBoundingRect();
                    }
                }
                else {
                    ele === null || ele === void 0 ? void 0 : ele.restore(to);
                }
            });
            break;
        case 'history-move':
            this.mainHost.batchMove(payload.selectedElements, {
                x: payload.delta.x,
                y: payload.delta.y,
            });
            break;
        case 'history-reorder':
            break;
        case 'history-group':
            break;
        case 'history-ungroup':
            break;
        case 'history-composite':
            break;
        case 'history-delete':
            this.mainHost.batchDelete((0, helpers_1.extractIdSetFromArray)(payload.elements));
            break;
    }
    if (!quiet) {
        this.selection.replace(selectedElements);
        // console.log(selectedElements)
        this.action.dispatch('selection-updated');
    }
    return this.history.current;
}
