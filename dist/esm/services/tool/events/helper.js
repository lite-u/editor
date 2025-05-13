export function detectHoveredModule() {
    const { interaction, action, world, visible } = this.editor;
    const worldPoint = world.getWorldPointByViewportPoint(interaction.mouseMovePoint.x, interaction.mouseMovePoint.y);
    // const maxLayer = Number.MIN_SAFE_INTEGER
    let moduleId = null;
    let hitOn = null;
    const arr = [...interaction.operationHandlers];
    // console.log(worldPoint)
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].module.hitTest(worldPoint)) {
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
        const module = arr2[i];
        const hitTest = module.hitTest(worldPoint);
        if (hitTest) {
            moduleId = module.id;
            break;
        }
    }
    if (interaction.hoveredModule !== moduleId) {
        if (interaction.hoveredModule) {
            action.dispatch('element-hover-leave', interaction.hoveredModule);
        }
        if (moduleId) {
            action.dispatch('element-hover-enter', moduleId);
        }
    }
}
export function applyResize(altKey, shiftKey) {
    const { elementManager, interaction, world } = this.editor;
    const { mouseDownPoint, mouseMovePoint, _resizingOperator } = interaction;
    const { scale, dpr } = world;
    const { name: handleName, module: { rotation }, moduleOrigin, } = _resizingOperator;
    const { id } = moduleOrigin;
    const resizeParam = {
        downPoint: mouseDownPoint,
        movePoint: mouseMovePoint,
        dpr,
        scale,
        rotation,
        handleName,
        altKey,
        shiftKey,
        moduleOrigin,
    };
    const relatedModule = elementManager.all.get(id);
    if (relatedModule) {
        // @ts-ignore
        const con = relatedModule.constructor;
        // console.log(resizeParam)
        // @ts-ignore
        return con.applyResizeTransform(resizeParam);
    } /*
    if (type === 'rectangle') {
      return Rectangle.applyResizeTransform(resizeParam)
    }*/
}
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
