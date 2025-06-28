"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectHoveredModule = detectHoveredModule;
exports.applyResize = applyResize;
exports.getRotateAngle = getRotateAngle;
exports.getResizeCursor = getResizeCursor;
function detectHoveredModule() {
    const { viewport } = this;
    const worldPoint = this.getWorldPointByViewportPoint(viewport.mouseMovePoint.x, viewport.mouseMovePoint.y);
    // const maxLayer = Number.MIN_SAFE_INTEGER
    let moduleId = null;
    let hitOn = null;
    const arr = [...this.operationHandlers];
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].module.hitTest(worldPoint)) {
            hitOn = arr[i];
            break;
        }
    }
    if (hitOn) {
        this.action.dispatch('module-hover-enter', hitOn.id);
        return hitOn;
    }
    const arr2 = [...this.getVisibleModuleMap.values()];
    for (let i = arr2.length - 1; i >= 0; i--) {
        const module = arr2[i];
        const hitTest = module.hitTest(worldPoint);
        if (hitTest) {
            // console.log(hitTest)
            moduleId = module.id;
            break;
        }
    }
    if (this.hoveredModule !== moduleId) {
        if (this.hoveredModule) {
            this.action.dispatch('module-hover-leave', this.hoveredModule);
        }
        if (moduleId) {
            this.action.dispatch('module-hover-enter', moduleId);
        }
    }
}
function applyResize(altKey, shiftKey) {
    const { mouseDownPoint, mouseMovePoint, scale, dpr } = this.viewport;
    const { name: handleName, module: { rotation }, moduleOrigin, } = this._resizingOperator;
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
    const relatedModule = this.moduleMap.get(id);
    if (relatedModule) {
        const con = relatedModule.constructor;
        // console.log(resizeParam)
        return con.applyResizeTransform(resizeParam);
    } /*
    if (type === 'rectangle') {
      return Rectangle.applyResizeTransform(resizeParam)
    }*/
}
function getRotateAngle(centerPoint, mousePoint) {
    const dx = mousePoint.x - centerPoint.x;
    const dy = mousePoint.y - centerPoint.y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI);
    let normalizedAngle = angleDeg;
    if (normalizedAngle < 0)
        normalizedAngle += 360;
    return normalizedAngle;
}
function getResizeCursor(point, centerPoint) {
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
