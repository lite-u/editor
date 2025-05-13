import ToolManager, {ToolType} from '~/services/tool/toolManager'
import {applyResize} from '~/services/tool/events/helper'
import {ElementModifyData} from '~/services/actions/type'
import nid from '~/core/nid'
import {ResizeHandler} from '~/services/selection/type'
import {ElementProps} from '~/elements/elements'
import {applyRotating} from '~/services/tool/helper'

const rectangleTool: ToolType = {
  cursor: 'rectangle',
  start(this: ToolManager, e: MouseEvent) {

    const {x, y} = this.editor.interaction.mouseMovePoint
    const {x: cx, y: cy} = this.editor.world.getWorldPointByViewportPoint(x, y)
    const width = 2
    const height = 2
    // this._resizingOperator = operator
    const id = 'rectangle-' + nid()
    const rectProps: ElementProps = {
      type: 'rectangle',
      id,
      layer: 0,
      lineColor: '#000',
      fillColor: '#fff',
      lineWidth: 1,
      opacity: 100,
      cx: cx - width / 2,
      cy: cy - height / 2,
      width,
      height,
    }

    const created = this.editor.elementManager.add(this.editor.elementManager.create(rectProps))
    console.log(created)
    const arr = [...this.editor.interaction.operationHandlers] as ResizeHandler[]

    // const newRect = this.elementManager.batchAdd(this.elementManager.batchCreate([rectProps]))
    // this.elementManager.batchAdd(newRect)
    // console.log(newRect)
    this.editor.interaction.manipulationStatus = 'resizing'
    this.editor.action.dispatch('selection-clear')
    this.editor.action.dispatch('element-updated')

  },
  move(this: ToolManager, e: PointerEvent) {
    const {altKey, shiftKey} = e

    // console.log(this._resizingOperator)
    if (!this.editor.interaction._resizingOperator) return

    this.editor.container.setPointerCapture(e.pointerId)

    const r = applyResize.call(this, altKey, shiftKey)

    this.editor.action.dispatch('element-modifying', {
      type: 'resize',
      data: r,
    })

  },
  finish(this: ToolManager, e: MouseEvent) {
    const leftMouseClick = e.button === 0
    const {interaction, world, selection, action, elementManager, rect} = this.editor
    const {scale, dpr} = world
    if (leftMouseClick) {
      const {
        draggingElements,
        manipulationStatus,
        _selectingElements,
        selectedShadow,
      } = interaction
      const x = e.clientX - rect!.x
      const y = e.clientY - rect!.y
      const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
      // console.log('up',manipulationStatus)
      interaction.mouseMovePoint.x = x
      interaction.mouseMovePoint.y = y

      switch (manipulationStatus) {
        case 'selecting':
          break

        /*        case 'panning':
                  updateCursor.call(this, 'grabbing')
                  // this.viewport.translateViewport(e.movementX, e.movementY)

                  break*/

        case 'dragging': {
          const x = ((interaction.mouseMovePoint.x - interaction.mouseDownPoint.x) *
              dpr) /
            scale
          const y = ((interaction.mouseMovePoint.y - interaction.mouseDownPoint.y) *
              dpr) /
            scale
          const moved = !(x === 0 && y === 0)

          // mouse stay static
          if (moved) {
            const changes: ElementModifyData[] = []
            action.dispatch('element-modifying', {
              type: 'move',
              data: {x: -x, y: -y},
            })

            // Move back to origin position and do the move again
            draggingElements.forEach((id) => {
              const element = elementManager.getElementById(id)

              if (element) {
                const change: ElementModifyData = {
                  id,
                  props: {
                    x: element.cx + x,
                    y: element.cy + y,
                  },
                }

                changes.push(change)
              }
            })

            action.dispatch('element-modify', changes)
          } else {
            const closestId = interaction.hoveredElement

            if (closestId && modifyKey && closestId === interaction._deselection) {
              action.dispatch('selection-modify', {
                mode: 'toggle',
                idSet: new Set([closestId]),
              })
            }
          }
        }
          break

        case 'resizing': {
          const {altKey, shiftKey} = e
          const props = applyResize.call(this, altKey, shiftKey)
          const elementOrigin = interaction._resizingOperator?.elementOrigin
          const rollbackProps: Partial<ElementProps> = {}

          Object.keys(props).forEach((key) => {
            rollbackProps[key] = elementOrigin[key]
          })

          // rotate back
          action.dispatch('element-modifying', {
            type: 'resize',
            data: rollbackProps,
          })

          action.dispatch('element-modify', [{
            id: interaction._resizingOperator!.id,
            props,
          }])
        }
          break

        case 'rotating': {
          const {shiftKey} = e
          const newRotation = applyRotating.call(this, shiftKey)
          const {rotation} = interaction._rotatingOperator?.elementOrigin!
          const rollbackProps: Partial<ElementProps> = {rotation}

          // rotate back
          action.dispatch('element-modifying', {
            type: 'resize',
            data: rollbackProps,
          })

          action.dispatch('element-modify', [{
            id: interaction._rotatingOperator!.id,
            props: {rotation: newRotation},
          }])
        }
          break

        case 'waiting':
          action.dispatch('selection-clear')
          break
        case 'static':
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            selection.toggle(draggingElements)
          } else {
            selection.replace(draggingElements)
          }

          break
      }

      draggingElements.clear()
      selectedShadow.clear()
      _selectingElements.clear()
      _selectingElements.clear()
      interaction.manipulationStatus = 'static'
      interaction._deselection = null
      interaction._resizingOperator = null

      interaction.updateSelectionBox(
        {x: 0, y: 0, width: 0, height: 0},
        false,
      )
    }

  },
}

export default rectangleTool