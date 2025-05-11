import {SelectionActionMode} from './type'
import Editor from '../../engine/editor'
import {UID} from '~/core/core'
import typeCheck from '~/core/typeCheck'

export function modifySelected(
  this: Selection,
  idSet: Set<UID>,
  action: SelectionActionMode,
) {
  if (typeCheck(idSet) !== 'set') return

  let eventCallBackData = null

  if (idSet.size === 1) {
    const first = [...idSet.values()][0]

    if (this.elementManager.all.has(first)) {
      // @ts-ignore
      eventCallBackData = this.elementManager.all.get(first).toMinimalJSON()
      // console.log(eventCallBackData)
    }
  }
  const realSelectedModules = this.selection.getSelected

  this.selectedElementIDSet.clear()

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

  realSelectedModules.forEach((id) => this.selectedElementIDSet.add(id))
  // this.events.onSelectionUpdated?.(idSet, eventCallBackData)
}

export function updateSelectionCanvasRenderData(this: Editor) {
  // const moduleProps = this.selection.getSelectedPropsIfUnique

  return
  /*
    if (moduleProps) {
      const module = this.elementManager.all.get(moduleProps.id)
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
          // @ts-ignore
          this.operationHandlers.add(p)
        },
      )
    }
  */
}
