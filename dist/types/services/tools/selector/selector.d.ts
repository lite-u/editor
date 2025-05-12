import Editor from '~/main/editor';
declare const selection: {
    start(this: Editor, e: MouseEvent): "resizing" | "rotating" | "selecting" | undefined;
    move(this: Editor, e: PointerEvent): void;
    finish(this: Editor, e: MouseEvent): void;
};
export default selection;
