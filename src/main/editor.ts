import {EditorConfig, EditorExportFileType, EventHandlers} from './type'
import History from '~/services/history/history'
import Action from '~/services/actions/actions'
import {generateBoundingRectFromTwoPoints, rectsOverlap, throttle} from '~/core/utils'
import {OperationHandlers} from '~/services/selection/type'
import selectionRender from '~/services/viewport/selectionRender'
import {initEditor} from './init'
import {zoomAtPoint} from '~/services/viewport/helper'
import AssetsManager from '~/services/assets/AssetsManager'
import ElementImage from '~/elements/image/image'
import {ElementInstance, ElementMap, ElementProps} from '~/elements/elements'
import nid from '~/core/nid'
import {UID} from '~/core/core'
import ToolManager from '~/services/tools/toolManager'
import {BoundingRect, Point, VisionEditorAssetType, VisionEventType} from '~/type'
import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementManager from '~/services/element/ElementManager'
import SelectionManager from '~/services/selection/SelectionManager'
import Cursor from '~/services/cursor/cursor'
import World from '~/services/world/World'
import ClipboardManager from '~/services/clipboard/Clipboard'
import InteractionState from '~/services/interaction/InteractionState'

class Editor {
  id = nid()
  readonly container: HTMLDivElement
  config: EditorConfig
  events: EventHandlers = {}
  resizeObserver: ResizeObserver

  world: World
  action: Action
  interaction: InteractionState
  clipboard: ClipboardManager
  cursor: Cursor
  history: History
  // viewport: Viewport
  toolManager: ToolManager
  elementManager: ElementManager
  selection: SelectionManager
  assetsManager: AssetsManager
  canvasView: World
  readonly visibleSelected: Set<UID> = new Set()
  readonly operationHandlers: OperationHandlers[] = []
  rect: BoundingRect
  viewportRect: BoundingRect
  initialized: boolean = false
  // private readonly snapPoints: SnapPointData[] = []
  private readonly visibleElementMap: ElementMap

  constructor({
                container,
                elements,
                assets = [],
                events = {},
                config,
              }: {
    container: HTMLDivElement
    assets: VisionEditorAssetType[]
    elements: ElementProps[]
    events?: EventHandlers;
    config: EditorConfig;
  }) {
    this.visibleElementMap = new Map()
    this.config = config
    this.events = events
    this.container = container
    // services
    this.action = new Action()
    this.clipboard = new ClipboardManager()
    this.interaction = new InteractionState()
    this.world = new World(this)
    // this.viewport = new Viewport(this)
    this.toolManager = new ToolManager(this)
    this.cursor = new Cursor(this)
    this.history = new History(this)
    this.canvasView = new World(this)
    this.selection = new SelectionManager(this)
    this.assetsManager = new AssetsManager(this, assets)
    this.elementManager = new ElementManager(this)
    this.resizeObserver = new ResizeObserver(
      throttle(() => {
        // console.log('resize')
        this.action.dispatch('world-resized')
      }, 200),
    )

    initEditor.call(this)

    const mouseDownPoint = {x: 0, y: 0}
    const mouseMovePoint = {x: 0, y: 0}
    this.rect = generateBoundingRectFromTwoPoints(
      mouseDownPoint,
      mouseMovePoint,
    )
    this.viewportRect = generateBoundingRectFromTwoPoints(
      mouseDownPoint,
      mouseMovePoint,
    )

    this.action.dispatch('element-add', elements)
  }

  public get getVisibleElementMap(): ElementMap {
    return new Map(this.visibleElementMap)
  }

  public get getVisibleSelected() {
    return new Set(this.visibleSelected)
  }

  public get getVisibleSelectedElementMap() {
    return this.elementManager.getElementMapByIdSet(this.getVisibleSelected)
  }

  updateVisibleElementMap() {
    this.visibleElementMap.clear()

    // console.log(this.viewport.offset, this.viewport.worldRect)
    // Create an array from the Map, sort by the 'layer' property, and then add them to visibleelementMap
    const sortedModules = ([...this.elementManager.all.values()] as ElementInstance[])
      .filter(module => {
        const boundingRect = module.getBoundingRect() as BoundingRect
        return rectsOverlap(boundingRect, this.world.worldRect)
      })
      .sort((a, b) => a.layer - b.layer)
    // console.log(this.elementManager.all)
    sortedModules.forEach(module => {
      this.visibleElementMap.set(module.id, module)
    })
  }

