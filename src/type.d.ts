/**
 * Utility type for JSON standard types.
 */
export type JSONStandardType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
export type JSONPrimitiveValue = string | number | boolean | null;
export type JSONValue = JSONPrimitiveValue | JSONObject | JSONArray
export type JSONArray = JSONValue[];
export type JSONObject = Map<string, JSONValue>

export type TreeNode = {
  id: number;
  parentId: number | null;
};

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

export type {
  UID,
  HexColor,
  FillColor,
  Opacity,
  Rotation,
  Shadow,
  Gradient,
} from './core/type'

export type {
  InitializedHandler,
  HistoryUpdatedHandler,
  ModulesUpdatedHandler,
  SelectionUpdatedHandler,
  ViewportUpdatedHandler,
  WorldUpdatedHandler,
  WorldMouseMoveUpdatedHandler,
  ContextMenuHandler,
  ModuleCopiedHandler,
  EventHandlers,
  EditorExportFileType,
  ViewportData,
  WorldInfo,
  SnapPointData,
} from './main/type'