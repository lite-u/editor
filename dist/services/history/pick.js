"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = pick;
const redo_1 = require("./redo");
const undo_1 = require("./undo");
function pick(targetNode) {
    const relativePosition = this.history.compareToCurrentPosition(targetNode);
    if (!relativePosition || relativePosition === 'equal')
        return;
    if (relativePosition === 'front' || relativePosition === 'behind') {
        const quietMode = true;
        let localCurrent;
        while (true) {
            if (relativePosition === 'front') {
                localCurrent = undo_1.undo.call(this, quietMode);
            }
            else if (relativePosition === 'behind') {
                localCurrent = redo_1.redo.call(this, quietMode);
            }
            if (localCurrent === targetNode)
                break;
        }
        const { selectedElements } = targetNode.data.payload;
        // this.editor.updateVisibleelementMap(this.editor.viewport.worldRect)
        this.selection.replace(selectedElements);
    }
    else {
        // do sth...
    }
}
