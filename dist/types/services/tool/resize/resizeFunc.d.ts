import { ElementInstance } from '~/elements/type';
import { ResizeDirectionName } from '~/services/selection/type';
import Editor from '~/main/editor';
declare function resizeFunc(this: Editor, elements: ElementInstance[], placement?: ResizeDirectionName): void;
export default resizeFunc;
