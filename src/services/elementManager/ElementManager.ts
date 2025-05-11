import Editor from '~/engine/editor'
import {ElementInstance, ElementMap, ElementProps} from '~/elements/elements'
import deepClone from '~/core/deepClone'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementEllipse from '~/elements/ellipse/ellipse'
import ElementText from '~/elements/text/text'
import ElementImage from '~/elements/image/image'
import {UID} from '~/core/core'
import {Point} from '~/type'

class ElementManager {
  protected elementMap: ElementMap = new Map()
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  public has(id: string): boolean {
    return this.elementMap.has(id)
  }

  public get size(): number {
    return this.elementMap.size
  }

  public get keys(): Set<UID> {
    const set: Set<UID> = new Set()

    this.elementMap.forEach((element) => {
      set.add(element.id)
    })

    return set
  }

  public get values(): ElementInstance[] {
    return [...this.elementMap.values()]
  }

  public get all(): ElementMap {
    return new Map(this.elementMap)
  }

  public get getMaxLayerIndex(): number {
    let max = 0
    this.elementMap.forEach((mod) => {
      // console.log(mod.layer)
      if (mod.layer > max) {
        max = mod.layer
      }
    })

    return max
  }

  public getElementById(id: string): ElementInstance | undefined {
    return this.elementMap.get(id)
  }

  public getElementsByIdSet(idSet: Set<UID>): ElementMap {
    const result = new Map()

    idSet.forEach(id => {
      const mod = this.elementMap.get(id)

      if (mod) {
        result.set(id, mod)
      }
    })

    return result
  }

  public getElementMapByIdSet(idSet: Set<UID>): ElementMap {
    const result: ElementMap = new Map()

    idSet.forEach((id) => {
      const mod = this.elementMap.get(id)
      if (mod) {
        result.set(id, mod)
      }
    })

    return result
  }

  create(data: ElementProps): ElementInstance | false {
    if (!data || !data.type) {
      console.error('Data or Type missed')
      return false
    }

    if (!data.id) {
      let id = data.type + '-' + nid()

      // ensure short id no repeat
      if (this.elementMap.has(id)) {
        id = nid()
      }

      data.id = id
    }

    if (isNaN(data.layer)) {
      const maxLayer = this.getMaxLayerIndex

      data.layer = maxLayer + 1
    }

    if (data.type === 'rectangle') {
      return new ElementRectangle(data)
    }

    if (data.type === 'ellipse') {
      return new ElementEllipse(data)
    }

    if (data.type === 'text') {
      return new ElementText(data)
    }

    if (data.type === 'image') {
      return new ElementImage(data)
    }

    return false
  }

  batchCreate(moduleDataList: ElementProps[]): ElementMap {
    const clonedData = deepClone(moduleDataList) as ElementProps[]
    const newMap: ElementMap = new Map()
    // let localMaxLayer = 0

    /*    if (isNaN(data.layer)) {
          const maxFromelementMap = this.getMaxLayerIndex

          localMaxLayer = Math.max(localMaxLayer, maxFromelementMap)
          localMaxLayer++

          data.layer = localMaxLayer
        }*/

    clonedData.forEach(data => {
      const module = this.create(data)

      if (module) {
        newMap.set(data.id, module as ElementInstance)
      }
    })

    return newMap
  }

  add(element: ElementInstance): ElementInstance {
    this.elementMap.set(element.id, element)

    return element
  }

  batchAdd(modules: ElementMap, callback?: VoidFunction): ElementMap {
    modules.forEach(mod => {
      this.add(mod)
    })

    callback && callback()

//       this.assetsManager.add('image', data.src)
    // this.events.onModulesUpdated?.(this.elementMap)
    /* if (callback) {
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
     }*/

    return modules
  }

  batchCopy(idSet: Set<UID>, includeIdentifiers: boolean = true): ElementProps[] {
    // const modulesMap: ElementMap = new Map()
    const elementArr: ElementInstance[] = []

    idSet.forEach(id => {
      const mod = this.elementMap.get(id)
      if (mod) {
        elementArr.push(mod)
        // modulesMap.set(id, mod)
      }
    })

    elementArr.sort((a, b) => a.layer - b.layer)

    return elementArr.map(mod => {
      let {id, ...rest} = mod.toMinimalJSON()

      if (includeIdentifiers) {
        return {id, ...rest}
      }

      return rest
    })
  }

  batchDelete(idSet: Set<UID>): ElementProps[] {
    const backup: ElementProps[] = this.batchCopy(idSet)

    backup.forEach(module => {
      this.elementMap.delete(module.id)
    })

    // this.events.onModulesUpdated?.(this.elementMap)

    return backup
  }

  batchMove(from: Set<UID>, delta: Point) {
    const modulesMap: ElementMap = this.getElementMapByIdSet(from)

    modulesMap.forEach((module: ElementInstance) => {
      module.cx += delta.x
      module.cy += delta.y
    })
  }

  batchModify(idSet: Set<UID>, data: Partial<ElementProps>) {
    const modulesMap = this.getElementMapByIdSet(idSet)

    modulesMap.forEach((module: ElementInstance) => {
      Object.keys(data).forEach((key) => {
        const keyName = key as keyof ElementProps
        // @ts-ignore
        module[keyName] = data[key]
      })
    })
  }

  destroy() {
    this.elementMap.clear()
  }
}

export default ElementManager