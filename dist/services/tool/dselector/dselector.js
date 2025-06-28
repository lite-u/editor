"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selecting_1 = __importDefault(require("./selecting/selecting"));
const dSelector = {
    cursor: 'default',
    init() {
    },
    mouseDown() {
        this.subTool = selecting_1.default;
        // this.interaction._movingHandle = this.interaction._hoveredHandle
    },
    mouseMove() {
        var _a;
        (_a = this.subTool) === null || _a === void 0 ? void 0 : _a.mouseMove.call(this);
        /* if (!this.interaction._movingHandle) return
         const {interaction} = this
    
         // this.container.setPointerCapture(e.pointerId)
         const {x, y} = interaction.mouseWorldMovement
    
         this.interaction._movingHandle.translate(x, y)*/
    },
    mouseUp() {
        var _a, _b;
        (_a = this.subTool) === null || _a === void 0 ? void 0 : _a.mouseUp.call(this);
        this.editor.cursor.unlock();
        this.editor.cursor.set(dSelector.cursor);
        (_b = this.editor.toolManager.subTool) === null || _b === void 0 ? void 0 : _b.mouseUp.call(this);
        this.editor.cursor.set(dSelector.cursor);
        this.editor.toolManager.subTool = null;
        // this.interaction._movingHandle = null
        // this.cursor.set('grab')
    },
};
exports.default = dSelector;
