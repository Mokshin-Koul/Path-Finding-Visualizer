import React, { Component } from "react";
import Node from "./Node";
import "./pathVisualizer.css";
import { dijkstra, sourceToDestTracker } from "./algorithms/Dijkstra";
import { breadthFirstSearch } from "./algorithms/BreadthFirstSeach";
import Navbar from "./Header/Navbar";
import { depthFirstSearch } from './algorithms/DepthFirstSearch'

class pathVisualizer extends Component {
  state = {
    grid: [],
    isMousePressed: false,
    dijstraCalled: false,
    addWalls: false,
    addWeight: false,
    isWeightedAlgo: true,
    isAnimating: true,
    disableClear: false,
    src: {
      x: 14,
      y: 15,
    },
    dest: {
      x: 16,
      y: 40,
    },
  };

  componentDidMount() {
    const nodesgrid = [];
    for (let i = 0; i < 19; i++) {
      const nodeList = [];
      for (let j = 0; j < 57; j++) {
        const node = {
          row: i,
          col: j,
          isVisited: false,
          distance: Infinity,
          isStart: i === this.state.src.x && j === this.state.src.y,
          isEnd: i === this.state.dest.x && j === this.state.dest.y,
          isWall: false,
          previous: null,
          weight: null,
          weighted: false,
        };
        nodeList.push(node);
      }
      nodesgrid.push(nodeList);
    }
    this.setState({
      grid: nodesgrid,
    });
  }

  mouseEventClassHandling = (event) => {
    const classname = event.target.className;
    const targetClass = classname.split(" ");
    if (!targetClass[1]) return;
    const row = parseInt(targetClass[1].split("-")[1]);
    const col = parseInt(targetClass[1].split("-")[2]);
    return [row, col];
  };

  mouseEventWallHandling = (row, col, grid) => {
    const gridItem = {
      ...grid[row][col],
      isWall: !grid[row][col].isWall,
    };
    grid[row][col] = gridItem;
    if (gridItem.isWall) {
      document.querySelector(`.Wall-${row}-${col}`).classList.add("Wall-color");
      document.querySelector(`.Wall-${row}-${col}`).classList.add("Wall-click");
    } else {
      document.querySelector(`.Wall-${row}-${col}`).classList.remove("Wall-color");
      document.querySelector(`.Wall-${row}-${col}`).classList.remove("Wall-click");
    }
    return grid;
  };

  mouseEventWeightHandling = (row, col, grid) => {
    const gridItem = {
      ...grid[row][col],
      weighted: !grid[row][col].weighted,
      weight: 20,
    };
    grid[row][col] = gridItem;
    if (gridItem.weighted) {
      document.querySelector(`.Wall-${row}-${col}`).classList.add("Weight-color");
      document.querySelector(`.Wall-${row}-${col}`).classList.add("Weight-click");
    } else {
      document.querySelector(`.Wall-${row}-${col}`).classList.remove("Weight-color");
      document.querySelector(`.Wall-${row}-${col}`).classList.remove("Weight-click");
    }
    return grid;
  };

  onMouseDown = (event) => {
    const [row, col] = this.mouseEventClassHandling(event);
    const grid = [...this.state.grid];
    let Grid = [...this.state.grid];

    if (this.state.addWalls && !grid[row][col].isStart && !grid[row][col].isEnd && !grid[row][col].weighted) {
      Grid = this.mouseEventWallHandling(row, col, grid);
    }

    if (this.state.addWeight && this.state.isWeightedAlgo && !grid[row][col].isStart && !grid[row][col].isEnd && !grid[row][col].isWall) {
      Grid = this.mouseEventWeightHandling(row, col, grid);
    }
    this.setState({
      isMousePressed: true,
      grid: Grid,
    });
  };

  onMouseEnter = (event) => {
    if (this.state.isMousePressed) {
      const [row, col] = this.mouseEventClassHandling(event);
      const grid = [...this.state.grid];
      let Grid = [...this.state.grid];
      if (this.state.addWalls && !grid[row][col].isStart && !grid[row][col].isEnd && !grid[row][col].weighted) {
        Grid = this.mouseEventWallHandling(row, col, grid);
      }

      if (this.state.addWeight && this.state.isWeightedAlgo && !grid[row][col].isStart && !grid[row][col].isEnd && !grid[row][col].isWall) {
        Grid = this.mouseEventWeightHandling(row, col, grid);
        this.setState({
          grid: Grid,
        });
      }
    }
  };

