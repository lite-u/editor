import Rectangle, {RectangleProps} from './shapes/rectangle'
import Ellipse, {EllipseProps} from './shapes/ellipse'
import {UID} from '../type'
// import {ShapeProps} from './shapes/shape'

export type ModuleTypeMap = {
  'rectangle': Rectangle
  'ellipse': Ellipse
}
export type ModulePropsMap = {
  'rectangle': RectangleProps
  'ellipse': EllipseProps
}
export type ModuleProps = RectangleProps | EllipseProps
// export type ModulePropsType<T extends keyof ModulePropsMap> = ModulePropsMap[T]
export type PropsWithoutIdentifiers<T extends keyof ModulePropsMap> = Omit<ModulePropsMap[T], 'id' & 'layer'>
export type PropsWithoutIdentifiersA = Omit<ModuleProps, 'id' & 'layer'>
export type ModuleNames = keyof ModuleTypeMap
export type ModuleInstance = Rectangle | Ellipse
export type ModuleMap = Map<UID, ModuleInstance>

