import {UID} from '~/core/core'

class Clipboard {
  copiedItems: Set<UID> = new Set()

  copy() {}

  paste() {}
}

export default Clipboard