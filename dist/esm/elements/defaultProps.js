export const DEFAULT_CX = 0;
export const DEFAULT_CY = 0;
export const DEFAULT_WIDTH = 10;
export const DEFAULT_HEIGHT = 10;
export const DEFAULT_BORDER_RADIUS = [0];
export const DEFAULT_POINT = {
    x: 0,
    y: 0,
};
export const DEFAULT_ANCHOR_POINT = {
    x: 0,
    y: 0,
    type: 'corner',
    leftDirection: null,
    rightDirection: null,
};
export const DEFAULT_STROKE = {
    color: '#000000',
    weight: 1,
    cap: 'butt',
    join: 'miter',
    dashed: false,
};
export const DEFAULT_FILL = {
    enabled: false,
    color: '#FFFFFF',
    type: 'solid',
};
export const DEFAULT_TRANSFORM = {
    position: { x: 0, y: 0 },
    rotation: 0,
    width: 0,
    height: 0,
    shear: {
        angle: 0,
        axis: 'horizontal',
    },
};
export const DEFAULT_APPEARANCE = {
    effects: [],
    multipleFills: false,
    multipleStrokes: false,
};
export const DEFAULT_SHADOW = {
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
export const DEFAULT_GRADIENT = {
    type: 'linear',
    angle: 0,
    stops: [
        { offset: 0, color: '#000000', opacity: 1 },
        { offset: 1, color: '#FFFFFF', opacity: 1 },
    ],
};
export const DEFAULT_OPACITY = 100;
export const DEFAULT_ROTATION = 0;
