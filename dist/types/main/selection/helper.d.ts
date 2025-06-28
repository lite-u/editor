import { SelectionActionMode } from './type';
import Editor from '../editor';
import { UID } from '../../core/type';
export declare function modifySelected(this: Editor, idSet: Set<UID>, action: SelectionActionMode): void;
