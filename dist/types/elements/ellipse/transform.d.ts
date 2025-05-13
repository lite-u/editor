import { ResizeHandleName } from '~/services/selection/type';
import { Point } from '~/type';
import { RequiredEllipseProps } from '~/elements/ellipse/ellipse';
declare const transform: ({ downPoint, movePoint, elementOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: {
    downPoint: {
        x: number;
        y: number;
    };
    movePoint: {
        x: number;
        y: number;
    };
    elementOrigin: RequiredEllipseProps;
    rotation: number;
    handleName: ResizeHandleName;
    scale: number;
    dpr: number;
    altKey?: boolean;
    shiftKey?: boolean;
}) => Point & {
    r1: number;
    r2: number;
};
export default transform;
