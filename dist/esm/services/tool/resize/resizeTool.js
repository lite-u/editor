const resizeTool = {
    cursor: 'default',
    mouseMove() {
        if (!this.subTool)
            return;
        this.subTool.mouseMove.call(this);
    },
    mouseUp() {
        if (!this.subTool)
            return;
        this.subTool.mouseUp.call(this);
        this.subTool = null;
    },
};
export default resizeTool;
