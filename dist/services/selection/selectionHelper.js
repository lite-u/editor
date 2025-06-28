"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectionHelper = selectionHelper;
const typeCheck_1 = __importDefault(require("~/core/typeCheck"));
function selectionHelper(idSet, action) {
    if ((0, typeCheck_1.default)(idSet) !== 'set')
        return;
    const temp = this.editor.selection.values;
    this.clear();
    if (action === 'replace') {
        temp.clear();
    }
    idSet.forEach((id) => {
        switch (action) {
            case 'add':
                temp.add(id);
                break;
            case 'delete':
                temp.delete(id);
                break;
            case 'toggle':
                if (temp.has(id)) {
                    temp.delete(id);
                }
                else {
                    temp.add(id);
                }
                break;
            case 'replace':
                temp.add(id);
                break;
        }
    });
    temp.forEach((id) => this.selected.add(id));
}
/*
export function updateSelectionCanvasRenderData(this: Editor) {
  // const elementProps = this.selection.getSelectedPropsIfUnique

  return
  /!*
    if (elementProps) {
      const element = this.elementManager.all.get(elementProps.id)
      const {scale, dpr} = this.viewport
      const lineWidth = 1 / scale * dpr
      const resizeSize = 2 / scale * dpr
      const lineColor = '#5491f8'

      const o = element!.getOperators({
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
  *!/
}
*/
