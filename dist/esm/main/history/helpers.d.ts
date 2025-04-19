import { ModuleProps } from '../../core/modules/modules';
import { UID } from '../../core/core';
declare const extractIdSetFromArray: (from: ModuleProps[]) => Set<UID>;
declare const arrayToMap: (from: ModuleProps[]) => Map<UID, ModuleProps>;
export { extractIdSetFromArray, arrayToMap };
