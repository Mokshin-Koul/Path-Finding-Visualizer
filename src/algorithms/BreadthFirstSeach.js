export const breadthFirstSearch = (grid,startNode,endNode) => {
    if(!startNode || !endNode || startNode===endNode) {
        return false
    }
    startNode.isVisited = true
    const visitedNodesInOrder = []
    const queue = []
    queue.push(startNode)
    while(!!queue.length) {
        const currentNode = queue.shift()
        const node = {
            ...currentNode,
        }
        if(currentNode.isWall) continue
        visitedNodesInOrder.push(node)
        if(currentNode === endNode) return visitedNodesInOrder
        updatedNeighbours(node,queue,grid)
    }
}

const updatedNeighbours = (currentNode,queue,grid) => {
    const unvisitedNeughbours = getUnvisitedNeighbours(grid,currentNode)
    unvisitedNeughbours.forEach(neighbour => {
        neighbour.isVisited = true
        neighbour.previous = currentNode
        queue.push(neighbour)
    })
}

const getUnvisitedNeighbours = (grid,Node) => {
    const neighbours = []
    if(Node.row > 0) neighbours.push(grid[Node.row - 1][Node.col])
    if(Node.row < grid.length - 1) neighbours.push(grid[Node.row + 1][Node.col])
    if(Node.col > 0) neighbours.push(grid[Node.row][Node.col - 1])
    if(Node.col < grid[0].length - 1) neighbours.push(grid[Node.row][Node.col + 1])
    // if(Node.row > 0 && Node.col > 0) neighbours.push(grid[Node.row - 1][Node.col - 1])
    // if(Node.row > 0 && (Node.col < grid[0].length - 1)) neighbours.push(grid[Node.row - 1][Node.col + 1])
    // if((Node.row < grid.length - 1) && Node.col > 0) neighbours.push(grid[Node.row + 1][Node.col - 1])
    // if((Node.row < grid.length - 1) && (Node.col < grid[0].length - 1)) neighbours.push(grid[Node.row + 1][Node.col + 1])
    return neighbours.filter(current => !current.isVisited)

}
