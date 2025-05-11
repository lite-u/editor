import { ViewportDomRefType } from '~/services/viewport/domManipulations';
import Editor from '~/main/editor';
import { BoundingRect } from '~/type';
export type ViewportManipulationType = 'static' | 'waiting' | 'panning' | 'dragging' | 'resizing' | 'rotating' | 'zooming' | 'selecting';
declare class Viewport {
    editor: Editor;
    refs: ViewportDomRefType;
    resizeObserver: ResizeObserver;
    eventsController: AbortController;
    initialized: boolean;
    dpr: number;
    spaceKeyDown: boolean;
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
