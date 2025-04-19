import {ModuleProps} from '../../core/modules/type'
import {UID} from '../../core/type'

const extractIdSetFromArray = (from: ModuleProps[]): Set<UID> => {
  return new Set(from.map(item => item.id))
}

const arrayToMap = (from: ModuleProps[]): Map<UID, ModuleProps> => {
  return new Map(from.map(item => [item.id, item]))
}

export {extractIdSetFromArray, arrayToMap}