  onMouseUp = () => {
    this.setState({
      isMousePressed: false,
    });
  };

  getShortestPath = (shortestNodes) => {
    for (let i = 0; i <= shortestNodes.length - 1; i++) {
      setTimeout(() => {
        if (i === shortestNodes.length - 1) {
          this.setState({
            disableClear: false
          });
        }
        if (!shortestNodes[i].isEnd) {
          document.querySelector(`.Cell-${shortestNodes[i].row}-${shortestNodes[i].col}`).classList.add("shortest-path");
          document.querySelector(`.Cell-${shortestNodes[i].row}-${shortestNodes[i].col}`).classList.add("shortest-path-animation");
        }
      }, 50 * i);
    }
    console.log("hello");
  };

  animateAlgorithm = (visitedNodesInOrder, shortestNodes) => {
    for (let i = 0; i <= visitedNodesInOrder.length - 1; i++) {
      setTimeout(() => {
        if (i === visitedNodesInOrder.length - 1 && shortestNodes) {
          this.getShortestPath(shortestNodes);
        }
        if (!visitedNodesInOrder[i].isEnd && !visitedNodesInOrder[i].isStart) {
          document.querySelector(`.Cell-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`).classList.add("visited");
          document.querySelector(`.Cell-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`).classList.add("node");
          setTimeout(() => {
            document.querySelector(`.Cell-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`).classList.remove("node");
          }, 25);
          setTimeout(() => {
            document.querySelector(`.Cell-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`).classList.add("color");
          }, 1200);
        }
      }, 20 * i);
    }
  };

  visualizeAlgo = (algoName) => {
    const grid = [...this.state.grid];
    if (!algoName) {
      alert("Please Select an Algorithm to Visualize");
      return;
    }

    const src = {
      ...this.state.src
    }
    const dest = {
      ...this.state.dest
    }

    if (algoName === "Dijkstra") {
      const visitedNodesInOrder = dijkstra(grid, grid[src.x][src.y], grid[dest.x][dest.y]);
      const shortestNodes = sourceToDestTracker(visitedNodesInOrder, grid[dest.x][dest.y]);
      this.animateAlgorithm(visitedNodesInOrder, shortestNodes);
    }

    if (algoName === "BFS") {
      const visitedNodesInOrder = breadthFirstSearch(grid, grid[src.x][src.y], grid[dest.x][dest.y]);
      const shortestNodes = sourceToDestTracker(visitedNodesInOrder,  grid[dest.x][dest.y]);
      console.log(shortestNodes)
      this.animateAlgorithm(visitedNodesInOrder, shortestNodes);
    }

    if(algoName === 'DFS') {
      const visitedNodesInOrder = depthFirstSearch(grid, grid[src.x][src.y], grid[dest.x][dest.y]);
      const shortestNodes = sourceToDestTracker(visitedNodesInOrder,  grid[dest.x][dest.y]);
      // console.log(shortestNodes)
      this.animateAlgorithm(visitedNodesInOrder, shortestNodes);
    }

    document.querySelector('.wall').classList.remove('selected')
    document.querySelector('.weight').classList.remove('selected')
    this.setState({
      isAnimating: false,
      addWeight: false,
      addWalls: false,
      disableClear: true
    });
  };

