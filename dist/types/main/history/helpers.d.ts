import { ModuleProps } from '../../core/modules/type';
import { UID } from '../../core/type';
declare const extractIdSetFromArray: (from: ModuleProps[]) => Set<UID>;
declare const arrayToMap: (from: ModuleProps[]) => Map<UID, ModuleProps>;
export { extractIdSetFromArray, arrayToMap };
