import {VisionEventData, VisionEventType} from './engine/actions/type'
import {ToolName} from './engine/tools/tool'
import {Unit} from './index'

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Rect = Size & Point
export type CenterBasedRect = Rect
export type BoundingRect = Size & Point & {
  top: number;
  bottom: number;
  left: number;
  right: number;
  cx: number;
  cy: number;
}
export type Resolution = Size
export type DPR = number
export type ZoomRatio = number

export type UnitType = Unit.MM | Unit.INCHES | Unit.PX | Unit.CM;
export type {VisionEventData, VisionEventType}
// export type {UID, HexColor}

export type * from './core/core.d'
export type * from './engine/assetsManager/asssetsManager'
export type {ToolName}