import Editor from '../../editor';
declare function handleMouseDown(this: Editor, e: MouseEvent): "panning" | "resizing" | "rotating" | "selecting" | undefined;
export default handleMouseDown;
