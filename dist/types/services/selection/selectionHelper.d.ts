import { SelectionActionMode } from './type';
import { UID } from '~/core/core';
import SelectionManager from '~/services/selection/SelectionManager';
export declare function selectionHelper(this: SelectionManager, idSet: Set<UID>, action: SelectionActionMode): void;
