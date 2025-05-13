import { ElementBaseProps } from '../base/elementBase';
import { Point } from '~/type';
import { BasePath } from '~/elements/basePath/basePath';
export interface PathProps extends ElementBaseProps {
    type: 'path';
    points: Point[];
    closed: boolean;
    layer: string;
    group: string | null;
}
export type RequiredShapeProps = Required<PathProps>;
export default BasePath;
