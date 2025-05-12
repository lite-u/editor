import {ElementMap} from '~/elements/elements'
import {BoundingRect, UID} from '~/type'
import {rectsOverlap} from '~/core/utils'
import Editor from '~/main/editor'

class VisibleManager {
  private readonly visibleElementMap: ElementMap
  private readonly visibleSelected: Set<UID> = new Set()
  readonly editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
    this.visibleElementMap = new Map()
  }

  get values() {
    return [...this.visibleElementMap.values()]
  }

  public get getVisibleElementMap(): ElementMap {
    return new Map(this.visibleElementMap)
  }

  public get getVisibleSelected() {
    return new Set(this.visibleSelected)
  }

  public get getVisibleSelectedElementMap() {
    return this.editor.elementManager.getElementMapByIdSet(this.getVisibleSelected)
  }

  updateVisibleElementMap() {
    this.visibleElementMap.clear()
    // console.log(this.viewport.offset, this.viewport.worldRect)
    // Create an array from the Map, sort by the 'layer' property, and then add them to visibleelementMap
    const sortedModules = (this.editor.elementManager.values)
      .filter(module => {
        const boundingRect = module.getBoundingRect() as BoundingRect
        return rectsOverlap(boundingRect, this.editor.world.worldRect)
      })
      .sort((a, b) => a.layer - b.layer)
    // console.log(this.editor.elementManager.all)
    sortedModules.forEach(module => {
      this.visibleElementMap.set(module.id, module)
    })
  }

  updateVisibleSelected() {
    this.visibleSelected.clear()
    this.editor.interaction.operationHandlers.length = 0

    this.getVisibleElementMap.forEach((module) => {
      if (this.editor.selection.has(module.id)) {
        this.visibleSelected.add(module.id)
      }
    })

    const moduleProps = this.editor.selection.pickIfUnique

    if (moduleProps) {
      const module = this.editor.elementManager.all.get(moduleProps.id)
      const {scale, dpr} = this.editor.world
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

      this.editor.interaction.operationHandlers.push(...operators)
    }
  }

}

export default VisibleManager