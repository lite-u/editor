import {ResizeDirection} from '../../selection/type'
import {Point, UID} from '~/type'
import {ElementInstance} from '~/elements/elements'
import ToolManager from '~/services/tools/toolManager'

export function detectHoveredModule(this: ToolManager) {
  const {interaction, action, world, visible} = this.editor
  const worldPoint = world.getWorldPointByViewportPoint(
    interaction.mouseMovePoint.x,
    interaction.mouseMovePoint.y,
  )
  // const maxLayer = Number.MIN_SAFE_INTEGER
  let moduleId: UID | null = null
  let hitOn = null
  const arr = [...interaction.operationHandlers]
  // console.log(worldPoint)

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].module.hitTest(worldPoint)) {
      hitOn = arr[i]
      break
    }
  }

  if (hitOn) {
    action.dispatch('element-hover-enter', hitOn.id)
    // console.log(hitOn)
    return hitOn
  }

  const arr2 = visible.values

  for (let i = arr2.length - 1; i >= 0; i--) {
    const module = arr2[i]
    const hitTest = module.hitTest(worldPoint)
    if (hitTest) {
      moduleId = module.id
      break
    }
  }

  if (interaction.hoveredModule !== moduleId) {
    if (interaction.hoveredModule) {
      action.dispatch('element-hover-leave', interaction.hoveredModule)
    }

    if (moduleId) {
      action.dispatch('element-hover-enter', moduleId)
    }
  }
}

export function applyResize(this: ToolManager, altKey: boolean, shiftKey: boolean) {
  const {elementManager, interaction, world} = this.editor
  const {mouseDownPoint, mouseMovePoint, _resizingOperator} = interaction
  const {scale, dpr} = world
  const {
    name: handleName,
    module: {rotation},
    moduleOrigin,
  } = _resizingOperator!
  const {id} = moduleOrigin
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
  }

  const relatedModule = elementManager.all.get(id)

  if (relatedModule) {
    // @ts-ignore
    const con = relatedModule.constructor as ElementInstance
    // console.log(resizeParam)
    // @ts-ignore
    return con.applyResizeTransform(resizeParam)
  }/*
  if (type === 'rectangle') {
    return Rectangle.applyResizeTransform(resizeParam)
  }*/
}

export function getRotateAngle(centerPoint: Point, mousePoint: Point) {
  const dx = mousePoint!.x - centerPoint.x
  const dy = mousePoint!.y - centerPoint.y
  const angleRad = Math.atan2(dy, dx)
  const angleDeg = angleRad * (180 / Math.PI)
  let normalizedAngle = angleDeg
  if (normalizedAngle < 0) normalizedAngle += 360
  return normalizedAngle
}

export function getResizeCursor(point: Point, centerPoint: Point): ResizeDirection {
  const angle = getRotateAngle(centerPoint, point)

  if ((angle >= 337.5 && angle <= 360) || (angle >= 0 && angle < 22.5)) return 'e' as ResizeDirection
  if (angle >= 22.5 && angle < 67.5) return 'se' as ResizeDirection
  if (angle >= 67.5 && angle < 112.5) return 's' as ResizeDirection
  if (angle >= 112.5 && angle < 157.5) return 'sw' as ResizeDirection
  if (angle >= 157.5 && angle < 202.5) return 'w' as ResizeDirection
  if (angle >= 202.5 && angle < 247.5) return 'nw' as ResizeDirection
  if (angle >= 247.5 && angle < 292.5) return 'n' as ResizeDirection
  if (angle >= 292.5 && angle < 337.5) return 'ne' as ResizeDirection

  return 'e' as ResizeDirection // fallback
}