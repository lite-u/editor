import {ElementProps} from '~/elements/elements'

class ClipboardManager {
  copiedItems: ElementProps[] = []
  CopyDeltaX = 50
  CopyDeltaY = 100

  copy() {}

  paste() {}

  updateCopiedItemsDelta(): void {
    this.copiedItems.forEach((copiedItem) => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
    })
  }

  destroy() {

  }
}

export default ClipboardManager