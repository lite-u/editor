import { extractIdSetFromArray } from './helpers.js';
export function undo(quiet = false) {
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
            this.elementManager.batchDelete(extractIdSetFromArray(payload.elements));
            break;
        case 'history-modify':
            payload.changes.map(({ id, from }) => {
                const ele = this.elementManager.getElementById(id);
                ele?.restore(from);
            });
            break;
        /*case 'history-move':
          console.log('move')
          this.elementManager.batchMove(payload.selectedElements, {
            x: -payload.delta.x,
            y: -payload.delta.y,
          })
          break*/
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
            this.elementManager.batchAdd(this.elementManager.batchCreate(elements));
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
