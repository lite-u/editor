const extractIdSetFromArray = (from: ElementProps[]): Set<UID> => {
  return new Set(from.map(item => item.id))
}

const arrayToMap = (from: ElementProps[]): Map<UID, ElementProps> => {
  return new Map(from.map(item => [item.id, item]))
}

export {extractIdSetFromArray, arrayToMap}