"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_ts_1 = __importDefault(require("../../core/modules/shapes/rectangle.ts"));
function selectionRender() {
    if (this.moduleMap.size === 0)
        return;
    const { selectionCTX: ctx } = this.viewport;
    const fillColor = '#5491f8';
    const lineColor = '#5491f8';
    const selected = this.getVisibleSelected;
    const centerPointWidth = 2 / this.viewport.scale * this.viewport.dpr;
    const lineWidth = 1 / this.viewport.scale * this.viewport.dpr;
    const centerPoints = new Set(selected);
    if (this.hoveredModule) {
        centerPoints.add(this.hoveredModule);
    }
    // render selection box for modules
    selected.forEach((id) => {
        const module = this.moduleMap.get(id);
        if (module) {
            const moduleSelectionBoundary = module.getSelectedBoxModule(lineWidth, lineColor);
            moduleSelectionBoundary.render(ctx);
        }
    });
    // render center points
    centerPoints.forEach((id) => {
        const module = this.moduleMap.get(id);
        const { x, y, rotation, layer } = module.getDetails();
        const lineWidth = 1 / this.viewport.scale * this.viewport.dpr;
        const highlightModule = module.getHighlightModule(lineWidth, fillColor);
        const centerDotRect = new rectangle_ts_1.default({
            x,
            y,
            layer,
            id: id + 'hover-center',
            width: centerPointWidth * 2,
            height: centerPointWidth * 2,
            fillColor: fillColor,
            lineColor: 'transparent',
            lineWidth,
            rotation,
            opacity: 100,
            radius: id === this.hoveredModule ? centerPointWidth : 0,
        });
        highlightModule.render(ctx);
        centerDotRect.render(ctx);
    });
    this.operationHandlers.forEach(operation => {
        operation.module.render(ctx);
    });
    /*if (this.viewport.enableCrossLine && this.viewport.drawCrossLine) {
      drawCrossLine({
        ctx,
        mousePoint: mouseMovePoint,
        scale,
        dpr,
        offset,
        worldRect: worldRect,
      })
    }*/
}
exports.default = selectionRender;
