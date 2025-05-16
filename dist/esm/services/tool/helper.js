export function applyRotating(shiftKey) {
    const { interaction, world } = this.editor;
    const { mouseStart, mouseCurrent, _rotatingOperator } = interaction;
    const { scale, dpr, offset } = world;
    const { element: { rotation }, elementOrigin } = _rotatingOperator;
    const { x, y } = elementOrigin;
    const startX = (mouseStart.x - offset.x / dpr) / scale * dpr;
    const startY = (mouseStart.y - offset.y / dpr) / scale * dpr;
    const currentX = (mouseCurrent.x - offset.x / dpr) / scale * dpr;
    const currentY = (mouseCurrent.y - offset.y / dpr) / scale * dpr;
    const startAngle = Math.atan2(startY - y, startX - x);
    const currentAngle = Math.atan2(currentY - y, currentX - x);
    let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI);
    if (shiftKey) {
        rotationDelta = Math.round(rotationDelta / 15) * 15;
    }
    let newRotation = (rotation + rotationDelta) % 360;
    if (newRotation < 0)
        newRotation += 360;
    return newRotation;
}
export function detectHoveredElement() {
    const { interaction, action, world, visible } = this.editor;
    const { baseCanvasContext: ctx, dpr } = world;
    /*const WP = world.getWorldPointByViewportPoint(
      interaction.mouseCurrent.x,
      interaction.mouseCurrent.y,
    )*/
    const WP = {
        x: interaction.mouseCurrent.x * dpr,
        y: interaction.mouseCurrent.y * dpr,
    };
    // const maxLayer = Number.MIN_SAFE_INTEGER
    let elementId = null;
    let hitOn = null;
    // const arr = [...interaction.operationHandlers]
    // console.log(worldPoint)
    const arr = visible.values;
    for (let i = arr.length - 1; i >= 0; i--) {
        const ele = arr[i];
        const path = ele.path2D;
        const border = ctx.isPointInStroke(path, WP.x, WP.y);
        const inside = ctx.isPointInPath(path, WP.x, WP.y);
        console.log(inside, border);
        /*  if (arr[i].element.hitTest(worldPoint)) {
            hitOn = arr[i]
            console.log(hitOn)
            break
          }*/
    }
    /*
  
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].element.hitTest(worldPoint)) {
          hitOn = arr[i]
          break
        }
      }
    */
    /*  if (hitOn) {
        action.dispatch('element-hover-enter', hitOn.id)
        // console.log(hitOn)
        return hitOn
      }
  
      const arr2 = visible.values
  
      for (let i = arr2.length - 1; i >= 0; i--) {
        const element = arr2[i]
        const hitTest = element.hitTest(worldPoint)
        if (hitTest) {
          elementId = element.id
          break
        }
      }*/
    if (interaction._hoveredElement !== elementId) {
        if (interaction._hoveredElement) {
            action.dispatch('element-hover-leave', interaction._hoveredElement);
        }
        if (elementId) {
            action.dispatch('element-hover-enter', elementId);
        }
    }
}
export function isPointNearStroke(ctx, path, point, tolerance = 1, baseLineWidth = 1) {
    ctx.save();
    ctx.lineWidth = baseLineWidth + tolerance * 2;
    const result = ctx.isPointInStroke(path, point.x, point.y);
    ctx.restore();
    return result;
}
