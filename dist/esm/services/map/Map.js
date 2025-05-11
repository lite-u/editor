import { initViewportDom } from './domManipulations.js';
class Map {
    domRefs;
    resizeObserver;
    wrapper;
    // scrollBarX: HTMLDivElement
    // scrollBarY: HTMLDivElement
    selectionBox;
    selectionCanvas;
    cursor;
    selectionCTX;
    mainCanvas;
    mainCTX;
    eventsController;
    initialized;
    dpr;
    spaceKeyDown;
    zooming;
    constructor(editor) {
        const id = editor.id;
        this.domRefs = initViewportDom(id);
    }
    destroy() {
    }
}
