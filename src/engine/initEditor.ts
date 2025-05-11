import resetCanvas from './viewport/resetCanvas'
import {HistoryModuleChangeItem, ModuleModifyData, SelectionModifyData} from '~/services/actions/type'
import Editor from './editor'
import {redo} from '~/services/history/redo'
import {undo} from '~/services/history/undo'
import {pick} from '~/services/history/pick'
import {HistoryOperation} from '~/services/history/type'
// import {updateSelectionCanvasRenderData} from '../services/selection/helper'
// import zoom from '../../components/statusBar/zoom'
import {fitRectToViewport} from './viewport/helper'
import {Point} from '~/type'
import selector from '~/engine/tools/selector/selector'
import rectangle from '~/engine/tools/rectangle/rectangle'
import {ElementProps} from '~/elements/elements'

export function initEditor(this: Editor) {
  const {container, viewport, action} = this
  const dispatch = action.dispatch.bind(action)
  const on = action.on.bind(action)

  container.appendChild(viewport.wrapper)
  viewport.resizeObserver.observe(container)

  this.toolMap.set('selector', selector)
  this.toolMap.set('rectangle', rectangle)
  // this.toolMap.set('text', selector)
  // this.toolMap.set('ellipse', selector)

  on('world-resized', () => {
    this.updateViewport()

    if (!this.initialized) {
      this.initialized = true
      // dispatch('switch-tool', 'selector')
      dispatch('world-zoom', 'fit')
      dispatch('module-updated')
      this.events.onInitialized?.()
      this.events.onHistoryUpdated?.(this.history)
      this.events.onModulesUpdated?.(this.elementManager.all)
    } else {
      dispatch('world-updated')
    }
  })

  on('world-updated', () => {
    this.updateWorldRect()
    // console.log(this.viewport.scale, this.viewport.offset, this.viewport.worldRect)
    this.events.onViewportUpdated?.({
      width: this.viewport.viewportRect.width,
      height: this.viewport.viewportRect.height,
      scale: this.viewport.scale,
      offsetX: this.viewport.offset.x,
      offsetY: this.viewport.offset.y,
      status: this.manipulationStatus,
    })
    dispatch('visible-module-updated')
  })

  on('world-zoom', (arg) => {
    if (arg === 'fit') {
      const {width, height} = this.config.page
      const {viewportRect} = this.viewport
      const pageRect = {
        x: 0,
        y: 0,
        width,
        height,
      }
      const {scale, offsetX, offsetY} = fitRectToViewport(pageRect, viewportRect, 0.02)

      this.viewport.scale = scale
      this.viewport.offset.x = offsetX
      this.viewport.offset.y = offsetY

      dispatch('world-updated')
    } else {
      const {scale, dpr} = this.viewport
      let result = null
      let newScale = 1
      const minScale = 0.01 * dpr
      const maxScale = 500 * dpr
      let point = arg.physicalPoint

      if (arg.zoomTo) {
        newScale = arg.zoomFactor
      } else if (arg.zoomBy) {
        newScale = scale + arg.zoomFactor
      }

      // clamp
      newScale = Math.max(minScale, Math.min(newScale, maxScale))
      result = this.zoom(newScale, point)
// return
      // console.log(newScale)

      this.viewport.scale = newScale
      this.viewport.offset.x = result.x!
      this.viewport.offset.y = result.y!
      dispatch('world-updated')
    }
  })

  on('world-shift', (data) => {
    const {x, y} = data
    // console.log(x, y)
    const {dpr} = this.viewport
    this.viewport.offset.x += x * dpr
    this.viewport.offset.y += y * dpr
    dispatch('world-updated')
  })

  on('visible-module-updated', () => {
    this.updateVisibleElementMap()
    // this.updateSnapPoints()
    dispatch('render-modules')
    dispatch('visible-selection-updated')
  })

  on('visible-selection-updated', () => {
    this.updateVisibleSelected()
    dispatch('render-selection')
  })

  on('selection-all', () => {
    this.selection.selectAll()
    dispatch('selection-updated')
  })

  on('selection-clear', () => {
    this.selectedElementIDSet.clear()
    dispatch('selection-updated')
  })

  on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.selection.modify(idSet, mode)
    dispatch('selection-updated')
  })

  on('module-updated', (historyData: HistoryOperation) => {
    dispatch('visible-module-updated')
    dispatch('selection-updated')

    if (historyData) {
      this.history.add(historyData)
      this.events.onHistoryUpdated?.(this.history)
    }

    this.events.onModulesUpdated?.(this.elementManager.all)
  })

  on('selection-updated', () => {
    this.hoveredModule = null
    // console.log(this.selectedModules)
    // updateSelectionCanvasRenderData.call(this)
    this.events.onSelectionUpdated?.(this.selectedElementIDSet, this.selection.pickIfUnique)

    dispatch('visible-selection-updated')
  })

  on('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  on('drop-image', ({position, assets}) => {
    // console.log(data)
    const ox = position.x - this.viewport.rect!.x
    const oy = position.y - this.viewport.rect!.y
    const worldPoint = this.getWorldPointByViewportPoint(ox, oy)
    const modulePropsList = assets.map(asset => {
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

    dispatch('module-add', modulePropsList)
  })

  on('module-delete', () => {
    const savedSelected = this.selection.values
    const backup = this.elementManager.batchDelete(savedSelected)

    this.selectedElementIDSet.clear()

    dispatch('module-updated', {
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: savedSelected,
      },
    })
  })

  on('module-copy', () => {
    this.copiedItems = this.batchCopy(this.selection.values, false)
    this.updateCopiedItemsDelta()
    this.events.onModuleCopied?.(this.copiedItems)
  })

  on('module-paste', (position?) => {
    if (this.copiedItems.length === 0) return

    let newModules: elementMap

    if (position) {
      const {x, y} = this.getWorldPointByViewportPoint(position.x, position.y)
      const topLeftItem = this.copiedItems.reduce((prev, current) => {
        return (current.x < prev.x && current.y < prev.y) ? current : prev
      })
      const offsetX = x - topLeftItem.x
      const offsetY = y - topLeftItem.y

      const offsetItems = this.copiedItems.map((item) => {
        return {
          ...item,
          x: item.x + offsetX,
          y: item.y + offsetY,
        }
      })

      newModules = this.elementManager.batchCreate(offsetItems)
    } else {
      newModules = this.elementManager.batchCreate(this.copiedItems)
    }

    const savedSelected = new Set(newModules.keys())

    this.elementManager.batchAdd(newModules)
    this.selection.replace(savedSelected)
    this.updateCopiedItemsDelta()

    dispatch('module-updated', {
      type: 'history-paste',
      payload: {
        modules: [...newModules.values()].map((mod) => mod.getDetails()),
        selectedModules: savedSelected,
      },
    })
  })

  on('module-duplicate', () => {
    if (this.selectedElementIDSet.size === 0) return

    const temp: ElementProps[] = this.batchCopy(this.selectedElementIDSet, false)

    temp.forEach((copiedItem) => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
    })

    const newModules = this.elementManager.batchCreate(temp)
    const savedSelected = new Set(newModules.keys())

    this.elementManager.batchAdd(newModules)
    this.selection.replace(savedSelected)

    const moduleProps = [...newModules.values()].map((mod) => mod.toMinimalJSON())

    dispatch('module-updated', {
      type: 'history-duplicate',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })
  })

  on('module-layer', (data) => {
    console.log(data)
    /* const s = this.selection.getSelected

     if (s.size === 0) return
     const changes: ModuleModifyData[] = []

     s.forEach((id) => {
       const module = this.elementManager.all.get(id)
       if (module) {
         changes.push({
           id,
           props: {
             x: module.x + delta.x,
             y: module.y + delta.y,
           },
         })
       }
     })*/

    // this.batchMove(s, delta)
    // dispatch('module-modify', changes)
  })

  on('module-move', ({delta = {x: 0, y: 0}}) => {
    const s = this.selection.values

    if (s.size === 0) return
    const changes: ModuleModifyData[] = []

    s.forEach((id) => {
      const module = this.elementManager.all.get(id)
      if (module) {
        changes.push({
          id,
          props: {
            x: module.cx + delta.x,
            y: module.cy + delta.y,
          },
        })
      }
    })

    // this.batchMove(s, delta)
    dispatch('module-modify', changes)
  })

  on('module-add', (data) => {
    if (!data || data.length === 0) return

    const newModules = this.elementManager.batchAdd(this.elementManager.batchCreate(data), () => {
      console.log(9)
      dispatch('render-modules')
    })
    const savedSelected = new Set(newModules.keys())

    /*  this.elementManager.batchAdd(newModules,()=>{
        dispatch('render-modules')
      })*/
    this.selection.replace(savedSelected)

    const moduleProps = [...newModules.values()].map((mod) => mod.toMinimalJSON())

    dispatch('module-updated', {
      type: 'history-add',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })
  })

  on('module-modifying', ({type, data}) => {
    const s = this.selection.values

    if (s.size === 0) return

    if (type === 'move') {
      this.batchMove(s, data as Point)
    } else if (type === 'resize' || type === 'rotate') {
      this.elementManager.batchModify(s, data)
    }

    dispatch('module-updated')
  })

  on('module-modify', (data) => {
    const changes: HistoryModuleChangeItem[] = []
    // console.log(data)

    data.map(({id, props: kv}) => {
      const props = {}
      const change = {id, props}
      const module = this.elementManager.all.get(id)

      if (!module) return

      Object.keys(kv).map((keyName) => {
        const fromValue = module[keyName]
        const toValue = kv[keyName]
        // console.log(fromValue, toValue)
        return props[keyName] = {
          from: fromValue,
          to: toValue,
        }
      })
      this.elementManager.batchModify(new Set([id]), kv)
      changes.push(change)
    })

    this.history.add({
      type: 'history-modify',
      payload: {
        selectedModules: this.selection.values,
        changes,
      },
    })

    this.events.onHistoryUpdated?.(this.history)
    this.events.onModulesUpdated?.(this.elementManager.all)

    dispatch('module-updated')
  })

  on('render-modules', () => {
    resetCanvas(
      this.viewport.mainCTX,
      this.viewport.scale,
      this.viewport.offset,
      this.viewport.dpr,
    )

    this.renderModules()
  })

  on('render-selection', () => {
    resetCanvas(
      this.viewport.selectionCTX,
      this.viewport.scale,
      this.viewport.offset,
      this.viewport.dpr,
    )
    this.renderSelections()
  })

  on('module-hover-enter', (id) => {
    if (this.hoveredModule && id && this.hoveredModule === id) {
      return
    }

    // console.log(this.hoveredModule, id)

    this.hoveredModule = id
    dispatch('visible-selection-updated')
  })

  on('module-hover-leave', () => {
    this.hoveredModule = null
    dispatch('visible-selection-updated')
  })

  on('history-undo', () => {
    undo.call(this)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-redo', () => {
    redo.call(this)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-pick', (data) => {
    pick.call(this, data)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('context-menu', ({position}) => {
    this.events.onContextMenu?.(position)
  })

  on('switch-tool', (toolName) => {
    this.currentToolName = toolName
    this.events.onSwitchTool?.(toolName)
  })
}
