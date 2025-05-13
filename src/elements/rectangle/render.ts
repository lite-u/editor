import RectangleLike from './rectangleLike'

function render(rect: RectangleLike, ctx: CanvasRenderingContext2D): void {
  let {cx, cy, width, height, rotation, opacity, fill, stroke, borderRadius} = rect.toJSON()
  const {enabled: enabledFill, color: fillColor} = fill
  const {enabled: enabledStroke, color: strokeColor, weight, join, dashed, cap} = stroke

  // x = Math.round(x)
  // y = Math.round(y)
  // width = Math.round(width)
  // height = Math.round(height)
  // console.log(x, y, width, height)
  const LocalX = width / 2
  const LocalY = height / 2

  if (opacity <= 0) return
  // Save current context state to avoid transformations affecting other drawings
  ctx.save()

  // Move context to the rectangle's center (Direct center point at x, y)
  ctx.translate(cx, cy)

  // Apply rotation if needed
  if (rotation! > 0) {
    ctx.rotate(rotation! * Math.PI / 180)
  }

  // Apply fill style if enabled
  if (opacity > 0 && enabledFill) {
    ctx.fillStyle = fillColor as string
    ctx.globalAlpha = opacity / 100 // Set the opacity
  }

  // Apply stroke style if enabled
  if (
    weight > 0
  ) {
    ctx.lineWidth = weight
    ctx.strokeStyle = strokeColor
    ctx.lineJoin = join
  }

  // return
  // Draw a rounded rectangle or regular rectangle
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
    // For square/rectangular modules with no rounded corners
    ctx.rect(-LocalX, -LocalY, width, height)
  }
  ctx.closePath()

  // Fill if enabled
  if (opacity > 0) {
    ctx.fill()
  }

  // Stroke if enabled
  if (lineWidth > 0) {
    ctx.stroke()
  }

  /*   if (gradient) {
       // Implement gradient rendering (as needed)
     }*/

  // Restore the context to avoid affecting subsequent drawings
  ctx.restore()
}

export default render