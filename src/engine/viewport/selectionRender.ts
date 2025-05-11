import Editor from '../editor'
import {UID} from '~/core/core'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {ElementInstance} from '~/elements/elements'

function selectionRender(this: Editor) {
  if (this.elementMap.size === 0) return

  const {selectionCTX: ctx} = this.viewport
  const fillColor = '#5491f8'
  const lineColor = '#5491f8'
  const selected = this.getVisibleSelected
  const centerPointWidth = 2 / this.viewport.scale * this.viewport.dpr
  const lineWidth = 1 / this.viewport.scale * this.viewport.dpr
  const centerPoints = new Set<UID>(selected)

  if (this.hoveredModule) {
    centerPoints.add(this.hoveredModule)
  }

  // render selection box for modules
  selected.forEach((id) => {
    const module = this.elementMap.get(id)

    if (module) {
      const moduleSelectionBoundary = module.getSelectedBoxModule(lineWidth, lineColor)
      moduleSelectionBoundary.render(ctx)
    }
  })

  // render center points
  centerPoints.forEach((id) => {
    const module = this.elementMap.get(id)
    const {cx, cy, rotation, layer} = (module as ElementRectangle).toMinimalJSON()
    const lineWidth = 1 / this.viewport.scale * this.viewport.dpr
    const highlightModule = module!.getHighlightModule(lineWidth, fillColor) as ElementInstance
    const centerDotRect = new ElementRectangle({
      cx: cx,
      cy: cy,
      layer,
      id: id + 'hover-center',
      width: centerPointWidth * 2,
      height: centerPointWidth * 2,
      fillColor: fillColor,
      lineColor: 'transparent',
      lineWidth,
      rotation,
      opacity: 100,
      radius: id === this.hoveredModule ? centerPointWidth : 0,
    })

    highlightModule!.render(ctx)
    centerDotRect.render(ctx)
  })

  this.operationHandlers.forEach(operation => {
    operation.module.render(ctx)
  })

  /*if (this.viewport.enableCrossLine && this.viewport.drawCrossLine) {
    drawCrossLine({
      ctx,
      mousePoint: mouseMovePoint,
      scale,
      dpr,
      offset,
      worldRect: worldRect,
    })
  }*/
}

export default selectionRender