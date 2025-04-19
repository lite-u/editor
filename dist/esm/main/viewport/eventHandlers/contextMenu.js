import { detectHoveredModule } from './funcs';
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
    const selectedIdSet = this.getSelected;
    const position = { ...this.viewport.mouseMovePoint };
    let idSet = new Set();
    // console.log(selectedIdSet,lastId)
    if (lastId) {
        if (selectedIdSet.has(lastId)) {
            idSet = selectedIdSet;
        }
        else {
            idSet.add(lastId);
            this.addSelected(idSet);
            console.log(this.selectedModules);
            this.action.dispatch('selection-updated');
        }
    }
    this.action.dispatch('context-menu', {
        idSet,
        position,
        copiedItems: this.copiedItems.length > 0,
    });
    return false;
}
export default handleContextMenu;
//# sourceMappingURL=contextMenu.js.map