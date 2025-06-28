"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rotating_1 = __importDefault(require("~/services/tool/selector/rotating/rotating"));
const selecting_1 = __importDefault(require("~/services/tool/selector/selecting/selecting"));
const dragging_1 = __importDefault(require("~/services/tool/selector/dragging/dragging"));
const resizing_1 = __importDefault(require("~/services/tool/selector/resizing/resizing"));
const selector = {
    cursor: 'default',
    init: function () { },
    mouseDown: function (event) {
        const { interaction, selection, cursor } = this.editor;
        // console.log(event)
        if (interaction._rotateData) {
            this.subTool = rotating_1.default;
            return;
        }
        else if (interaction._draggingElements.length > 0) {
            this.subTool = dragging_1.default;
            return;
        }
        else if (interaction._resizingData) {
            this.subTool = resizing_1.default;
            return;
        }
        // console.log(this.subTool)
        // selecting.mouseDown(event)
        // console.log(event.element)
        this.subTool = selecting_1.default;
        cursor.lock();
        /*
            // const {_hoveredElement} = interaction
    
            const rotateMode = !!interaction._hoveredRotateManipulator
            const resizeMode = !!interaction._hoveredResizeManipulator
    
            if (resizeMode) {
              const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '')
              cursor.set('resize')
              this.subTool = resizing
    
              interaction._resizingData = {placement}
    
              cursor.set('resize')
              this.subTool = resizing
            } else if (rotateMode) {
              const rects = elementManager.getElementsByIdSet(selection.values).map(ele => {
                return ele.getBoundingRect(true)
              })
              const center = getBoundingRectFromBoundingRects(rects)
              const {cx: x, cy: y} = center
    
              console.log(interaction._hoveredElement)
              interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
              this.subTool = rotating
            } */
    },
    mouseMove: function () {
        var _a;
        // console.log('moving')
        const { interaction, cursor } = this.editor;
        // console.log(this)
        // console.log('m')
        (_a = this.subTool) === null || _a === void 0 ? void 0 : _a.mouseMove.call(this);
        /* if (interaction._rotateData) {
           rotating.mouseMove.call(this)
           return
         }
    
         if (!this.toolManager.subTool) {
           if (interaction._hoveredResizeManipulator) {
             cursor.set('nw-resize')
             // console.log(10)
           } else if (interaction._hoveredRotateManipulator) {
             // console.log(interaction._hoveredRotateManipulator.id)
             const centerPoint = {
               x: interaction.selectedOutlineElement.cx,
               y: interaction.selectedOutlineElement.cy,
             }
    
             const rotation = getRotateAngle(centerPoint, interaction.mouseWorldCurrent)
             cursor.set('rotate')
             cursor.rotate(rotation)
             // console.log(10)
           } else {
             // cursor.set(selector.cursor)
           }
         }*/
        // if (!this.subTool) return
    },
    mouseUp() {
        var _a;
        this.editor.cursor.unlock();
        this.editor.cursor.set(selector.cursor);
        (_a = this.editor.toolManager.subTool) === null || _a === void 0 ? void 0 : _a.mouseUp.call(this);
        this.editor.cursor.set(selector.cursor);
        this.editor.toolManager.subTool = null;
    },
};
exports.default = selector;