  updateVisibleSelected() {
    this.visibleSelected.clear()
    this.operationHandlers.length = 0

    this.getVisibleElementMap.forEach((module) => {
      if (this.selection.has(module.id)) {
        this.visibleSelected.add(module.id)
      }
    })

    const moduleProps = this.selection.pickIfUnique

    if (moduleProps) {
      const module = this.elementManager.all.get(moduleProps.id)
      const {scale, dpr} = this.world
      const lineWidth = 1 / scale * dpr
      const resizeSize = 10 / scale * dpr
      const rotateSize = 15 / scale * dpr
      const lineColor = '#5491f8'

      const operators = module!.getOperators(
        module!.id,
        {
          size: resizeSize,
          lineColor,
          lineWidth,
          fillColor: '#fff',
        }, {
          size: rotateSize,
          lineColor: 'transparent',
          lineWidth: 0,
          fillColor: 'transparent',
        })

      this.operationHandlers.push(...operators)
    }
  }

  public execute(type: VisionEventType, data: unknown = null) {
    // console.log('Editor', type)
    // @ts-ignore
    this.action.execute(type, data)
  }

  // viewport
  renderModules() {
    // console.log('renderModules')
    const animate = () => {
      const {scale, dpr, mainCanvasContext: ctx} = this.world
      const frameBorder = {
        id: nid() + '-frame',
        x: this.config.page.width / 2,
        y: this.config.page.height / 2,
        width: this.config.page.width,
        height: this.config.page.height,
        fillColor: 'transparent',
        enableLine: true,
        lineWidth: 1 / scale * dpr,
        lineColor: '#000',
        layer: -1,
        opacity: 100,
      }

      const frameFill = {...frameBorder, fillColor: '#fff', enableLine: false}
      // deduplicateObjectsByKeyValue()
      // console.log(this.visibleelementMap.size)
      // deduplicateObjectsByKeyValue

      new ElementRectangle(frameFill).render(ctx)

      this.visibleElementMap.forEach((module) => {
        module.render(ctx)

        if (module.type === 'image') {
          const {src} = module as ElementImage

          const obj = this.assetsManager.getAssetsObj(src)
          // console.log(this.assetsManager, src)
          if (obj) {
            (module as ElementImage).renderImage(ctx, obj.imageRef!)
          }
        }
      })

      new ElementRectangle(frameBorder).render(ctx)
    }

    requestAnimationFrame(animate)
  }

  /*  public get getModulesInsideOfFrame(): ModuleInstance[] {
      const arr = []
      this.elementManager.all.forEach((module) => {

      })
    }*/

  public export(): EditorExportFileType {
    const {scale, offset} = this.world
    const assetSet = new Set<string>()
    const result: EditorExportFileType = {
      elements: [],
      config: {
        scale,
        offset,
      },
      assets: [],
    }

    this.elementManager.all.forEach((module) => {
      if (module.type === 'image') {
        const {src} = module as ElementImage
        if (!src) return

        const r = this.assetsManager.getAssetsObj(src)

        if (r) {
          if (!assetSet.has(src)) {
            assetSet.add(src)
            result.assets.push(r)
          }
          console.log(result.assets)
        }
      }

      result.elements.push(module.toMinimalJSON())
    })

    return result
  }

  renderSelections() {
    // console.log('renderSelections')

    const animate = () => {
      selectionRender.call(this)
    }

    requestAnimationFrame(animate)
  }

  zoom(zoom: number, point?: Point): { x: number, y: number } {
    const {rect} = this

    point = point || {x: rect.width / 2, y: rect.height / 2}

    return zoomAtPoint.call(this, point, zoom)
  }

  updateViewport() {
    const {dpr, mainCanvas, selectionCanvas} = this.world
    const rect = this.container.getBoundingClientRect().toJSON()
    const {x, y, width, height} = rect
    const viewportWidth = width * dpr
    const viewportHeight = height * dpr

    this.rect = {...rect, cx: x + width / 2, cy: y + height / 2}
    this.viewportRect = generateBoundingRectFromTwoPoints(
      {x: 0, y: 0},
      {x: viewportWidth, y: viewportHeight},
    )

    mainCanvas.width = selectionCanvas.width = viewportWidth
    mainCanvas.height = selectionCanvas.height = viewportHeight
  }

  //eslint-disable-block
  destroy() {
    // this.destroy()
    this.action.destroy()
    this.history.destroy()
    this.elementManager.destroy()
    this.resizeObserver.disconnect()

  }
}

export default Editor
