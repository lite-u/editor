import Editor from '~/main/editor';
export type Tool = {
    start: (this: Editor, e: MouseEvent) => void;
    move: (this: Editor, e: PointerEvent) => void;
    finish: (this: Editor, e: MouseEvent) => void;
};
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning';
