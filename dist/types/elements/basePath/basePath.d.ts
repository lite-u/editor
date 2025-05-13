type Point = {
    x: number;
    y: number;
};
export declare abstract class BasePath {
    abstract getPoints(): Point[];
    abstract setPoints(points: Point[]): void;
    getCenter(): Point;
    applyMatrix(matrix: DOMMatrix): void;
    translate(dx: number, dy: number): void;
    rotate(angle: number, center?: Point): void;
    scale(sx: number, sy: number, center?: Point): void;
}
export {};
