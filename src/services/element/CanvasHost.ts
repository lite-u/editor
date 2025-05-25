import Editor from '~/main/editor'
import {ElementInstance, ElementMap, ElementProps, OptionalIdentifiersProps} from '~/elements/type'
import deepClone from '~/core/deepClone'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementEllipse from '~/elements/ellipse/ellipse'
import ElementText from '~/elements/text/text'
import ElementImage from '~/elements/image/image'
import {BoundingRect, Point, UID} from '~/type'
import ElementLineSegment from '~/elements/lines/lineSegment'
import ElementPath from '~/elements/path/path'
import {createWith} from '~/lib/lib'
import {rectsOverlap} from '~/core/utils'

const STYLE = {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
}

class CanvasHost {
  protected elementMap: ElementMap = new Map()
  private visible: ElementMap = new Map()
  editor: Editor
  eventsController = new AbortController()
  _hoveredElement: ElementInstance | null = null
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dpr = 2

  constructor(editor: Editor) {
    this.editor = editor
    const {signal} = this.eventsController
    const {container} = editor
    this.editor = editor
    this.canvas = createWith('canvas', {...STYLE})
    this.ctx = this.canvas.getContext('2d')!

    container.appendChild(this.canvas)
    container.addEventListener('pointerdown', e => this.dispatchEvent(e, 'mousedown'), {signal, passive: false})
    container.addEventListener('pointerup', e => this.dispatchEvent(e, 'mouseup'), {signal})
    container.addEventListener('pointermove', e => this.dispatchEvent(e, 'mousemove'), {signal})
  }

  dispatchEvent(domEvent: PointerEvent, type: PointerEvent['type'], options?: { tolerance?: number }) {
    const {ctx, dpr} = this
    const {clientX, clientY, pointerId} = domEvent
    const elements = this.allVisibleElements.sort((a, b) => b.layer - a.layer)
    const x = clientX - this.editor.rect!.x
    const y = clientY - this.editor.rect!.y
    const viewPoint = {
      x: x * dpr,
      y: y * dpr,
    }
    let _ele: ElementInstance | null = null

    for (const el of elements) {
      // let stopped = false
      const {path2D, fill} = el

      const f1 = ctx.isPointInStroke(path2D, viewPoint.x, viewPoint.y)
      const f2 = ctx.isPointInPath(path2D, viewPoint.x, viewPoint.y)

      if (f1 || (f2 && fill.enabled)) {
        _ele = el
        break
      }
    }

    if (type === 'mousemove') {
      if (this._hoveredElement !== _ele) {
        // mouseleave for old
        this._hoveredElement?.dispatchEvent?.({
          type: 'mouseleave',
          x,
          y,
          pointerId,
          originalEvent: domEvent,
          isPropagationStopped: false,
          stopPropagation() {},
        })

        // mouseenter for new
        _ele?.dispatchEvent?.({
          type: 'mouseenter',
          x,
          y,
          pointerId,
          originalEvent: domEvent,
          isPropagationStopped: false,
          stopPropagation() {},
        })

        this._hoveredElement = _ele
      }
    }

    if (!_ele) return

    const event = {
      type,
      x,
      y,
      pointerId,
      originalEvent: domEvent,
      isPropagationStopped: false,
      stopPropagation() {
        event.isPropagationStopped = true
      },
    }

    _ele.dispatchEvent?.(event)
  }

  public has(id: string): boolean {
    return this.elementMap.has(id)
  }

  public get size(): number {
    return this.elementMap.size
  }

  public get allIds(): Set<UID> {
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

  public get allVisibleElements(): ElementInstance[] {
    return [...this.visible.values()]
  }

  updateVisible() {
    this.visible.clear()

    // Create an array from the Map, sort by the 'layer' property,
    const sortedElements = this.values
      .filter(element => {
        const boundingRect = element.getBoundingRect() as BoundingRect
        return rectsOverlap(boundingRect, this.editor.world.worldRect)
      })
      .sort((a, b) => a.layer - b.layer)

    sortedElements.forEach(element => {
      this.visible.set(element.id, element)
    })
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

  public setSize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
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

  append(...args: ElementInstance[]): void {
    args.forEach(el => {
      this.elementMap.set(el.id, el)
    })
  }

  batchAdd(elements: ElementMap, callback?: VoidFunction): ElementMap {
    elements.forEach(mod => {
      this.append(mod)
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

  render() {
    this.allVisibleElements.forEach((element) => {
      element.render(this.ctx)
    })
  }

  reset() {
    this.elementMap.clear()
    this.visible.clear()
  }

  destroy() {
    this.canvas.remove()
    this.elementMap.clear()
    this.visible.clear()
    this.eventsController.abort()
    this.canvas = null!
    this.elementMap = null!
    this.visible = null!
    this.eventsController = null!
  }
}

export default CanvasHost