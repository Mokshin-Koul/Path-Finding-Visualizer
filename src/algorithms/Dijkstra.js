export const dijkstra = (grid,startNode,endNode) => {
    if(startNode === endNode || !startNode || !endNode) {
        return false
    }
    const visitedNodesInOrder = []
    startNode.distance = 0
    const unvisitedNodes = getNodes(grid)
    while(unvisitedNodes.length !== 0) {
        getSortedNodes(unvisitedNodes)
        const currentNode = unvisitedNodes.shift()
        if(currentNode.isWall) {
            continue
        }
        currentNode.isVisited = true
        const node = {
            ...currentNode
        }
        if(currentNode.distance === Infinity) return visitedNodesInOrder
        visitedNodesInOrder.push(node)
        if(currentNode === endNode) return visitedNodesInOrder
        updateUnvisitedNeighbours(node,grid)
    }
}

const updateUnvisitedNeighbours = (currentNode,grid) => {
    const neighbours = getNeighbours(currentNode,grid)
    neighbours.forEach(current => {
                if(current.weighted) {
                    current.distance = currentNode.distance + current.weight
                }
                else {
                    current.distance = currentNode.distance + 1
                }
            current.previous = currentNode
    })
}

const getSortedNodes = unvisitedNodes => {
    unvisitedNodes.sort((a,b) => a.distance - b.distance)
}

const getNeighbours = (Node,grid) => {
    const neighbours = []
    if(Node.row > 0) neighbours.push(grid[Node.row - 1][Node.col])
    if(Node.row < grid.length - 1) neighbours.push(grid[Node.row + 1][Node.col])
    if(Node.col > 0) neighbours.push(grid[Node.row][Node.col - 1])
    if(Node.col < grid[0].length - 1) neighbours.push(grid[Node.row][Node.col + 1])
    return neighbours.filter(current => !current.isVisited)
}

const getNodes = (grid) => {
    let nodes = []
    for(let i=0; i<grid.length; i++) {
        for(let j=0; j<grid[0].length; j++) {
            nodes.push(grid[i][j])
        }
    }
    return nodes
}

export const sourceToDestTracker = (visitedNodes,finishNode) => {
    const lastVisitedNode = visitedNodes[visitedNodes.length - 1]
    console.log(lastVisitedNode)
    console.log(visitedNodes)
    if(lastVisitedNode.row !== finishNode.row && lastVisitedNode.col !== finishNode.col) {
        return false
    }
    const shortestPathNodes = []
    let current = visitedNodes[visitedNodes.length - 1]
    while(current !== visitedNodes[0]) {
        shortestPathNodes.push(current)
        current = current.previous
    }
    return shortestPathNodes.reverse()
}