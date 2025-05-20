import resetCanvas from '~/services/world/resetCanvas'
import {HistoryChangeItem, SelectionModifyData} from '~/services/actions/type'
import Editor from './editor'
import {redo} from '~/services/history/redo'
import {undo} from '~/services/history/undo'
import {pick} from '~/services/history/pick'
import {HistoryOperation} from '~/services/history/type'
// import {updateSelectionCanvasRenderData} from '../services/selection/helper'
// import zoom from '../../components/statusBar/zoom'
import {fitRectToViewport} from '~/services/world/helper'
import {Point, ToolName} from '~/type'
import {ElementMap, ElementProps} from '~/elements/type'
import snapTool from '~/services/tool/snap/snap'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'

export function initEvents(this: Editor) {
  const {action} = this
  const dispatch = action.dispatch.bind(action)
  const on = action.on.bind(action)
  // const {on, dispatch} = this.action

  // container.appendChild(viewport.wrapper)

  // this.toolMap.set('text', selector)
  // this.toolMap.set('ellipse', selector)

  on('world-resized', () => {
    this.updateViewport()

    if (!this.initialized) {
      this.initialized = true
      // dispatch('switch-tool', 'selector')
      dispatch('world-zoom', 'fit')
      dispatch('element-updated')
      this.events.onInitialized?.()
      this.events.onHistoryUpdated?.(this.history)
      this.events.onElementsUpdated?.(this.elementManager.all)
    } else {
      dispatch('world-updated')
    }
  })

  on('world-updated', () => {
    this.world.updateWorldRect()
    dispatch('visible-element-updated')
  })

  on('world-zoom', (arg) => {
    if (arg === 'fit') {
      const {width, height} = this.config.page
      const {viewportRect} = this
      const pageRect = {
        x: 0,
        y: 0,
        width,
        height,
      }
      const {scale, offsetX, offsetY} = fitRectToViewport(pageRect, viewportRect, 0.02)

      this.world.scale = scale
      this.world.offset.x = offsetX
      this.world.offset.y = offsetY
      this.events.onZoomed?.(scale)
      dispatch('world-updated')
      return
    }

    const {scale, dpr} = this.world
    let result = null
    let newScale = 1
    // const minScale = 0.01 * dpr
    // const maxScale = 500 * dpr
    let point = arg.physicalPoint

    if (arg.zoomTo) {
      newScale = arg.zoomFactor
    } else if (arg.zoomBy) {
      newScale = scale + arg.zoomFactor
    }

    // clamp
    // newScale = Math.max(minScale, Math.min(newScale, maxScale))
    result = this.world.zoom(newScale, point)

    this.world.scale = newScale
    this.world.offset.x = result.x!
    this.world.offset.y = result.y!
    this.events.onZoomed?.(newScale)
    dispatch('world-updated')

  })

  on('world-shift', (data) => {
    const {x, y} = data
    // console.log(x, y)
    const {dpr} = this.world
    this.world.offset.x += x * dpr
    this.world.offset.y += y * dpr
    dispatch('world-updated')
  })

  on('visible-element-updated', () => {
    this.visible.updateVisibleElementMap()
    // this.updateSnapPoints()
    dispatch('render-elements')
    dispatch('visible-selection-updated')
  })

  on('visible-selection-updated', () => {
    this.visible.updateVisibleSelected()
    dispatch('render-overlay')
  })

  on('selection-all', () => {
    this.selection.selectAll()
    dispatch('selection-updated')
  })

  on('selection-clear', () => {
    this.selection.clear()
    dispatch('selection-updated')
  })

  on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.selection.modify(idSet, mode)
    dispatch('selection-updated')
  })

  on('element-updated', (historyData: HistoryOperation) => {
    dispatch('visible-element-updated')
    dispatch('selection-updated')

    if (historyData) {
      this.history.add(historyData)
      this.events.onHistoryUpdated?.(this.history)
    }

    this.events.onElementsUpdated?.(this.elementManager.all)
  })

  on('selection-updated', () => {
    this.interaction._hoveredElement = null!
    this.interaction.updateControlPoints()

    // getAnchorsByBoundingRect()
    this.events.onSelectionUpdated?.(this.selection.values, this.selection.pickIfUnique)

    dispatch('visible-selection-updated')
  })

  on('world-mouse-move', () => {
    const p = this.world.getWorldPointByViewportPoint(
      this.interaction.mouseCurrent.x,
      this.interaction.mouseCurrent.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  on('drop-image', ({position, assets}) => {
    // console.log(data)
    const ox = position.x - this.rect!.x
    const oy = position.y - this.rect!.y
    const worldPoint = this.world.getWorldPointByViewportPoint(ox, oy)
    const elementPropsList = assets.map(asset => {
      const {width, height} = asset.imageRef!

      this.assetsManager.add(asset)

      return {
        type: 'image',
        enableLine: false,
        src: asset.id,
        x: worldPoint.x,
        y: worldPoint.y,
        width,
        height,
      }
    })

    dispatch('element-add', elementPropsList)
  })

  on('element-delete', () => {
    const savedSelected = this.selection.values
    const backup = this.elementManager.batchDelete(savedSelected)

    this.selection.clear()

    dispatch('element-updated', {
      type: 'history-delete',
      payload: {
        elements: backup,
        selectedElements: savedSelected,
      },
    })
  })

  on('element-copy', () => {
    this.clipboard.copiedItems = this.elementManager.batchCopy(this.selection.values, false)
    // this.clipboard.updateCopiedItemsDelta()
    this.events.onElementCopied?.(this.clipboard.copiedItems)
  })

  on('element-paste', (position?) => {
    if (this.clipboard.copiedItems.length === 0) return

    let newElements: ElementMap = this.elementManager.batchCreate(this.clipboard.copiedItems)

    if (position) {
      const {x, y} = this.world.getWorldPointByViewportPoint(position.x, position.y)
      const rect = [...newElements.values()].map(ele => ele.getBoundingRect())
      const {cx, cy} = getBoundingRectFromBoundingRects(rect)
      const offsetX = x - cx
      const offsetY = y - cy

      ;[...newElements.values()].map(ele => ele.translate(offsetX, offsetY))
      console.log(cx, cy)
      console.log(newElements)
      // get group center and calculate target to center distance
      /*
       const {x, y} = this.world.getWorldPointByViewportPoint(position.x, position.y)
       const topLeftItem = this.clipboard.copiedItems.reduce((prev, current) => {
         return (current.x < prev.x && current.y < prev.y) ? current : prev
       })
       const offsetX = x - topLeftItem.x
       const offsetY = y - topLeftItem.y

       const offsetItems = this.clipboard.copiedItems.map((item) => {
         return {
           ...item,
           x: item.x + offsetX,
           y: item.y + offsetY,
         }
       })

       newElements = this.elementManager.batchCreate(offsetItems)*/
    } else {
      newElements = this.elementManager.batchCreate(this.clipboard.copiedItems)
    }

    const savedSelected = new Set(newElements.keys())

    this.elementManager.batchAdd(newElements)
    this.selection.replace(savedSelected)
    // this.clipboard.updateCopiedItemsDelta()

    dispatch('element-updated', {
      type: 'history-paste',
      payload: {
        elements: [...newElements.values()].map((mod) => mod.toMinimalJSON()),
        selectedElements: savedSelected,
      },
    })
  })

  on('element-duplicate', () => {
    if (this.selection.size === 0) return

    const temp: ElementProps[] = this.elementManager.batchCopy(this.selection.values, false)

    temp.forEach((copiedItem) => {
      copiedItem!.x += this.clipboard.CopyDeltaX
      copiedItem!.y += this.clipboard.CopyDeltaY
    })

    const newElements = this.elementManager.batchCreate(temp)
    const savedSelected = new Set(newElements.keys())

    this.elementManager.batchAdd(newElements)
    this.selection.replace(savedSelected)

    const elementProps = [...newElements.values()].map((mod) => mod.toMinimalJSON())

    dispatch('element-updated', {
      type: 'history-duplicate',
      payload: {
        elements: elementProps,
        selectedElements: savedSelected,
      },
    })
  })

  on('element-layer', (data) => {
    console.log(data)
    /* const s = this.selection.getSelected

     if (s.size === 0) return
     const changes: ElementModifyData[] = []

     s.forEach((id) => {
       const element = this.elementManager.all.get(id)
       if (element) {
         changes.push({
           id,
           props: {
             x: element.x + delta.x,
             y: element.y + delta.y,
           },
         })
       }
     })*/

    // this.batchMove(s, delta)
    // dispatch('element-modify', changes)
  })

  on('element-move-up', () => dispatch('element-move', {delta: {x: 0, y: -10}}))
  on('element-move-right', () => dispatch('element-move', {delta: {x: 10, y: 0}}))
  on('element-move-down', () => dispatch('element-move', {delta: {x: 0, y: 10}}))
  on('element-move-left', () => dispatch('element-move', {delta: {x: -10, y: 0}}))

  on('element-move', ({delta = {x: 0, y: 0}}) => {
    const s = this.selection.values

    if (s.size === 0) return
    const changes: HistoryChangeItem[] = []

    s.forEach((id) => {
      const ele = this.elementManager.all.get(id)
      if (ele) {
        const change = ele.translate(delta.x, delta.y, true)

        ele.updateOriginal()
        changes.push(change)
      }
    })

    // this.batchMove(s, delta)
    dispatch('element-modify', changes)
  })

  on('element-moving', ({delta = {x: 0, y: 0}}) => {
    this.selection.values.forEach((id) => {
      const ele = this.elementManager.all.get(id)

      if (ele) {
        ele.translate(delta.x, delta.y)
        ele.updatePath2D()
      }
    })

    dispatch('element-updated')
  })

  on('element-add', (data) => {
    if (!data || data.length === 0) return

    const newElements = this.elementManager.batchAdd(this.elementManager.batchCreate(data), () => {
      // console.log(9)
      dispatch('render-elements')
    })
    const savedSelected = new Set(newElements.keys())
    // console.log(newElements)
    /*  this.elementManager.batchAdd(newElements,()=>{
        dispatch('render-elements')
      })*/
    this.selection.replace(savedSelected)

    const elementProps = [...newElements.values()].map((mod) => mod.toMinimalJSON())

    dispatch('element-updated', {
      type: 'history-add',
      payload: {
        elements: elementProps,
        selectedElements: savedSelected,
      },
    })
  })

  on('element-modifying', ({type, data}) => {
    const s = this.selection.values

    if (s.size === 0) return

    if (type === 'move') {
      this.elementManager.batchMove(s, data as Point)
    } else if (type === 'resize' || type === 'rotate') {
      this.elementManager.batchModify(s, data)
    }

    dispatch('element-updated')
  })

  on('element-modify', (changes) => {
    this.history.add({
      type: 'history-modify',
      payload: {
        selectedElements: this.selection.values,
        changes,
      },
    })

    this.events.onHistoryUpdated?.(this.history)
    this.events.onElementsUpdated?.(this.elementManager.all)

    dispatch('element-updated')
  })

  on('render-elements', () => {
    resetCanvas(
      this.world.baseCanvasContext,
      this.world.scale,
      this.world.offset,
      this.world.dpr,
    )

    this.world.renderElements()
  })

  on('render-overlay', () => {
    resetCanvas(
      this.world.overlayCanvasContext,
      this.world.scale,
      this.world.offset,
      this.world.dpr,
    )
    this.world.renderOverlay()
  })

  on('clear-creation', () => {
    resetCanvas(
      this.world.creationCanvasContext,
      this.world.scale,
      this.world.offset,
      this.world.dpr,
    )
    // this.world.renderOverlay()
  })

  on('element-hover-enter', (id) => {
    if (this.interaction._hoveredElement && id && this.interaction._hoveredElement === id) {
      return
    }

    // console.log(this.hoveredElement, id)

    this.interaction._hoveredElement = id
    dispatch('visible-selection-updated')
  })

  on('element-hover-leave', () => {
    this.interaction._hoveredElement = null!
    dispatch('visible-selection-updated')
  })

  on('history-undo', () => {
    undo.call(this)
    dispatch('element-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-redo', () => {
    redo.call(this)
    dispatch('element-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-pick', (data) => {
    pick.call(this, data)
    dispatch('element-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('context-menu', ({position}) => {
    this.events.onContextMenu?.(position)
  })

  on('switch-tool', (toolName: ToolName) => {
    let noSnap = toolName === 'zoomIn' || toolName === 'zoomOut' || toolName === 'panning'

    if (noSnap) {
      this.interaction._snappedPoint = null
      this.interaction._hoveredElement = null
    } else {
      snapTool.call(this.toolManager)
    }

    this.toolManager.set(toolName)
    action.dispatch('render-overlay')

    // this.toolManager.currentToolName = toolName
    this.events.onSwitchTool?.(toolName)
    console.log(toolName)
  })

}
