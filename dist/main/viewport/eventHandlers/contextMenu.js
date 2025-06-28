"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcs_ts_1 = require("./funcs.ts");
function handleContextMenu(e) {
    // const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
    e.preventDefault();
    e.stopPropagation();
    /*
    if  if (e.ctrlKey) {
        return false
      }
    */
    funcs_ts_1.detectHoveredModule.call(this);
    const lastId = this.hoveredModule;
    const selectedIdSet = this.getSelected;
    const position = Object.assign({}, this.viewport.mouseMovePoint);
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
exports.default = handleContextMenu;
