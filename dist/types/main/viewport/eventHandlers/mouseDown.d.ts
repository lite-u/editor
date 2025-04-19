import Editor from '../../editor.ts';
declare function handleMouseDown(this: Editor, e: MouseEvent): "panning" | "resizing" | "rotating" | "selecting";
export default handleMouseDown;
