import ToolManager from '~/services/tool/toolManager';
import { ElementInstance } from '~/elements/type';
import { ResizeHandleName } from '~/services/selection/type';
declare function resizeTool(this: ToolManager, elements: ElementInstance[], direction?: ResizeHandleName): void;
export default resizeTool;
