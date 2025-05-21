import ToolManager from '~/services/tool/toolManager';
import { ElementInstance } from '~/elements/type';
import { ResizeDirectionName } from '~/services/selection/type';
declare function resizeFunc(this: ToolManager, elements: ElementInstance[], placement?: ResizeDirectionName): void;
export default resizeFunc;
