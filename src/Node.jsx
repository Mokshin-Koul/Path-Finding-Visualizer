import React, { Component } from "react";
import "./Node.css";

class Node extends Component {

    onDragStart(e,data) {
        console.log(e,data)
    }

  render() {
    const classList = ["Cell", `Cell-${this.props.x}-${this.props.y}`];
    const wallList = ["barrier", `Wall-${this.props.x}-${this.props.y}`];
    let child = null;
    if (!this.props.isStart && !this.props.isEnd) {
      child = <div className={wallList.join(" ")}></div>;
    }
    if (this.props.isStart) {
        classList.push("Start");
    }
    if (this.props.isEnd) {
      classList.push("End");
    }
    return (
      <div className={classList.join(" ")} onMouseEnter={(e) => this.props.mouseEnter(e)}>
        {child}
      </div>
    );
  }
}

export default Node;
