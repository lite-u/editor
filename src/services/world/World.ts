import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementImage from '~/elements/image/image'
import Editor from '~/main/editor'
import {BoundingRect, Point} from '~/type'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {createWith, screenToWorld, worldToScreen} from '~/lib/lib'
import {zoomAtPoint} from '~/services/world/helper'
import selectionRender from '~/services/world/selectionRender'

class World {
  editor: Editor
  selectionBox: HTMLDivElement
  mainCanvas: HTMLCanvasElement
  mainCanvasContext: CanvasRenderingContext2D
  selectionCanvas: HTMLCanvasElement
  selectionCanvasContext: CanvasRenderingContext2D
  scale: number
  offset: { x: number, y: number }
  worldRect: BoundingRect
  // drawCrossLineDefault: boolean = false
  // drawCrossLine: boolean = false
  dpr: number

  constructor(editor: Editor) {
    this.editor = editor
    this.mainCanvas = createWith('canvas', 'main-canvas', editor.id)
    this.mainCanvasContext = this.mainCanvas.getContext('2d') as CanvasRenderingContext2D
    this.selectionCanvas = createWith('canvas', 'selection-canvas', editor.id)
    this.selectionCanvasContext = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    this.selectionBox = createWith('div', 'editor-selection-box', editor.id)
    this.mainCanvas.setAttribute('id', 'main-canvas')
    this.scale = 1
    this.offset = {x: 0, y: 0}
    this.worldRect = generateBoundingRectFromTwoPoints(
      this.offset,
      this.offset,
    )
    this.dpr = 2

    this.mainCanvas.style.pointerEvents = 'none'
    this.selectionCanvas.style.pointerEvents = 'none'
    this.selectionBox.style.pointerEvents = 'none'
    this.editor.container.append(this.mainCanvas, this.selectionCanvas, this.selectionBox)
  }

  updateWorldRect() {
    const {width, height} = this.editor.viewportRect
    const {dpr} = this
    const p1 = this.getWorldPointByViewportPoint(0, 0)
    const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr)

    this.worldRect = generateBoundingRectFromTwoPoints(p1, p2)
    // console.log('worldRect', this.viewport.worldRect)
  }

  zoom(zoom: number, point?: Point): { x: number, y: number } {
    const {rect} = this.editor

    point = point || {x: rect.width / 2, y: rect.height / 2}

    return zoomAtPoint.call(this, point, zoom)
  }

  getWorldPointByViewportPoint(x: number, y: number) {
    const {offset, scale} = this
    const dpr = this.dpr

    return screenToWorld(
      {x, y},
      offset,
      scale,
      dpr,
    )
  }

  getViewPointByWorldPoint(x: number, y: number) {
    const {offset, scale, dpr} = this

    return worldToScreen(
      {x, y},
      offset,
      scale,
      dpr,
    )
  }

  renderModules() {
    // console.log('renderModules')
    const animate = () => {
      const {scale, dpr, mainCanvasContext: ctx} = this
      const frameBorder = {
        id: nid() + '-frame',
        x: this.editor.config.page.width / 2,
        y: this.editor.config.page.height / 2,
        width: this.editor.config.page.width,
        height: this.editor.config.page.height,
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

      this.editor.visible.values.forEach((module) => {
        module.render(ctx)

        if (module.type === 'image') {
          const {src} = module as ElementImage

          const obj = this.editor.assetsManager.getAssetsObj(src)
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

  renderSelections() {
    // console.log('renderSelections')

    const animate = () => {
      selectionRender.call(this)
    }

    requestAnimationFrame(animate)
  }

  destroy() {
    console.log('destroy')
    this.mainCanvas.remove()
    this.selectionCanvas.remove()
    this.mainCanvas = null!
    this.selectionCanvas = null!
    this.mainCanvasContext = null!
    this.selectionCanvasContext = null!
  }
}

export default World