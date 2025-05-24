import Editor from '~/main/editor'
import {ElementInstance, ElementMap, ElementProps, OptionalIdentifiersProps} from '~/elements/type'
import deepClone from '~/core/deepClone'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementEllipse from '~/elements/ellipse/ellipse'
import ElementText from '~/elements/text/text'
import ElementImage from '~/elements/image/image'
import {Point, UID} from '~/type'
import ElementLineSegment from '~/elements/lines/lineSegment'
import ElementPath from '~/elements/path/path'

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

  public getElementsByIdSet(idSet: Set<UID>): ElementInstance[] {
    const result: ElementInstance[] = []

    ;[...idSet.values()].map(id => {
      const mod = this.elementMap.get(id)

      if (mod) {
        result.push(mod)
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

  create(data: OptionalIdentifiersProps): ElementInstance | false {
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

    if (data.type === 'lineSegment') {
      return new ElementLineSegment(data)
    }

    if (data.type === 'path') {
      return new ElementPath(data)
    }

    return false
  }

  batchCreate(elementDataList: ElementProps[]): ElementMap {
    const clonedData = deepClone(elementDataList) as ElementProps[]
    const newMap: ElementMap = new Map()
    // let localMaxLayer = 0

    /*    if (isNaN(data.layer)) {
          const maxFromelementMap = this.getMaxLayerIndex

          localMaxLayer = Math.max(localMaxLayer, maxFromelementMap)
          localMaxLayer++

          data.layer = localMaxLayer
        }*/

    clonedData.forEach(data => {
      const element = this.create(data)

      if (element) {
        newMap.set(data.id, element as ElementInstance)
      }
    })

    return newMap
  }

  add(element: ElementInstance): ElementInstance {
    this.elementMap.set(element.id, element)

    return element
  }

  batchAdd(elements: ElementMap, callback?: VoidFunction): ElementMap {
    elements.forEach(mod => {
      this.add(mod)
    })

    callback && callback()

//       this.assetsManager.add('image', data.src)
    // this.events.onElementsUpdated?.(this.elementMap)
    /* if (callback) {
       const pArr = []
       elements.forEach(mod => {
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

    return elements
  }

  batchCopy(idSet: Set<UID>, includeIdentifiers: boolean = true): ElementProps[] {
    // const elementsMap: ElementMap = new Map()
    const elementArr: ElementInstance[] = []

    idSet.forEach(id => {
      const mod = this.elementMap.get(id)
      if (mod) {
        elementArr.push(mod)
        // elementsMap.set(id, mod)
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

    backup.forEach(element => {
      this.elementMap.delete(element.id)
    })

    // this.events.onElementsUpdated?.(this.elementMap)

    return backup
  }

  batchMove(from: Set<UID>, delta: Point) {
    const elementsMap: ElementMap = this.getElementMapByIdSet(from)

    elementsMap.forEach((element: ElementInstance) => {
      element.cx += delta.x
      element.cy += delta.y
    })
  }

  batchModify(idSet: Set<UID>, data: Partial<ElementProps>) {
    const elementsMap = this.getElementMapByIdSet(idSet)

    elementsMap.forEach((element: ElementInstance) => {
      Object.keys(data).forEach((key) => {
        const keyName = key as keyof ElementProps
        // @ts-ignore
        element[keyName] = data[key]
      })
    })
  }

  destroy() {
    this.elementMap.clear()
  }
}

export default ElementManager