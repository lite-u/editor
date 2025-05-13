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
    scale: { x: 1, y: 1 },
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
export const DEFAULT_OPACITY = 100;
export const DEFAULT_ROTATION = 0;
