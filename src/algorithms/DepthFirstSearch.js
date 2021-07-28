export const depthFirstSearch = (grid, startNode, endNode) => {
  if (!startNode || !endNode || startNode === endNode) {
    return false;
  }
  const allvisitedNodesInOrder = [];
  const pathVisitedNodesInOrder = [];
  const DFS = DFSUtil(startNode, endNode, allvisitedNodesInOrder, grid);
  for (let i = 0; i < DFS.length; i++) {
    pathVisitedNodesInOrder.push(DFS[i]);
    if (DFS[i].isEnd) {
      break;
    }
  }
  return pathVisitedNodesInOrder;
};

const DFSUtil = (startNode, endNode, visitedNodesInOrder,grid) => {
  startNode.isVisited = true;
  const node = {
    ...startNode
  };
    visitedNodesInOrder.push(node);
    const neighbours = getNeighbours(node, grid);
    for (let i = 0; i < neighbours.length; i++) {
      if (!neighbours[i].isVisited && !neighbours[i].isWall) {
        DFSUtil(neighbours[i], endNode, visitedNodesInOrder, grid);
      }
    }
    return visitedNodesInOrder;
};

const getNeighbours = (currentNode, grid) => {
  const Neighbours = getUnvisitedNeighbours(currentNode, grid);
  Neighbours.forEach((neighbour) => {
    neighbour.previous = currentNode;
  });
  return Neighbours;
};

const getUnvisitedNeighbours = (Node, grid) => {
  const neighbours = [];
  if (Node.row > 0) neighbours.push(grid[Node.row - 1][Node.col]);
  if (Node.col < grid[0].length - 1) neighbours.push(grid[Node.row][Node.col + 1]);
  if (Node.row < grid.length - 1) neighbours.push(grid[Node.row + 1][Node.col]);
  if (Node.col > 0) neighbours.push(grid[Node.row][Node.col - 1]);
  return neighbours;
};
