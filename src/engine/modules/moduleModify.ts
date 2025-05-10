import Editor from '../editor'
import Rectangle from '~/elements/rectangle/rectangle'
import Ellipse, {EllipseProps} from '~/elements/ellipse/ellipse'
import ElementText, {TextProps} from '~/elements/text/text'
import ElementImage, {ImageProps} from '~/elements/image/image'
import nid from '~/core/nid'
import {ModuleInstance, ModuleMap, ModuleProps} from '~/elements/elements'
import {UID} from '~/core/core'
import deepClone from '~/core/deepClone'

export function batchCreate(this: Editor, moduleDataList: ModuleProps[]): ModuleMap {
  const clonedData = deepClone(moduleDataList) as ModuleProps[]
  const newMap: ModuleMap = new Map()
  let localMaxLayer = 0

  const create = (data: ModuleProps) => {
    if (!data.id) {
      let id = nid()

      // ensure short id no repeat
      if (this.moduleMap.has(id)) {
        id = nid()
      }

      data.id = id
    }

    if (isNaN(data.layer)) {
      const maxFromModuleMap = this.getMaxLayerIndex

      localMaxLayer = Math.max(localMaxLayer, maxFromModuleMap)
      localMaxLayer++

      data.layer = localMaxLayer
    }

    if (data.type === 'rectangle') {
      return new Rectangle(data)
    }

    if (data.type === 'ellipse') {
      return new Ellipse(data as EllipseProps)
    }

    if (data.type === 'text') {
      // console.log(data)
      return new ElementText(data as TextProps)
    }

    if (data.type === 'image') {
      return new ElementImage(data as ImageProps)
    }
  }

  clonedData.forEach(data => {
    const module = create.call(this, data)

    newMap.set(data.id, module as ModuleInstance)
  })

  return newMap
}

export function batchAdd(this: Editor, modules: ModuleMap, callback?: VoidFunction): ModuleMap {
  modules.forEach(mod => {
    this.moduleMap.set(mod.id, mod)
  })
//       this.assetsManager.add('image', data.src)
  // this.events.onModulesUpdated?.(this.moduleMap)
  if (callback) {
    const pArr = []
    modules.forEach(mod => {
      if (mod.type === 'image') {
        const {src} = mod as ElementImage

        if (src && !this.assetsManager.getAssetsObj(src)) {
          // @ts-ignore
          pArr.push(this.assetsManager.add('image', src))
        }
      }
    })

    // @ts-ignore
    Promise.all(pArr).then((objs: VisionEditorAssetType[]) => objs).finally((objs) => {
      callback(objs)
    })
  }

  return modules
}

type BatchCopyFn = <T extends boolean>(this: Editor, idSet: Set<UID>, includeIdentifiers: T) => T extends true ? ModuleProps[] : Omit<ModuleProps, 'id' & 'layer'>[]

export const batchCopy: BatchCopyFn = function (this, idSet, includeIdentifiers) {
  const modulesMap: ModuleMap = new Map()
  const moduleArr: ModuleInstance[] = []

  idSet.forEach(id => {
    const mod = this.moduleMap.get(id)
    if (mod) {
      moduleArr.push(mod)
      modulesMap.set(id, mod)
    }
  })

  moduleArr.sort((a, b) => a.layer - b.layer)

  return moduleArr.map(mod => mod.toJSON(includeIdentifiers))
}

export function batchDelete(this: Editor, idSet: Set<UID>): ModuleProps[] {
  const backup: ModuleProps[] = this.batchCopy(idSet)

  backup.forEach(module => {
    this.moduleMap.delete(module.id)
  })

  // this.events.onModulesUpdated?.(this.moduleMap)

  return backup
}

export function batchMove(this: Editor, from: Set<UID>, delta: Point) {
  const modulesMap: ModuleMap = this.getModulesByIdSet(from)

  modulesMap.forEach((module: ModuleInstance) => {
    module.x += delta.x
    module.y += delta.y
  })
}

export function batchModify(this: Editor, idSet: Set<UID>, data: Partial<ModuleProps>) {
  const modulesMap = this.getModulesByIdSet(idSet)

  modulesMap.forEach((module: ModuleInstance) => {
    Object.keys(data).forEach((key) => {
      const keyName = key as keyof ModuleProps
      // @ts-ignore
      module[keyName] = data[key]
    })
  })
}
