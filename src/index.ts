import {HexColor, UID} from './core/core'
import {VisionEventData, VisionEventType} from './engine/actions/type'
import Editor from './engine/editor'
import nid from './lib/nid'

export {
  Editor,
  nid,
}

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

export enum Unit {
  MM = 'mm',
  INCHES = 'inches',
  PX = 'px',
  CM = 'cm'
}

export type {VisionEventData, VisionEventType}
export type {UID, HexColor}