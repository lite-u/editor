
import {SelectionActionMode} from '../selection/type'
import {HistoryNode} from '../history/DoublyLinkedList'
import {HistoryOperation} from '../history/type'
import {ModuleProps, PropsWithoutIdentifiersA} from '../../core/modules/modules'
import {UID} from '../../core/core'
import {Point} from '../../type'

export interface SelectionModifyData {
  mode: SelectionActionMode;
  idSet: Set<UID>;
}

export type EditorEventType = keyof EditorEventMap;
export type EditorEventData<T extends EditorEventType> = EditorEventMap[T];

export type ModuleMoveData = {
  idSet?: Set<UID>;
  delta: Point;
};

export type PropChange<T> = {
  from: T
  to: T
}

export type HistoryModuleChangeItem = {
  id: UID
  props: HistoryModuleChangeProps
}

export type HistoryModuleChangeProps = {
  [K in keyof ModuleProps]?: PropChange<ModuleProps[K]>
}

export interface ModuleModifyData {
  id: UID
  props: Partial<ModuleProps>
}

export type EditorEventMap = {
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
  'render-modules': boolean;
  'render-selection': never;
  'selection-updated': never
  'selection-modify': SelectionModifyData;
  'selection-clear': never;
  'selection-all': never;
  'module-updated': HistoryOperation;
  'module-copy': never;
  'module-add': PropsWithoutIdentifiersA[];
  'module-paste': Point;
  'module-delete': never;
  'module-duplicate': never;
  'module-layer': { method: 'up' | 'down' | 'top' | 'bottom', idSet: Set<UID> };
  'module-move': ModuleMoveData;
  'module-modify': ModuleModifyData[]
  'module-modifying': {
    type: 'move' | 'resize' | 'rotate',
    data: Partial<ModuleProps>
  }
  'module-hover-enter': UID;
  'module-hover-leave': UID;
  'visible-module-updated': never;
  'visible-selection-updated': never;
  'history-redo': never;
  'history-undo': never;
  'history-pick': HistoryNode;
  'context-menu': {
    idSet: Set<UID>;
    position: Point;
    copiedItems: boolean
  };
}

// @ts-ignore
const forwardEventDependencyMap: Record<EditorEventType, EditorEventType[]> = {
  'world-resized': ['world-updated'],
  // 'editor-initialized': ['world-updated'],
  'world-updated': ['visible-module-updated'],
  'world-zoom': ['world-updated'],
  'world-shift': ['world-updated'],
  /* selections */
  'selection-all': ['selection-updated'],
  'selection-clear': ['selection-updated'],
  'selection-modify': ['selection-updated'],
  'selection-updated': ['visible-selection-updated'],
  'visible-selection-updated': ['render-selection'],
  'render-selection': [],
  'module-hover-enter': ['visible-selection-updated'],
  'module-hover-leave': ['visible-selection-updated'],
  /* modules */
  'module-add': ['module-updated'],
  'module-delete': ['module-updated'],
  'module-move': ['module-updated'],
  'module-paste': ['module-updated'],
  'module-duplicate': ['module-updated'],
  'module-modifying': ['module-updated'],
  'module-modify': ['module-updated'],
  'module-updated': ['visible-module-updated', 'selection-updated'],
  'visible-module-updated': ['render-modules', 'visible-selection-updated'],
  'render-modules': [],
  'context-menu': [],
  'module-copy': [],
  /* history */
  'history-undo': ['module-updated'],
  'history-redo': ['module-updated'],
  'history-pick': ['module-updated'],
}
