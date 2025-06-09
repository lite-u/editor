import {ToolType} from '~/services/tool/toolManager'

const dSelector: ToolType = {
  cursor: 'default',
  init() {

  },
  mouseDown() {
    // this.interaction._movingHandle = this.interaction._hoveredHandle
  },
  mouseMove() {
    /* if (!this.interaction._movingHandle) return
     const {interaction} = this

     // this.container.setPointerCapture(e.pointerId)
     const {x, y} = interaction.mouseWorldMovement

     this.interaction._movingHandle.translate(x, y)*/
  },
  mouseUp() {
    // this.interaction._movingHandle = null
    // this.cursor.set('grab')
  },
}

export default dSelector