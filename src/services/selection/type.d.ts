import {ElementInstance} from '~/elements/elements'

export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

type HandlerType = 'move' | 'resize' | 'rotate';

export enum ResizeDirection {
  N = 'n',
  S = 's',
  E = 'e',
  W = 'w',
  NE = 'ne',
  NW = 'nw',
  SE = 'se',
  SW = 'sw',
}

export type ResizeHandleName =
  | 'tl'
  | 't'
  | 'tr'
  | 'r'
  | 'br'
  | 'b'
  | 'bl'
  | 'l'
  | 'rotate-tl'
  | 'rotate-tr'
  | 'rotate-br'
  | 'rotate-bl'

interface ResizeTransform {
  dx: number;
  dy: number;
  cx: number;
  cy: number;
}

export interface OperationHandle {
  id: string;
  type: HandlerType
  /*
  * elementOrigin is a detailed representation of the corresponding element instance.
  * */
  elementOrigin: ElementProps
  element: ElementInstance
}

interface ResizeHandle extends OperationHandle {
  type: 'resize';
  name: ResizeHandleName
}

export interface RotateHandle extends OperationHandle {
  type: 'rotate';
}

export interface MoveHandle extends OperationHandle {
  type: 'move';
}

export type OperationHandler = RotateHandle | ResizeHandle | MoveHandle

