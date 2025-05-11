/*
import Editor from "../editor.ts"

function batchReplaceModules(this: Editor, moduleList: ElementProps[]) {
  const elementMap = this.elementManager.batchCreate(moduleList)

  elementMap.forEach((module) => {
    console.log(this.elementManager.all)
    this.elementManager.all.set(module.id, module)
  })

  this.render()
  this.events.onModulesUpdated?.(this.elementManager.all)
  this.render()
}

export default batchReplaceModules*/
