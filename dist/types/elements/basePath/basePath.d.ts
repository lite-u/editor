type Point = {
    x: number;
    y: number;
};
export declare class BasePath {
    protected getPoints(): Point[];
    protected setPoints(_: Point[]): void;
    getCenter(): Point;
}
export {};
