"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undo = undo;
const helpers_ts_1 = require("./helpers.ts");
function undo(quiet = false) {
    if (this.history.current === this.history.head)
        return false;
    const { type, payload } = this.history.current.data;
    // const {selectedModules} = payload
    let modules = null;
    switch (type) {
        case 'history-init':
            break;
        case 'history-add':
        case 'history-paste':
        case 'history-duplicate':
            // delete modules from added
            this.batchDelete((0, helpers_ts_1.extractIdSetFromArray)(payload.modules));
            break;
        case 'history-modify':
            payload.changes.map(({ id, props }) => {
                const undoProps = {};
                Object.keys(props).forEach(propName => {
                    // console.log(props[propName]!['from'])
                    undoProps[propName] = props[propName]['from'];
                    this.batchModify(new Set([id]), undoProps);
                });
            });
            break;
        case 'history-move':
            this.batchMove(payload.selectedModules, {
                x: -payload.delta.x,
                y: -payload.delta.y,
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
            modules = payload.modules;
            this.batchAdd(this.batchCreate(modules));
            break;
    }
    this.history.back();
    // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)
    if (!quiet) {
        const backedNodeSelectedModules = this.history.current.data.payload.selectedModules;
        this.replaceSelected(backedNodeSelectedModules);
        this.action.dispatch('selection-updated');
    }
    return this.history.current;
}
