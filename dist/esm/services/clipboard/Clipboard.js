class ClipboardManager {
    copiedItems = [];
    CopyDeltaX = 50;
    CopyDeltaY = 100;
    copy() { }
    paste() { }
    updateCopiedItemsDelta() {
        this.copiedItems.forEach((copiedItem) => {
            copiedItem.x += this.CopyDeltaX;
            copiedItem.y += this.CopyDeltaY;
        });
    }
    destroy() {
    }
}
export default ClipboardManager;
