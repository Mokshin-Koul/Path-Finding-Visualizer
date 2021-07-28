import React, { Component } from "react";
import "./Header.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      algo: "",
      src: {
        x: 14,
        y: 15,
      },
      dest: {
        x: 16,
        y: 40,
      },
    };
    this.sourceXRef = React.createRef();
    this.sourceYRef = React.createRef();
    this.destXRef = React.createRef();
    this.destYRef = React.createRef();
  }

  selectAlgo = () => {
    const visible = this.state.visible;
    const list = document.querySelector("#list");
    if (visible) {
      list.style.visibility = "hidden";
    } else {
      list.style.visibility = "visible";
    }
    this.setState({
        visible: !visible
    })
  };

  algorithmsList = (algoName) => {
    this.props.setAlgoType(algoName);
    const list = document.querySelector("#list");
    list.style.visibility = 'hidden'
    if (algoName !== this.state.algo) {
      this.props.clearGrid();
    }
    this.setState({
      algo: algoName,
      visible: false
    });
  };

  setSource = () => {
    if (this.sourceXRef.current.value && this.sourceYRef.current.value) {
      this.props.setSourceCoordinates(this.sourceXRef.current.value, this.sourceYRef.current.value);
      this.sourceXRef.current.value = "";
      this.sourceYRef.current.value = "";
    }
  };

  setDestination = () => {
    if (this.destXRef.current.value && this.destYRef.current.value) {
      this.props.setDestinationCoordinates(this.destXRef.current.value, this.destYRef.current.value);
      this.destXRef.current.value = "";
      this.destYRef.current.value = "";
    }
  };

  render() {
    return (
      <header className="Header">
        <div className="events">
          <div className="Algorithms">
            <span onClick={() => this.selectAlgo()}>Algorithms &#9660;</span>
            <ul id="list">
              <li onClick={() => this.algorithmsList("Dijkstra")}>Dijkstra</li>
              <li onClick={() => this.algorithmsList("BFS")}>Breadth-first-search</li>
              <li onClick={() => this.algorithmsList("DFS")}>Depth-first-Search</li>
              {/* <li onClick={() => this.algorithmsList("A*")}>A*</li> */}
            </ul>
          </div>
          <button onClick={this.props.clearGrid} className="event-handling" disabled={this.props.disableClear}>
            Clear Grid
          </button>
          <button onClick={() => this.props.visualizeAlgo(this.state.algo)} className="event-handling" disabled={!this.props.isAnimating}>
            Visualize {this.state.algo}
          </button>
          <button onClick={() => this.props.addWeights(this.state.algo)} className="event-handling weight" disabled={!this.props.isAnimating}>
            Add Weight
          </button>
          <button onClick={this.props.addWalls} className="event-handling wall" disabled={!this.props.isAnimating}>
            Add Walls
          </button>
        </div>
        <div className="controls">
          <div className="coordinates">
            <div className="source">
              <label>Source Coordinates: </label>
              <input type="text" placeholder="Enter X" ref={this.sourceXRef} />
              <input type="text" placeholder="Enter Y" ref={this.sourceYRef} />
              <button onClick={this.setSource}>Set Source</button>
            </div>
            <div className="destination">
              <label>Destination Coordinates: </label>
              <input type="text" placeholder="Enter X" ref={this.destXRef} />
              <input type="text" placeholder="Enter Y" ref={this.destYRef} />
              <button onClick={this.setDestination}>Set Destination</button>
            </div>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>
          {this.state.algo
            ? `${this.state.algo} is a ${this.props.isWeightedAlgo ? "Weighted" : "Unweighted"} Algorithm and ${
                this.state.algo === "DFS" ? "does not" : ""
              } guarentees the shortest path`
            : null}
        </p>
      </header>
    );
  }
}

export default Navbar;
