"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BEZIER_POINT = exports.DEFAULT_HORIZONTAL_ALIGN = exports.DEFAULT_VERTICAL_ALIGN = exports.DEFAULT_FONT = exports.DEFAULT_TEXT_FONT = exports.DEFAULT_ROTATION = exports.DEFAULT_OPACITY = exports.DEFAULT_GRADIENT = exports.DEFAULT_SHADOW = exports.DEFAULT_APPEARANCE = exports.DEFAULT_TRANSFORM = exports.DEFAULT_TEXT_FILL = exports.DEFAULT_FILL = exports.DEFAULT_STROKE = exports.DEFAULT_ANCHOR_POINT = exports.DEFAULT_POINT = exports.DEFAULT_BORDER_RADIUS = exports.DEFAULT_HEIGHT = exports.DEFAULT_WIDTH = exports.DEFAULT_CY = exports.DEFAULT_CX = void 0;
exports.DEFAULT_CX = 0;
exports.DEFAULT_CY = 0;
exports.DEFAULT_WIDTH = 10;
exports.DEFAULT_HEIGHT = 10;
exports.DEFAULT_BORDER_RADIUS = [0, 0, 0, 0];
exports.DEFAULT_POINT = {
    x: 0,
    y: 0,
};
exports.DEFAULT_ANCHOR_POINT = {
    x: 0,
    y: 0,
    type: 'corner',
    leftDirection: null,
    rightDirection: null,
};
exports.DEFAULT_STROKE = {
    enabled: true,
    color: '#000000',
    weight: 1,
    cap: 'butt',
    join: 'miter',
    dashed: false,
};
exports.DEFAULT_FILL = {
    enabled: false,
    color: '#FFFFFF',
};
exports.DEFAULT_TEXT_FILL = {
    enabled: false,
    color: '#000000',
};
exports.DEFAULT_TRANSFORM = {
    cx: 0,
    cy: 0,
    rotation: 0,
    width: 0,
    height: 0,
    /*  shear: {
        angle: 0,
        axis: 'horizontal',
      },*/
};
exports.DEFAULT_APPEARANCE = {
    effects: [],
    multipleFills: false,
    multipleStrokes: false,
};
exports.DEFAULT_SHADOW = {
    type: 'drop',
    color: '#000000',
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0,
    opacity: 1,
    blendMode: 'normal',
    enabled: false,
};
exports.DEFAULT_GRADIENT = {
    type: 'linear',
    angle: 0,
    stops: [
        { offset: 0, color: '#000000', opacity: 1 },
        { offset: 1, color: '#FFFFFF', opacity: 1 },
    ],
};
exports.DEFAULT_OPACITY = 100;
exports.DEFAULT_ROTATION = 0;
exports.DEFAULT_TEXT_FONT = {
    family: 'sans-serif',
    size: 12,
    weight: 'normal',
    underline: false,
    italic: false,
    lineHeight: 1.2,
    letterSpacing: 1,
};
exports.DEFAULT_FONT = {
    family: 'sans-serif',
    size: 12,
    weight: 'normal',
    underline: false,
    italic: false,
    lineHeight: 1.2,
    letterSpacing: 1,
};
exports.DEFAULT_VERTICAL_ALIGN = 'top';
exports.DEFAULT_HORIZONTAL_ALIGN = 'left';
exports.DEFAULT_BEZIER_POINT = {
    anchor: { x: 0, y: 0 },
    cp1: { x: 0, y: 0 },
    cp2: { x: 0, y: 0 },
    type: 'corner',
    symmetric: true,
};
