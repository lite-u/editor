import Editor from '~/main/editor'
import {updateCursor, updateSelectionBox} from '~/services/viewport/domManipulations'
import Base from '~/elements/base/base'
import {ToolManager} from '~/services/tools/toolManager'
import {applyResize} from '~/services/tools/eventHandlers/funcs'
import {ElementModifyData} from '~/services/actions/type'
import nid from '~/core/nid'
import {ResizeHandler} from '~/services/selection/type'
import {ElementProps} from '~/elements/elements'

const rectangleTool: ToolManager = {
  start(this: Editor, _: MouseEvent) {
    // const {shiftKey, metaKey, ctrlKey} = e
    // const modifyKey = ctrlKey || metaKey || shiftKey
    // console.log(this.viewport.mouseMovePoint)
    const {x, y} = this.viewport.mouseMovePoint
    const {x: cx, y: cy} = this.world.getWorldPointByViewportPoint(x, y)
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

    const created = this.elementManager.batchAdd(this.elementManager.batchCreate([rectProps]))
    console.log(created)
    // this.action.dispatch('module-add', [rectProps])
    // const mod = this.elementManager.all.get(id)
    // console.log(mod)
    // mod.getOperators()
    // console.log([...this.operationHandlers])
    const arr = [...this.operationHandlers] as ResizeHandler[]

    for (let i = arr.length - 1; i >= 0; i--) {
      const {id: OId, type, name} = arr[i]
      if (OId === id && type === 'resize' && name === 'br') {
        this._resizingOperator = arr[i]
        break
      }
    }

    // const newRect = this.elementManager.batchAdd(this.elementManager.batchCreate([rectProps]))
    // this.elementManager.batchAdd(newRect)
    // console.log(newRect)
    this.manipulationStatus = 'resizing'
    this.action.dispatch('selection-clear')
  },
  move(this: Editor, e: PointerEvent) {
    const {altKey, shiftKey} = e
    const {viewport} = this

    // console.log(this._resizingOperator)
    if (!this._resizingOperator) return

    viewport.wrapper.setPointerCapture(e.pointerId)

    const r = applyResize.call(this, altKey, shiftKey)

    this.action.dispatch('element-modifying', {
      type: 'resize',
      data: r,
    })

  },
  finish(this: Editor, e: MouseEvent) {
    const leftMouseClick = e.button === 0

    if (leftMouseClick) {
      const {
        draggingModules,
        manipulationStatus,
        elementManager,
        _selectingModules,
        selectedShadow,
        viewport,
        interaction,
      } = this

      const {mouseMovePoint} = interaction
      const elementMap = elementManager.all
      const x = e.clientX - viewport.rect!.x
      const y = e.clientY - viewport.rect!.y
      const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
      // console.log('up',manipulationStatus)
      mouseMovePoint.x = x
      mouseMovePoint.y = y

      switch (manipulationStatus) {
        case 'selecting':
          break

        case 'panning':
          updateCursor.call(this, 'grabbing')
          // this.viewport.translateViewport(e.movementX, e.movementY)

          break

        case 'dragging': {
          const x = ((viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) *
              viewport.dpr) /
            viewport.scale
          const y = ((viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) *
              viewport.dpr) /
            viewport.scale
          const moved = !(x === 0 && y === 0)

          // mouse stay static
          if (moved) {
            const changes: ElementModifyData[] = []
            this.action.dispatch('element-modifying', {
              type: 'move',
              data: {x: -x, y: -y},
            })

            // Move back to origin position and do the move again
            draggingModules.forEach((id) => {
              const module = elementMap.get(id)

              if (module) {
                const change: ElementModifyData = {
                  id,
                  props: {
                    x: module.cx + x,
                    y: module.cy + y,
                  },
                }

                changes.push(change)
              }
            })

            this.action.dispatch('element-modify', changes)
          } else {
            const closestId = this.hoveredModule

            if (closestId && modifyKey && closestId === this.interaction._deselection) {
              this.action.dispatch('selection-modify', {
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
          const moduleOrigin = this._resizingOperator?.moduleOrigin
          const rollbackProps: Partial<ElementProps> = {}

          Object.keys(props).forEach((key) => {
            rollbackProps[key] = moduleOrigin[key]
          })

          // rotate back
          this.action.dispatch('element-modifying', {
            type: 'resize',
            data: rollbackProps,
          })

          this.action.dispatch('element-modify', [{
            id: this._resizingOperator!.id,
            props,
          }])
        }
          break

        case 'rotating': {
          const {shiftKey} = e
          const newRotation = Base.applyRotating.call(this, shiftKey)
          const {rotation} = this._rotatingOperator?.moduleOrigin!
          const rollbackProps: Partial<ElementProps> = {rotation}

          // rotate back
          this.action.dispatch('element-modifying', {
            type: 'resize',
            data: rollbackProps,
          })

          this.action.dispatch('element-modify', [{
            id: this._rotatingOperator!.id,
            props: {rotation: newRotation},
          }])
        }
          break

        case 'waiting':
          this.action.dispatch('selection-clear')
          break
        case 'static':
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            this.selection.toggle(draggingModules)
          } else {
            this.selection.replace(draggingModules)
          }

          break
      }

      draggingModules.clear()
      selectedShadow.clear()
      _selectingModules.clear()
      _selectingModules.clear()
      this.manipulationStatus = 'static'
      this.interaction._deselection = null
      this._resizingOperator = null

      updateSelectionBox(
        viewport.selectionBox,
        {x: 0, y: 0, width: 0, height: 0},
        false,
      )
    }

  },
}

export default rectangleTool