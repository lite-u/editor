"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyViewport = destroyViewport;
function destroyViewport() {
    if (!this.viewport)
        return;
    this.viewport.resizeObserver.disconnect();
    this.viewport.eventsController.abort();
    this.viewport.wrapper.style.width = '100%';
    this.viewport.wrapper.style.height = '100%';
    this.viewport.wrapper.remove();
    // @ts-ignore
    this.viewport = null;
}
