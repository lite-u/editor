import ToolManager from '~/services/tool/toolManager';
import { ElementInstance } from '~/elements/type';
import { ResizeDirectionName } from '~/services/selection/type';
declare function resizeTool(this: ToolManager, elements: ElementInstance[], direction?: ResizeDirectionName): void;
export default resizeTool;
