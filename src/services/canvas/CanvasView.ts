import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementImage from '~/elements/image/image'
import Editor from '~/main/editor'

class CanvasView {
  editor: Editor
  mainCanvas: HTMLCanvasElement
  mainCanvasContext: CanvasRenderingContext2D
  selectionCanvas: HTMLCanvasElement
  selectionCanvasContext: CanvasRenderingContext2D
  dpr: number

  constructor(editor: Editor, dpr: number) {
    this.editor = editor
    this.mainCanvas = document.createElement('canvas')
    this.mainCanvasContext = this.mainCanvas.getContext('2d') as CanvasRenderingContext2D
    this.selectionCanvas = document.createElement('canvas')
    this.selectionCanvasContext = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  destroy() {
    this.mainCanvas.remove()
    this.selectionCanvas.remove()
    this.mainCanvas = null!
    this.selectionCanvas = null!
    this.mainCanvasContext = null!
    this.selectionCanvasContext = null!
  }

  renderModules() {
    // console.log('renderModules')
    const animate = () => {
      const {scale, dpr, mainCTX: ctx} = this.viewport
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
}

export default CanvasView