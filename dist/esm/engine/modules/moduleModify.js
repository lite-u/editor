export {};
/*
import Editor from '../editor.js'
import ElementRectangle from '../../elements/rectangle/rectangle.js'
import ElementEllipse, {EllipseProps} from '../../elements/ellipse/ellipse.js'
import ElementText, {TextProps} from '../../elements/text/text.js'
import ElementImage, {ImageProps} from '../../elements/image/image.js'
import nid from '../../core/nid.js'
import {ElementInstance, ElementMap, ElementProps} from '../../elements/elements.d.js'
import {UID} from '../../core/core.d.js'
import deepClone from '../../core/deepClone.js'

export function batchCreate(this: Editor, moduleDataList: ElementProps[]): ElementMap {
  const clonedData = deepClone(moduleDataList) as ElementProps[]
  const newMap: ElementMap = new Map()
  let localMaxLayer = 0

  const create = (data: ElementProps) => {
    if (!data.id) {
      let id = nid()

      // ensure short id no repeat
      if (this.elementMap.has(id)) {
        id = nid()
      }

      data.id = id
    }

    if (isNaN(data.layer)) {
      const maxFromelementMap = this.getMaxLayerIndex

      localMaxLayer = Math.max(localMaxLayer, maxFromelementMap)
      localMaxLayer++

      data.layer = localMaxLayer
    }

    if (data.type === 'rectangle') {
      return new ElementRectangle(data)
    }

    if (data.type === 'ellipse') {
      return new ElementEllipse(data as EllipseProps)
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

    newMap.set(data.id, module as ElementInstance)
  })

  return newMap
}

export function batchAdd(this: Editor, modules: ElementMap, callback?: VoidFunction): ElementMap {
  modules.forEach(mod => {
    this.elementMap.set(mod.id, mod)
  })
//       this.assetsManager.add('image', data.src)
  // this.events.onModulesUpdated?.(this.elementMap)
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

type BatchCopyFn = <T extends boolean>(this: Editor, idSet: Set<UID>, includeIdentifiers: T) => T extends true ? ElementProps[] : Omit<ElementProps, 'id' & 'layer'>[]

export const batchCopy: BatchCopyFn = function (this, idSet, includeIdentifiers) {
  const modulesMap: ElementMap = new Map()
  const moduleArr: ElementInstance[] = []

  idSet.forEach(id => {
    const mod = this.elementMap.get(id)
    if (mod) {
      moduleArr.push(mod)
      modulesMap.set(id, mod)
    }
  })

  moduleArr.sort((a, b) => a.layer - b.layer)

  return moduleArr.map(mod => mod.toMinimalJSON(includeIdentifiers))
}

export function batchDelete(this: Editor, idSet: Set<UID>): ElementProps[] {
  const backup: ElementProps[] = this.batchCopy(idSet)

  backup.forEach(module => {
    this.elementMap.delete(module.id)
  })

  // this.events.onModulesUpdated?.(this.elementMap)

  return backup
}

export function batchMove(this: Editor, from: Set<UID>, delta: Point) {
  const modulesMap: ElementMap = this.getElementMapByIdSet(from)

  modulesMap.forEach((module: ElementInstance) => {
    module.cx += delta.x
    module.cy += delta.y
  })
}

export function batchModify(this: Editor, idSet: Set<UID>, data: Partial<ElementProps>) {
  const modulesMap = this.getElementMapByIdSet(idSet)

  modulesMap.forEach((module: ElementInstance) => {
    Object.keys(data).forEach((key) => {
      const keyName = key as keyof ElementProps
      // @ts-ignore
      module[keyName] = data[key]
    })
  })
}
*/