  clearGrid = () => {
    const grid = [...this.state.grid];
    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 57; j++) {
        if (grid[i][j].isVisited) {
          document.querySelector(`.Cell-${i}-${j}`).classList.remove("visited");
          document.querySelector(`.Cell-${i}-${j}`).classList.remove("node");
          grid[i][j].isVisited = false;
        }
        if (grid[i][j].distance < Infinity) {
          grid[i][j].distance = Infinity;
        }
        if (grid[i][j].isWall) {
          grid[i][j].isWall = false;
          document.querySelector(`.Wall-${i}-${j}`).classList.remove("Wall-color");
          document.querySelector(`.Wall-${i}-${j}`).classList.remove("Wall-click");
        }
        if (
          document.querySelector(`.Cell-${i}-${j}`).classList.contains("shortest-path") &&
          document.querySelector(`.Cell-${i}-${j}`).classList.contains("shortest-path-animation")
        ) {
          document.querySelector(`.Cell-${i}-${j}`).classList.remove("shortest-path");
          document.querySelector(`.Cell-${i}-${j}`).classList.remove("shortest-path-animation");
        }
        if (document.querySelector(`.Cell-${i}-${j}`).classList.contains("color"))
          document.querySelector(`.Cell-${i}-${j}`).classList.remove("color");
        if (grid[i][j].weighted) {
          grid[i][j].weighted = false;
          grid[i][j].weight = null;
          document.querySelector(`.Wall-${i}-${j}`).classList.remove("Weight-click");
          document.querySelector(`.Wall-${i}-${j}`).classList.remove("Weight-color");
        }
      }
    }
    // this.setState({
    //   isAnimating: true,
    // });
    this.setState({
      grid,
      isAnimating: true
    });
  };

  setSourceCoordinates = (x,y) => {
    const grid = [...this.state.grid]
    const [a,b] = [parseInt(x),parseInt(y)]
    grid[a][b].isStart = true
    grid[this.state.src.x][this.state.src.y].isStart = false
    this.setState({
      grid,
      src: {
        x: a,
        y: b 
      }
    })
  };

  setDestinationCoordinates = (x,y) => {
    const grid = [...this.state.grid]
    const [a,b] = [parseInt(x),parseInt(y)]
    grid[a][b].isEnd = true
    grid[this.state.dest.x][this.state.dest.y].isEnd = false
    this.setState({
      grid,
      dest: {
        x: a,
        y: b 
      }
    })
  };

  setAlgoType = (algoName) => {
    if(algoName === 'BFS' || algoName === 'DFS') {
      this.setState({
        isWeightedAlgo: false
      })
    }
    if(algoName === 'Dijkstra' || algoName === 'A*') {
      this.setState({
        isWeightedAlgo: true
      })
    }
  }

  addWeight = (algoName) => {
    if (!this.state.isWeightedAlgo) {
      alert(`${algoName} is an Unweighted Algorithm hence you cannot add Weights!!!`);
      return;
    }
    document.querySelector('.weight').classList.add('selected')
    if(document.querySelector('.wall').classList.contains('selected')) {
      document.querySelector('.wall').classList.remove('selected')
    }
    this.setState({
      addWeight: true,
      addWalls: false,
    });
  };

  addWalls = () => {
    document.querySelector('.wall').classList.add('selected')
    console.log(document.querySelector('.wall'))
    if(document.querySelector('.weight').classList.contains('selected')) {
      document.querySelector('.weight').classList.remove('selected')
    }
    this.setState({
      addWeight: false,
      addWalls: true,
    });
  };

  render() {
    const { grid } = this.state;
    return (
      <div>
        <Navbar
          visualizeAlgo={this.visualizeAlgo}
          addWeights={this.addWeight}
          addWalls={this.addWalls}
          clearGrid={this.clearGrid}
          isAnimating={this.state.isAnimating}
          setSourceCoordinates={this.setSourceCoordinates}
          setDestinationCoordinates={this.setDestinationCoordinates}
          isWeightedAlgo={this.state.isWeightedAlgo}
          setAlgoType={this.setAlgoType}
          disableClear={this.state.disableClear}
        ></Navbar>
        <div className="Grid" onMouseDown={(e) => this.onMouseDown(e)} onMouseUp={() => this.onMouseUp()}>
          {grid.map((row, rowIdx) => {
            return (
              <div className="Row">
                {row.map((cell, colIdx) => {
                  return (
                    <Node
                      isStart={cell.isStart}
                      isEnd={cell.isEnd}
                      isWall={cell.isWall}
                      addClass={`Cell-${rowIdx}-${colIdx}`}
                      mouseDown={this.onMouseDown}
                      mouseEnter={this.onMouseEnter}
                      mouseUp={this.onMouseUp}
                      x={rowIdx}
                      y={colIdx}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default pathVisualizer;