import ToolManager from '~/services/tool/toolManager';
import { CanvasHostEvent } from '~/services/element/CanvasHost';
declare function handleContextMenu(this: ToolManager, e: CanvasHostEvent): boolean;
export default handleContextMenu;
