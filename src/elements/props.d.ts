export type AnchorPoint = {
  x: number;
  y: number;
  type: 'corner' | 'smooth';
  leftDirection: Point | null;
  rightDirection: Point | null;
};

export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  color: string; // e.g., "#000000"
  weight: number; // stroke width
  cap: 'butt' | 'round' | 'projecting';
  join: 'miter' | 'round' | 'bevel';
  dashed: boolean;
};

export type Fill = {
  enabled: boolean;
  color: string; // e.g., "#FF0000"
  type: 'solid' | 'gradient' | 'pattern';
};

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export type Transform = {
  position: Point
  rotation: number
  width: number
  height: number
  shear: {
    angle: number;
    axis: 'horizontal' | 'vertical';
  };
};

// [topLeft,topRight,bottomRight,bottomLeft]| [repeat]
export type BorderRadius = [number, number, number, number] | [number];

export const DEFAULT_BORDER_RADIUS: BorderRadius = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
}

export type Appearance = {
  effects: string[]; // e.g., ["drop shadow", "outer glow"]
  multipleFills: boolean;
  multipleStrokes: boolean;
};

export type Shadow = {
  type: 'drop' | 'inner';
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread?: number;
  opacity: number;
  blendMode?: BlendMode;
  enabled: boolean;
};

export type Gradient = {
  type: 'linear' | 'radial';
  angle?: number;
  cx?: number;
  cy?: number;
  r?: number;
  stops: {
    offset: number;
    color: string;
    opacity?: number;
  }[];
};