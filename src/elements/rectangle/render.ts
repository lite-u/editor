import RectangleLike from './rectangleLike'

function render(rect: RectangleLike, ctx: CanvasRenderingContext2D): void {
  let {cx, cy, show, width, height, rotation, opacity, fill, stroke, borderRadius} = rect.toJSON()
  const {enabled: enabledFill, color: fillColor} = fill
  const {enabled: enabledStroke, color: strokeColor, weight, join, dashed} = stroke
  // x = Math.round(x)
  // y = Math.round(y)
  // width = Math.round(width)
  // height = Math.round(height)
  // console.log(x, y, width, height)
  const LocalX = width / 2
  const LocalY = height / 2

  if (!show || opacity <= 0) return
  ctx.save()
  ctx.translate(cx, cy)

  if (rotation > 0) {
    ctx.rotate(rotation * Math.PI / 180)
  }

  if (enabledFill) {
    ctx.fillStyle = fillColor
  }

  if (opacity > 0) {
    ctx.fillStyle = fillColor as string
    ctx.globalAlpha = opacity / 100
  }

  if (enabledStroke && weight > 0) {
    ctx.lineWidth = weight
    ctx.strokeStyle = strokeColor
    ctx.lineJoin = join
    ctx.beginPath()

    if (dashed) {
      ctx.setLineDash([3, 5])
    }

    if (borderRadius.every(value => value > 0)) {

      ctx.moveTo(-LocalX + borderRadius[0], -LocalY)
      ctx.arcTo(LocalX, -LocalY, LocalX, LocalY, borderRadius[0])
      ctx.arcTo(LocalX, LocalY, -LocalX, LocalY, borderRadius[1])
      ctx.arcTo(-LocalX, LocalY, -LocalX, -LocalY, borderRadius[2])
      ctx.arcTo(-LocalX, -LocalY, LocalX, -LocalY, borderRadius[3])
      // Use arcTo for rounded corners
      /*  ctx.moveTo(-LocalX + borderRadius, -LocalY)
        ctx.arcTo(LocalX, -LocalY, LocalX, LocalY, borderRadius)
        ctx.arcTo(LocalX, LocalY, -LocalX, LocalY, borderRadius)
        ctx.arcTo(-LocalX, LocalY, -LocalX, -LocalY, borderRadius)
        ctx.arcTo(-LocalX, -LocalY, LocalX, -LocalY, borderRadius)*/
    } else {
      ctx.rect(-LocalX, -LocalY, width, height)
    }

    ctx.closePath()
    ctx.stroke()
  }

  if (enabledFill) {
    ctx.fill()
  }

  ctx.restore()
}

export default render