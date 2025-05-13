import {ElementMap} from '~/elements/elements'
import {BoundingRect, UID} from '~/type'
import {rectsOverlap} from '~/core/utils'
import Editor from '~/main/editor'
import {generateHandles} from '~/elements/helper'

class VisibleManager {
  private visibleElementMap: ElementMap
  private visibleSelected: Set<UID> = new Set()
  private editor: Editor

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
    const sortedElements = (this.editor.elementManager.values)
      .filter(element => {
        const boundingRect = element.getBoundingRect() as BoundingRect
        return rectsOverlap(boundingRect, this.editor.world.worldRect)
      })
      .sort((a, b) => a.layer - b.layer)
    // console.log(this.editor.elementManager.all)
    sortedElements.forEach(element => {
      this.visibleElementMap.set(element.id, element)
    })
  }

  updateVisibleSelected() {
    this.visibleSelected.clear()
    this.editor.interaction.operationHandlers.length = 0

    this.getVisibleElementMap.forEach((element) => {
      if (this.editor.selection.has(element.id)) {
        this.visibleSelected.add(element.id)
      }
    })

    const elementProps = this.editor.selection.pickIfUnique

    if (elementProps) {
      const element = this.editor.elementManager.getElementById(elementProps.id)
      const {scale, dpr} = this.editor.world
      const ratio = scale * dpr
      const lineWidth = 1 / ratio
      const resizeSize = 10 / ratio
      const rotateSize = 15 / ratio
      const lineColor = '#5491f8'

      generateHandles(element, ratio)
     /* const operators = element.getOperators(
        element!.id,
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
        })*/

      this.editor.interaction.operationHandlers.push(...operators)
    }
  }

  destroy() {
    this.visibleElementMap.clear()
    this.visibleSelected.clear()
    this.editor = null!
    this.visibleElementMap = null!
    this.visibleSelected = null!
  }

}

export default VisibleManager