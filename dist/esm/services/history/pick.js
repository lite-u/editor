import { redo } from './redo.js';
import { undo } from './undo.js';
export function pick(targetNode) {
    const relativePosition = this.history.compareToCurrentPosition(targetNode);
    if (!relativePosition || relativePosition === 'equal')
        return;
    if (relativePosition === 'front' || relativePosition === 'behind') {
        const quietMode = true;
        let localCurrent;
        while (true) {
            if (relativePosition === 'front') {
                localCurrent = undo.call(this, quietMode);
            }
            else if (relativePosition === 'behind') {
                localCurrent = redo.call(this, quietMode);
            }
            if (localCurrent === targetNode)
                break;
        }
        const { selectedModules } = targetNode.data.payload;
        // this.editor.updateVisibleelementMap(this.editor.viewport.worldRect)
        this.selection.replaceSelected(selectedModules);
    }
    else {
        // do sth...
    }
}
