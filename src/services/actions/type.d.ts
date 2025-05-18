import {SelectionActionMode} from '../selection/type'
import {HistoryNode} from '~/services/history/DoublyLinkedList'
// import {ElementMoveDirection} from '../type'
import {HistoryOperation} from '~/services/history/type'
import {ElementProps, ElementPropsWithoutIdentifiers} from '~/elements/type'
import {VisionEditorAssetType} from '~/services/assets/AssetsManager'
import {Point} from '~/type'
import {ToolName} from '~/services/tool/toolManager'

export interface SelectionModifyData {
  mode: SelectionActionMode;
  idSet: Set<UID>;
}

export type VisionEventType = keyof VisionEventMap;
export type VisionEventData<T extends VisionEventType> = VisionEventMap[T];

export type ElementMoveData = {
  idSet?: Set<UID>;
  // direction: ElementMoveDirection;
  delta: Point;
};

export type PropMoveOffset = {
  offset: number
}
export type PropChange<T> = {
  from: T
  to: T
}

/*export type ElementChangeProps = {
  [K in keyof ElementProps]?: PropChange<ElementProps[K]> | PropMoveOffset
}*/
export type HistoryChangeItem = {
  id: UID
  props: HistoryChangeProps
}

export type HistoryChangeProps = {
  // [K in keyof ElementProps]?: PropChange<ElementProps[K]>
  [K in keyof ElementProps]?: {
    from: ElementProps[K]
    to: ElementProps[K]
  }
}

export interface ElementModifyData {
  id: UID
  props: ElementProps
}

export type VisionEventMap = {
  // 'editor-initialized': never;
  'world-resized': null;
  'world-mouse-down': never;
  'world-mouse-move': never;
  'world-updated': never;
  'world-zoom': 'fit' | {
    zoomBy?: boolean
    zoomTo?: boolean
    zoomFactor: number;
    physicalPoint?: Point;
  };
  'world-shift': Point;
  'render-elements': boolean;
  'render-overlay': never;
  'clear-creation': never;
  'selection-updated': never
  'selection-modify': SelectionModifyData;
  'selection-clear': never;
  'selection-all': never;
  'drop-image': { position: Point, assets: VisionEditorAssetType[] };
  'element-updated': HistoryOperation;
  'element-copy': never;
  'element-add': ElementPropsWithoutIdentifiers[];
  'element-paste': Point;
  'element-delete': never;
  'element-duplicate': never;
  'element-layer': { method: 'up' | 'down' | 'top' | 'bottom', idSet: Set<UID> };
  'element-move-up': never;
  'element-move-right': never;
  'element-move-down': never;
  'element-move-left': never;
  'element-move': ElementMoveData;
  'element-modify': HistoryChangeItem[]
  'element-modifying': {
    type: 'move' | 'resize' | 'rotate',
    data: Partial<ElementProps>
  }
  'element-hover-enter': UID;
  'element-hover-leave': UID;
  'visible-element-updated': never;
  'visible-selection-updated': never;
  'history-redo': never;
  'history-undo': never;
  'history-pick': HistoryNode;
  'switch-tool': ToolName;
  'context-menu': {
    idSet: Set<UID>;
    position: Position;
    copiedItems: boolean
  };
}

const forwardEventDependencyMap: Record<VisionEventType, VisionEventType[]> = {
  'world-resized': ['world-updated'],
  // 'editor-initialized': ['world-updated'],
  'world-updated': ['visible-element-updated'],
  'world-zoom': ['world-updated'],
  'world-shift': ['world-updated'],
  /* selections */
  'selection-all': ['selection-updated'],
  'selection-clear': ['selection-updated'],
  'selection-modify': ['selection-updated'],
  'selection-updated': ['visible-selection-updated'],
  'visible-selection-updated': ['render-overlay'],
  'render-overlay': [],
  'element-hover-enter': ['visible-selection-updated'],
  'element-hover-leave': ['visible-selection-updated'],
  /* elements */
  'element-add': ['element-updated'],
  'element-delete': ['element-updated'],
  'element-move': ['element-updated'],
  'element-paste': ['element-updated'],
  'element-duplicate': ['element-updated'],
  'element-modifying': ['element-updated'],
  'element-modify': ['element-updated'],
  'element-updated': ['visible-element-updated', 'selection-updated'],
  'visible-element-updated': ['render-elements', 'visible-selection-updated'],
  'render-elements': [],
  'context-menu': [],
  'element-copy': [],
  /* history */
  'history-undo': ['element-updated'],
  'history-redo': ['element-updated'],
  'history-pick': ['element-updated'],
} as const
