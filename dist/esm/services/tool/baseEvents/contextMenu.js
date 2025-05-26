function handleContextMenu(e) {
    // const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
    /*
    if  if (e.ctrlKey) {
        return false
      }
    */
    const { action, clipboard, interaction, selection } = this.editor;
    // detectHoveredElement.call(this)
    const lastId = interaction._hoveredElement;
    const selectedIdSet = selection.values;
    const position = { ...interaction.mouseCurrent };
    let idSet = new Set();
    // console.log(selectedIdSet,lastId)
    if (lastId) {
        if (selectedIdSet.has(lastId)) {
            idSet = selectedIdSet;
        }
        else {
            idSet.add(lastId);
            selection.add(idSet);
            action.dispatch('selection-updated');
        }
    }
    action.dispatch('context-menu', {
        idSet,
        position,
        copiedItems: clipboard.copiedItems.length > 0,
    });
    return false;
}
export default handleContextMenu;
