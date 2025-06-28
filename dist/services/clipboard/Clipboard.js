"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClipboardManager {
    constructor() {
        this.copiedItems = [];
        this.CopyDeltaX = 10;
        this.CopyDeltaY = 10;
    }
    copy() { }
    paste() { }
    updateCopiedItemsDelta() {
        /*    this.copiedItems.forEach((copiedItem) => {
              copiedItem!.x += this.CopyDeltaX
              copiedItem!.y += this.CopyDeltaY
            })*/
    }
    destroy() {
    }
}
exports.default = ClipboardManager;
