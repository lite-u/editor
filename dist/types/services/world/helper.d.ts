import { Point, Rect } from '~/type';
import World from '~/services/world/World';
export declare const fitRectToViewport: (rect: Rect, viewport: Rect, paddingScale?: number) => {
    scale: number;
    offsetX: number;
    offsetY: number;
};
export declare function zoomAtPoint(this: World, atPoint: Point, newScale: number): {
    x: number;
    y: number;
};
