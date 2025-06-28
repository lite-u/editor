"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = pick;
const redo_ts_1 = require("./redo.ts");
const undo_ts_1 = require("./undo.ts");
function pick(targetNode) {
    const relativePosition = this.history.compareToCurrentPosition(targetNode);
    if (!relativePosition || relativePosition === 'equal')
        return;
    if (relativePosition === 'front' || relativePosition === 'behind') {
        const quietMode = true;
        let localCurrent;
        while (true) {
            if (relativePosition === 'front') {
                localCurrent = undo_ts_1.undo.call(this, quietMode);
            }
            else if (relativePosition === 'behind') {
                localCurrent = redo_ts_1.redo.call(this, quietMode);
            }
            if (localCurrent === targetNode)
                break;
        }
        const { selectedModules } = targetNode.data.payload;
        // this.editor.updateVisibleModuleMap(this.editor.viewport.worldRect)
        this.replaceSelected(selectedModules);
    }
    else {
        // do sth...
    }
}
