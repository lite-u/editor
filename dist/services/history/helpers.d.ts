import { ElementProps } from '~/elements/type';
import { UID } from '~/core/core';
declare const extractIdSetFromArray: (from: ElementProps[]) => Set<UID>;
declare const arrayToMap: (from: ElementProps[]) => Map<UID, ElementProps>;
export { extractIdSetFromArray, arrayToMap };
