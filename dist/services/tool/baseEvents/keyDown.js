"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {updateSelectionBox} from "../domManipulations.ts"
function handleKeyDown(e) {
    const { shiftKey, metaKey, ctrlKey, altKey } = e;
    const { interaction } = this.editor;
    if (e.code !== 'Space') {
        interaction._modifier = Object.assign(Object.assign({}, interaction._modifier), { shiftKey, metaKey, ctrlKey, altKey });
        this.tool.mouseMove.call(this);
    }
}
exports.default = handleKeyDown;
