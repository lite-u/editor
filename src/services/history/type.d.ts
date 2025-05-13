import {HistoryChangeItem} from '~/services/actions/type'

type HistoryPrev = HistoryNode | null
type HistoryNext = HistoryPrev
type HistorySelectedElements = Set<UID>
type HistoryElements = ElementProps[] | UID[]

export type HistoryOperationType =
  'history-init'
  | 'history-add'
  | 'history-delete'
  | 'history-paste'
  | 'history-duplicate'
  | 'history-modify'
  | 'history-move'
  | 'history-reorder'
  | 'history-select'
  | 'history-group'
  | 'history-ungroup'
  | 'history-composite'

// 🧱 Base HistoryOperation Union with Selection Tracking
export type HistoryOperation =
  | InitOperation
  | AddOperation
  | DeleteOperation
  | PasteOperation
  | DuplicateOperation
  | ModifyOperation
  | MoveOperation
  | ReorderOperation
  // | SelectOperation
  | GroupOperation
  | UngroupOperation
  | CompositeOperation

// 🔧 Action Definitions

// 1. Initialization of state
interface InitOperation {
  type: 'history-init'
  payload: {
    state: null,
    selectedElements: HistorySelectedElements
    // state: elementMap // full initial state of the elements
    // HistorySelectedElements
  }
}

// 2. Adding elements to the system
interface AddOperation {
  type: 'history-add'
  payload: {
    elements: HistoryElements // newly added elements with their full data
    selectedElements: HistorySelectedElements
  }
}

// 3. Deleting elements from the system
interface DeleteOperation {
  type: 'history-delete'
  payload: {
    elements: HistoryElements // full data of deleted elements, to restore them
    selectedElements: HistorySelectedElements
  }
}

// 4. Pasting elements into the scene
interface PasteOperation {
  type: 'history-paste'
  payload: {
    elements: HistoryElements // elements that were pasted into the scene
    selectedElements: HistorySelectedElements
  }
}

// 5. Duplicating elements
interface DuplicateOperation {
  type: 'history-duplicate'
  payload: {
    // sourceIds: string[] // ids of the original elements being duplicated
    elements: HistoryElements  // the new duplicated elements
    selectedElements: HistorySelectedElements
  }
}

// 6. Modifying element properties
interface ModifyOperation {
  type: 'history-modify'
  payload: {
    changes: HistoryChangeItem[]
    selectedElements: HistorySelectedElements
  }
}

// 7. Moving elements
interface MoveOperation {
  type: 'history-move'
  payload: {
    delta: { x: number, y: number } // amount by which to move (x and y deltas)
    // elements: HistoryElements // ids of the elements to move
    selectedElements: HistorySelectedElements
  }
}

// 8. Reordering elements
interface ReorderOperation {
  type: 'history-reorder'
  payload: {
    from: string[] // old order of element ids
    to: string[]   // new order of element ids
    selectedElements: HistorySelectedElements
  }
}

// 9. Selecting elements
/*interface SelectOperation {
  type: 'history-select'
  payload: {
    from: string[] // Previously selected element IDs
    to: string[]   // Currently selected element IDs
  }
}*/

// 10. Grouping elements together
interface GroupOperation {
  type: 'history-group'
  payload: {
    groupId: string // ID of the newly created group
    children: string[] // IDs of the elements being grouped
    selectedElements: HistorySelectedElements
  }
}

// 11. Ungrouping elements
interface UngroupOperation {
  type: 'history-ungroup'
  payload: {
    groupId: string // ID of the group being ungrouped
    children: HistoryElements // full elements being ungrouped
    selectedElements: HistorySelectedElements
  }
}

// 12. Composite operation (group multiple actions as one)
interface CompositeOperation {
  type: 'history-composite'
  payload: {
    actions: HistoryOperationA[] // list of actions to be treated as a single undo/redo unit
    selectedElements: HistorySelectedElements
  }
}