/*
import Editor from "../editor.ts"

function batchReplaceModules(this: Editor, moduleList: ModuleProps[]) {
  const elementMap = this.elementManager.batchCreate(moduleList)

  elementMap.forEach((module) => {
    console.log(this.elementMap)
    this.elementMap.set(module.id, module)
  })

  this.render()
  this.events.onModulesUpdated?.(this.elementMap)
  this.render()
}

export default batchReplaceModules*/
