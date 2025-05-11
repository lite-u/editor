import { ResizeHandleName } from '~/services/selection/type';
import { RequiredRectangleProps } from '~/elements/rectangle/rectangle';
import { Rect } from '~/type';
export interface TransformProps {
    downPoint: {
        x: number;
        y: number;
    };
    movePoint: {
        x: number;
        y: number;
    };
    moduleOrigin: RequiredRectangleProps;
    rotation: number;
    handleName: ResizeHandleName;
    scale: number;
    dpr: number;
    altKey?: boolean;
    shiftKey?: boolean;
}
declare function transform({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: TransformProps): Rect;
export default transform;
