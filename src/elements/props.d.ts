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

export type BorderRadius = {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
};

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
  type: 'drop' | 'inner';      // 'drop' = drop shadow, 'inner' = inner shadow
  color: string;               // e.g., "#000000" or "rgba(0,0,0,0.5)"
  offsetX: number;             // Horizontal offset in px
  offsetY: number;             // Vertical offset in px
  blur: number;                // Blur radius in px
  spread?: number;             // Optional: spread radius (like in CSS box-shadow)
  opacity: number;             // 0 to 1
  blendMode?: BlendMode;       // Optional: 'normal', 'multiply', etc.
  enabled: boolean;            // For toggling effect
};
export type Transform = {}