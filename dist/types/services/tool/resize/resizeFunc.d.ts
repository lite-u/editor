import { ElementInstance } from '~/elements/type';
import { ResizeDirectionName } from '~/services/selection/type';
import ToolManager from '~/services/tool/toolManager';
declare function resizeFunc(this: ToolManager, elements: ElementInstance[], placement?: ResizeDirectionName): void;
export default resizeFunc;
