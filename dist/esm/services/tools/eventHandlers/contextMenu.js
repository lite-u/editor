import { detectHoveredModule } from './funcs.js';
function handleContextMenu(e) {
    // const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
    e.preventDefault();
    e.stopPropagation();
    /*
    if  if (e.ctrlKey) {
        return false
      }
    */
    detectHoveredModule.call(this);
    const lastId = this.hoveredModule;
    const selectedIdSet = this.selection.values;
    const position = { ...this.viewport.mouseMovePoint };
    let idSet = new Set();
    // console.log(selectedIdSet,lastId)
    if (lastId) {
        if (selectedIdSet.has(lastId)) {
            idSet = selectedIdSet;
        }
        else {
            idSet.add(lastId);
            this.selection.add(idSet);
            this.action.dispatch('selection-updated');
        }
    }
    this.action.dispatch('context-menu', {
        idSet,
        position,
        copiedItems: this.clipboard.copiedItems.length > 0,
    });
    return false;
}
export default handleContextMenu;
