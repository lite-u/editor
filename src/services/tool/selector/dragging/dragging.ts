import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {areSetsEqual, getSymmetricDifference} from '~/lib/lib'
import {getResizeCursor, getRotateAngle} from '~/services/tool/selector/helper'
import {BoundingRect, UID} from '~/type'
import {ElementModifyData} from '~/services/actions/type'
import {ElementProps} from '~/elements/type'
import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {applyRotating, detectHoveredElement} from '~/services/tool/helper'

const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove(this: ToolManager, {movementX, movementY, shiftKey, metaKey, ctrlKey}) {
    const {
      action,
      // container,
      world,
      interaction,
      elementManager,
      cursor,
    } = this.editor
    const {
      _ele,
      selectedShadow,
      _selectingElements,
      mouseStart,
      mouseCurrent,
    } = interaction

    switch (interaction.state) {
      case 'selecting': {
        // container.setPointerCapture(e.pointerId)
        const rect = generateBoundingRectFromTwoPoints(
          mouseStart,
          mouseCurrent,
        )
        const pointA = world.getWorldPointByViewportPoint(rect.x, rect.y)
        const pointB = world.getWorldPointByViewportPoint(
          rect.right,
          rect.bottom,
        )
        const virtualSelectionRect: BoundingRect =
          generateBoundingRectFromTwoPoints(pointA, pointB)
        const _selecting: Set<UID> = new Set()
        const modifyKey = ctrlKey || metaKey || shiftKey

        elementManager.all.forEach((ele) => {
          if (ele.isInsideRect(virtualSelectionRect)) {
            _selecting.add(ele.id)
          }
        })

        const selectingChanged = !areSetsEqual(_selectingElements, _selecting)

        interaction.updateSelectionBox(rect)

        /**
         * Simple logic
         * If with modifyKey
         *    original-selected Symmetric Difference selecting
         * else
         *    original-selected merge selecting
         */
        if (!selectingChanged) return

        interaction._selectingElements = _selecting

        const SD = getSymmetricDifference(selectedShadow, _selecting)

        if (modifyKey) {
          action.dispatch('selection-modify', {
            mode: 'replace',
            idSet: SD,
          })
        } else {
          if (_selecting.size === 0 && selectedShadow.size === 0) {
            return action.dispatch('selection-clear')
          }
          const newSet = new Set([...selectedShadow, ..._selecting])

          action.dispatch('selection-modify', {
            mode: 'replace',
            idSet: newSet,
          })
        }
      }
        break
      /*

            case 'panning':
              container.setPointerCapture(e.pointerId)
              updateCursor.call(this, 'grabbing')
              action.dispatch('world-shift',
                {
                  x: e.movementX,
                  y: e.movementY,
                })

              break
      */

      case 'dragging': {
        // container.setPointerCapture(e.pointerId)
        const x = (movementX * world.dpr) / world.scale
        const y = (movementY * world.dpr) / world.scale

        // force update
        action.dispatch('element-modifying', {
          type: 'move',
          data: {x, y},
        })
      }
        break

      case 'resizing': {
        // container.setPointerCapture(e.pointerId)
        console.log(this.editor.interaction._ele)

      }
        break

      case 'rotating': {
        // container.setPointerCapture(e.pointerId)
        // const {shiftKey} = e
        // const {x, y} = interaction._rotatingOperator!.elementOrigin
        // const centerPoint = world.getViewPointByWorldPoint(x, y)
        // const rotation = applyRotating.call(this, shiftKey)
        // const cursorAngle = getRotateAngle(centerPoint, mouseCurrent)

        // cursor.move(mouseCurrent, cursorAngle)
        // updateCursor.call(this, 'rotate', mouseMovePoint, cursorAngle)
        /*
                action.dispatch('element-modifying', {
                  type: 'rotate',
                  data: {rotation},
                })*/
      }
        break

      case 'waiting': {
        console.log('mousedown')
        const MOVE_THROTTLE = 1
        const moved =
          Math.abs(interaction.mouseCurrent.x - mouseStart.x) >
          MOVE_THROTTLE ||
          Math.abs(interaction.mouseCurrent.y - mouseStart.y) >
          MOVE_THROTTLE

        if (moved) {
          if (_ele.size > 0) {
            interaction.state = 'dragging'
          } else {
            interaction.state = 'selecting'
          }
        }
      }
        break

      case 'static': {
        const r = detectHoveredElement.call(this)
        const {interaction} = this.editor

        if (r) {
          if (r.type === 'rotate') {
            const centerPoint = world.getViewPointByWorldPoint(r.elementOrigin.x, r.elementOrigin.y)
            const angle = getRotateAngle(centerPoint, mouseCurrent)

            cursor.set('rotate')
            cursor.move(mouseCurrent, angle)
            // updateCursor.call(this, 'rotate', mouseMovePoint, angle)
          } else if (r.type === 'resize') {
            const {x, y} = r.elementOrigin
            const centerPoint = world.getViewPointByWorldPoint(x, y)
            const cursorDirection = getResizeCursor(interaction.mouseCurrent, centerPoint)

            cursor.set('resize', cursorDirection)
            // updateCursor.call(this, 'resize', cursorDirection)
          }
        } else {
          // updateCursor.call(this, 'default')
          cursor.set('default')
        }

        // container.releasePointerCapture(e.pointerId)
        // viewport.drawCrossLine = viewport.drawCrossLineDefault
      }

        break
    }
  },
  mouseUp(this: ToolManager, {button}) {
  },
}

export default dragging