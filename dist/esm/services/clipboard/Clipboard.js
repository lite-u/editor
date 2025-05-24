class ClipboardManager {
    copiedItems = [];
    CopyDeltaX = 10;
    CopyDeltaY = 10;
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
export default ClipboardManager;
