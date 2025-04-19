import {ModuleMap, ModuleProps} from '../core/modules/modules'
import History from './history/history'
import {RectangleProps} from '../core/modules/shapes/rectangle'
import {EditorConfig} from './editor'

export type ModuleMoveDirection =
  'module-move-up' |
  'module-move-down' |
  'module-move-left' |
  'module-move-right' |
  'module-move-shift'

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};

export interface ViewportData extends Size {
  offsetX: number
  offsetY: number
  scale: number
  // dx: number
  // dy: number
  status: string
}

export interface WorldInfo extends Size {
  offsetX: number
  offsetY: number
  scale: number
  dx: number
  dy: number
  status: string
}

export interface SnapPointData extends Point {
  id: UID,
  type: string
}

type InitializedHandler = () => void;
type HistoryUpdatedHandler = (history: History) => void;
type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;
type SelectionUpdatedHandler = (selected: Set<UID>, selectedProps?: ModuleProps) => void;
type ViewportUpdatedHandler = (viewportInfo: ViewportData) => void;
type WorldUpdatedHandler = (worldInfo: WorldInfo) => void;
type WorldMouseMoveUpdatedHandler = (point: Point) => void;
type ContextMenuHandler = (position: Point) => void;
type ModuleCopiedHandler = (p:ModuleProps[]) => void;

export declare type EventHandlers = {
  onInitialized?: InitializedHandler
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
  onViewportUpdated?: ViewportUpdatedHandler
  onWorldUpdated?: WorldUpdatedHandler
  onWorldMouseMove?: WorldMouseMoveUpdatedHandler
  onContextMenu?: ContextMenuHandler
  onModuleCopied?: ModuleCopiedHandler
}

interface EditorExportFileType {
  data: ModuleProps[]
  id: UID,
  config: EditorConfig
}