"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undo = undo;
const helpers_1 = require("./helpers");
function undo(quiet = false) {
    if (this.history.current === this.history.head)
        return false;
    const { type, payload } = this.history.current.data;
    // const {selectedElements} = payload
    let elements = null;
    switch (type) {
        case 'history-init':
            break;
        case 'history-add':
        case 'history-paste':
        case 'history-duplicate':
            // delete elements from added
            this.mainHost.batchDelete((0, helpers_1.extractIdSetFromArray)(payload.elements));
            break;
        case 'history-modify':
            payload.changes.map(({ id, from, type }) => {
                const ele = this.mainHost.getElementById(id);
                if (type === 'expand') {
                    const targetEle = this.mainHost.getElementById(id);
                    const replaceEle = this.mainHost.create(from);
                    if (targetEle && replaceEle) {
                        this.mainHost.replace([{ from: targetEle, to: replaceEle }]);
                        replaceEle.updatePath2D();
                        replaceEle.updateBoundingRect();
                        replaceEle.updateOriginalBoundingRect();
                    }
                }
                else {
                    ele === null || ele === void 0 ? void 0 : ele.restore(from);
                }
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
            elements = payload.elements;
            this.mainHost.batchAdd(this.mainHost.batchCreate(elements));
            break;
    }
    this.history.back();
    // this.editor.updateVisibleelementMap(this.editor.viewport.worldRect)
    if (!quiet) {
        const backedNodeSelectedElements = this.history.current.data.payload.selectedElements;
        this.selection.replace(backedNodeSelectedElements);
        this.action.dispatch('selection-updated');
    }
    return this.history.current;
}
