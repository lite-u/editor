export function detectHoveredElement() {
    const { interaction, action, world, visible } = this.editor;
    const worldPoint = world.getWorldPointByViewportPoint(interaction.mouseNow.x, interaction.mouseNow.y);
    // const maxLayer = Number.MIN_SAFE_INTEGER
    let elementId = null;
    let hitOn = null;
    const arr = [...interaction.operationHandlers];
    // console.log(worldPoint)
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].element.hitTest(worldPoint)) {
            hitOn = arr[i];
            break;
        }
    }
    if (hitOn) {
        action.dispatch('element-hover-enter', hitOn.id);
        // console.log(hitOn)
        return hitOn;
    }
    const arr2 = visible.values;
    for (let i = arr2.length - 1; i >= 0; i--) {
        const element = arr2[i];
        const hitTest = element.hitTest(worldPoint);
        if (hitTest) {
            elementId = element.id;
            break;
        }
    }
    if (interaction.hoveredElement !== elementId) {
        if (interaction.hoveredElement) {
            action.dispatch('element-hover-leave', interaction.hoveredElement);
        }
        if (elementId) {
            action.dispatch('element-hover-enter', elementId);
        }
    }
}
/*

export function applyResize(this: ToolManager, altKey: boolean, shiftKey: boolean) {
  const {elementManager, interaction, world} = this.editor
  const {mouseStart, mouseMove, _resizingOperator} = interaction
  const {scale, dpr} = world
  const {
    name: handleName,
    element: {rotation},
    elementOrigin,
  } = _resizingOperator!
  const {id} = elementOrigin
  const resizeParam = {
    downPoint: mouseStart,
    movePoint: mouseMove,
    dpr,
    scale,
    rotation,
    handleName,
    altKey,
    shiftKey,
    elementOrigin,
  }

  const relatedElement = elementManager.all.get(id)

  if (relatedElement) {
    // @ts-ignore
    const con = relatedElement.constructor as ElementInstance
    // console.log(resizeParam)
    // @ts-ignore
    return con.applyResizeTransform(resizeParam)
  }/!*
  if (type === 'rectangle') {
    return Rectangle.applyResizeTransform(resizeParam)
  }*!/
}
*/
export function getRotateAngle(centerPoint, mousePoint) {
    const dx = mousePoint.x - centerPoint.x;
    const dy = mousePoint.y - centerPoint.y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI);
    let normalizedAngle = angleDeg;
    if (normalizedAngle < 0)
        normalizedAngle += 360;
    return normalizedAngle;
}
export function getResizeCursor(point, centerPoint) {
    const angle = getRotateAngle(centerPoint, point);
    if ((angle >= 337.5 && angle <= 360) || (angle >= 0 && angle < 22.5))
        return 'e';
    if (angle >= 22.5 && angle < 67.5)
        return 'se';
    if (angle >= 67.5 && angle < 112.5)
        return 's';
    if (angle >= 112.5 && angle < 157.5)
        return 'sw';
    if (angle >= 157.5 && angle < 202.5)
        return 'w';
    if (angle >= 202.5 && angle < 247.5)
        return 'nw';
    if (angle >= 247.5 && angle < 292.5)
        return 'n';
    if (angle >= 292.5 && angle < 337.5)
        return 'ne';
    return 'e'; // fallback
}
