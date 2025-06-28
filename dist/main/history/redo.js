"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redo = redo;
const helpers_ts_1 = require("./helpers.ts");
function redo(quiet = false) {
    if (this.history.current === this.history.tail)
        return false;
    this.history.forward();
    const { type, payload } = this.history.current.data;
    const { selectedModules } = payload;
    switch (type) {
        case 'history-init':
            break;
        case 'history-add':
        case 'history-paste':
        case 'history-duplicate':
            // delete modules from added
            this.batchAdd(this.batchCreate(payload.modules));
            break;
        case 'history-modify':
            payload.changes.map(({ id, props }) => {
                const redoProps = {};
                Object.keys(props).forEach(propName => {
                    redoProps[propName] = props[propName]['to'];
                    this.batchModify(new Set([id]), redoProps);
                });
            });
            break;
        case 'history-move':
            this.batchMove(payload.selectedModules, {
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
            this.batchDelete((0, helpers_ts_1.extractIdSetFromArray)(payload.modules));
            break;
    }
    // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)
    if (!quiet) {
        this.replaceSelected(selectedModules);
        // console.log(selectedModules)
        this.action.dispatch('selection-updated');
    }
    return this.history.current;
}
