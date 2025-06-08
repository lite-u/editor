import { ElementInstance } from '~/elements/type';
import { ResizeDirectionName } from '~/services/selection/type';
import ToolManager from '~/services/tool/toolManager';
import { HistoryChangeItem } from '~/services/actions/type';
declare function resizeElements(this: ToolManager, elements: ElementInstance[], placement?: ResizeDirectionName): HistoryChangeItem[];
export default resizeElements;
