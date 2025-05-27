import rotating from './rotating/rotating.js';
import selecting from './selecting/selecting.js';
import dragging from './dragging/dragging.js';
const selector = {
    cursor: 'default',
    init: function () { },
    mouseDown: function (event) {
        const { interaction, selection, cursor } = this;
        // console.log(event)
        if (interaction._rotateData) {
            this.toolManager.subTool = rotating;
            return;
        }
        else if (interaction._draggingElements.length > 0) {
            this.toolManager.subTool = dragging;
            return;
        }
        // console.log(this.toolManager.subTool)
        // selecting.mouseDown(event)
        // console.log(event.element)
        this.toolManager.subTool = selecting;
        cursor.lock();
        /*
            // const {_hoveredElement} = interaction
    
            const rotateMode = !!interaction._hoveredRotateManipulator
            const resizeMode = !!interaction._hoveredResizeManipulator
    
            if (resizeMode) {
              const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '')
              cursor.set('resize')
              this.subTool = resizing
    
              interaction._resizingData = {placement}
    
              cursor.set('resize')
              this.subTool = resizing
            } else if (rotateMode) {
              const rects = elementManager.getElementsByIdSet(selection.values).map(ele => {
                return ele.getBoundingRect(true)
              })
              const center = getBoundingRectFromBoundingRects(rects)
              const {cx: x, cy: y} = center
    
              console.log(interaction._hoveredElement)
              interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
              this.subTool = rotating
            } */
    },
    mouseMove: function () {
        // console.log('moving')
        const { interaction, cursor } = this;
        // console.log('m')
        this.toolManager.subTool?.mouseMove.call(this);
        /* if (interaction._rotateData) {
           rotating.mouseMove.call(this)
           return
         }
    
         if (!this.toolManager.subTool) {
           if (interaction._hoveredResizeManipulator) {
             cursor.set('nw-resize')
             // console.log(10)
           } else if (interaction._hoveredRotateManipulator) {
             // console.log(interaction._hoveredRotateManipulator.id)
             const centerPoint = {
               x: interaction.selectedOutlineElement.cx,
               y: interaction.selectedOutlineElement.cy,
             }
    
             const rotation = getRotateAngle(centerPoint, interaction.mouseWorldCurrent)
             cursor.set('rotate')
             cursor.rotate(rotation)
             // console.log(10)
           } else {
             // cursor.set(selector.cursor)
           }
         }*/
        // if (!this.subTool) return
    },
    mouseUp() {
        this.cursor.unlock();
        this.toolManager.subTool?.mouseUp.call(this);
        this.cursor.set(selector.cursor);
        this.toolManager.subTool = null;
    },
};
export default selector;
