import {SelectionActionMode} from './type'
import Editor from '../editor'
import typeCheck from '../../lib/typeCheck'
import {UID} from '../../core/core'

export function modifySelected(
  this: Editor,
  idSet: Set<UID>,
  action: SelectionActionMode,
) {
  if (typeCheck(idSet) !== 'set') return

  const realSelectedModules = this.getSelected

  this.selectedModules.clear()

  if (action === 'replace') {
    realSelectedModules.clear()
  }

  idSet.forEach((id) => {
    switch (action) {
      case 'add':
        realSelectedModules.add(id)
        break
      case 'delete':
        realSelectedModules.delete(id)
        break
      case 'toggle':
        if (realSelectedModules.has(id)) {
          realSelectedModules.delete(id)
        } else {
          realSelectedModules.add(id)
        }
        break
      case 'replace':
        realSelectedModules.add(id)
        break
    }
  })

  realSelectedModules.forEach((id) => this.selectedModules.add(id))
  // this.events.onSelectionUpdated?.(idSet, eventCallBackData)
}

/*export function updateSelectionCanvasRenderData(this: Editor) {
  const moduleProps = this.getSelectedPropsIfUnique

  return
  if (moduleProps) {
    const module = this.moduleMap.get(moduleProps.id)
    const {scale, dpr} = this.viewport
    const lineWidth = 1 / scale * dpr
    const resizeSize = 2 / scale * dpr
    const lineColor = '#5491f8'

    const o = module!.getOperators({
      size: resizeSize,
      lineColor,
      lineWidth,
    }, {
      size: 1,
      lineColor: '',
      lineWidth: 0,
    })

    o.forEach(
      (p) => {
        this.operationHandlers.add(p)
      },
    )
  }
}*/
