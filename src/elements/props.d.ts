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
  color: string;
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
  cx: number
  cy: number
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

export type Asset = {
  id: string;
  name: string;
  img: HTMLImageElement;
}

export interface TextFontProps {
  family?: string;
  size?: number;
  weight?: 'normal' | 'bold';
  italic?: boolean;
  underline?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface TextRun {
  text: string;
  font?: TextFontProps;
  fill?: Fill;
  stroke: Stroke
}

export type VerticalAlign = 'top' | 'middle' | 'bottom'
export type HorizontalAlign = 'left' | 'center' | 'right'
