type ElementType = {
    type: 'rect';
    width: number;
    height: number;
} | {
    type: 'ellipse';
    rx: number;
    ry: number;
} | {
    type: 'line';
    start: Point;
    end: Point;
} | {
    type: 'path';
    points: Point[];
};
interface CenteredElement {
    cx: number;
    cy: number;
}
export declare function scaleElementFrom(element: ElementType & CenteredElement, scaleX: number, scaleY: number, anchor: Point): void;
export {};
