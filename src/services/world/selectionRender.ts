import {UID} from '~/core/core'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {ElementInstance} from '~/elements/elements'
import World from '~/services/world/World'

function selectionRender(this: World) {
  if (this.editor.elementManager.size === 0) return

  const {selectionCanvasContext: ctx} = this
  const fillColor = '#5491f8'
  const lineColor = '#5491f8'
  const selected = this.editor.visible.getVisibleSelected
  const centerPointWidth = 2 / this.scale * this.dpr
  const lineWidth = 1 / this.scale * this.dpr
  const centerPoints = new Set<UID>(selected)

  if (this.editor.interaction.hoveredModule) {
    centerPoints.add(this.editor.interaction.hoveredModule)
  }

  // render selection box for modules
  selected.forEach((id) => {
    const module = this.editor.elementManager.all.get(id)

    if (module) {
      const moduleSelectionBoundary = module.getSelectedBoxModule(lineWidth, lineColor)
      moduleSelectionBoundary.render(ctx)
    }
  })

  // render center points
  centerPoints.forEach((id) => {
    const module = this.editor.elementManager.all.get(id)
    const {cx, cy, rotation, layer} = (module as ElementRectangle).toMinimalJSON()
    const lineWidth = 1 / this.scale * this.dpr
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
      radius: id === this.editor.interaction.hoveredModule ? centerPointWidth : 0,
    })

    highlightModule!.render(ctx)
    centerDotRect.render(ctx)
  })

  this.editor.interaction.operationHandlers.forEach(operation => {
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