import { extractIdSetFromArray } from './helpers.js';
export function redo(quiet = false) {
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
            this.elementManager.batchAdd(this.elementManager.batchCreate(payload.modules));
            break;
        case 'history-modify':
            payload.changes.map(({ id, props }) => {
                const redoProps = {};
                Object.keys(props).forEach(propName => {
                    redoProps[propName] = props[propName]['to'];
                    this.elementManager.batchModify(new Set([id]), redoProps);
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
            this.elementManager.batchDelete(extractIdSetFromArray(payload.modules));
            break;
    }
    // this.editor.updateVisibleelementMap(this.editor.viewport.worldRect)
    if (!quiet) {
        this.selection.replace(selectedModules);
        // console.log(selectedModules)
        this.action.dispatch('selection-updated');
    }
    return this.history.current;
}
