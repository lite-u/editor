import ElementRectangle from '~/elements/rectangle/rectangle'
import {ElementInstance} from '~/elements/type'
import World from '~/services/world/World'
import {BorderRadius} from '~/elements/props'
import {DEFAULT_FILL, DEFAULT_STROKE} from '~/elements/defaultProps'
import {UID} from '~/type'
import {PointHit} from '~/services/interaction/InteractionState'

function selectionRender(this: World) {
  if (this.editor.elementManager.size === 0) return
  const {overlayCanvasContext: ctx} = this
  const PH = this.editor.interaction._pointHit
  const {scale, dpr} = this.editor.world
  const ratio = scale * dpr
  const size = 6 / ratio
  const lineWidth = 1 / ratio
  const fontSize = 40 / ratio

  if (PH) {
    console.log(PH)
    drawCrossWithLabel(ctx, PH, size, '#ff0000', lineWidth, fontSize)
  }

  return
  const fillColor = '#5491f8'
  const lineColor = '#5491f8'
  const selected = this.editor.visible.getVisibleSelected
  const centerPointWidth = 2 / this.scale * this.dpr
  // const lineWidth = 1 / this.scale * this.dpr
  const centerPoints = new Set<UID>(selected)

  if (this.editor.interaction._hoveredElement) {
    centerPoints.add(this.editor.interaction._hoveredElement)
  }

  // render selection box for elements
  selected.forEach((id) => {
    const ele = this.editor.elementManager.all.get(id)

    if (ele) {
      const elementSelectionBoundary = ele.getSelectedBoxElement(lineWidth, lineColor)
      elementSelectionBoundary.render(ctx)
    }
  })

  // render center points
  centerPoints.forEach((id) => {
    const element = this.editor.elementManager.all.get(id)
    const {cx, cy, rotation, layer} = (element as ElementRectangle).toMinimalJSON()
    const lineWidth = 1 / this.scale * this.dpr
    const highlightElement = element!.getHighlightElement(lineWidth, fillColor) as ElementInstance
    const BRN = id === this.editor.interaction._hoveredElement ? centerPointWidth : 0
    const borderRadius: BorderRadius = [BRN, BRN, BRN, BRN]
    const centerDotRect = new ElementRectangle({
      cx: cx,
      cy: cy,
      layer,
      id: id + 'hover-center',
      width: centerPointWidth * 2,
      height: centerPointWidth * 2,
      fill: {
        ...DEFAULT_FILL,
        color: fillColor,
      },
      stroke: {
        ...DEFAULT_STROKE,
        weight: lineWidth,
        color: 'transparent',
      },
      rotation,
      borderRadius,
    })

    highlightElement!.render(ctx)
    centerDotRect.render(ctx)
  })

  this.editor.interaction.operationHandlers.forEach(operation => {
    operation.element.render(ctx)
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

function drawCrossWithLabel(
  ctx: CanvasRenderingContext2D,
  {x, y, type}: PointHit,
  size = 6,
  color = 'red',
  lineWidth = 1,
  fontSize: number,
  // font = '12px sans-serif',
) {
  // const {x, y} = point
  const half = size / 2

  ctx.save()

  // Draw the cross
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  ctx.beginPath()
  ctx.moveTo(x - half, y - half)
  ctx.lineTo(x + half, y + half)

  ctx.moveTo(x + half, y - half)
  ctx.lineTo(x - half, y + half)

  ctx.stroke()

  // Draw the label
  ctx.fillStyle = color
  ctx.font = fontSize + 'px sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(type, x + 10, y - 10)

  ctx.restore()
}

export default selectionRender