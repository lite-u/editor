import { ElementBaseProps } from '../base/elementBase';
import { BasePath } from '~/elements/basePath/basePath';
import { BezierPoint } from '~/elements/props';
export interface PathProps extends ElementBaseProps {
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
    layer: string;
    group: string | null;
}
export type RequiredShapeProps = Required<PathProps>;
export default BasePath;
