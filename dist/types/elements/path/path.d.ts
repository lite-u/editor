import { ElementBaseProps } from '../base/elementBase';
import { UID } from '~/type';
import { BasePath } from '~/elements/basePath/basePath';
import { BezierPoint } from '~/elements/props';
export interface PathProps extends ElementBaseProps {
    id: UID;
    layer: number;
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
    group: string | null;
}
export type RequiredShapeProps = Required<PathProps>;
export default BasePath;
