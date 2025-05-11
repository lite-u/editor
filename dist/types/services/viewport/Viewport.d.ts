import Editor from '~/main/editor';
import { BoundingRect } from '~/type';
export type ViewportManipulationType = 'static' | 'waiting' | 'panning' | 'dragging' | 'resizing' | 'rotating' | 'zooming' | 'selecting';
declare class Viewport {
    editor: Editor;
    resizeObserver: ResizeObserver;
    rect: BoundingRect;
    viewportRect: BoundingRect;
    worldRect: BoundingRect;
    offset: {
        x: number;
        y: number;
    };
    scale: number;
    enableCrossLine: boolean;
    drawCrossLineDefault: boolean;
    drawCrossLine: boolean;
    constructor(editor: Editor);
    destroy(): void;
}
export default Viewport;
