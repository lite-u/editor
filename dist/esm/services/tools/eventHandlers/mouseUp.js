function handleMouseUp(e) {
    let tool = this.toolMap.get(this.currentToolName);
    tool.finish.call(this, e);
}
export default handleMouseUp;
