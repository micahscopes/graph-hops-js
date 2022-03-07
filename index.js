import FloydWarshall from "floyd-warshall";
import graphInterfaceDefault from "./graphInterfaces";

function buildUnweightedAdjacencyMatrix(
  nodes = [],
  edges = [],
  graphInterface = {}
) {
  graphInterface = { ...graphInterfaceDefault, ...graphInterface };
  const { getNodeId, getSource, getTarget } = graphInterface;
  var adj = [];
  for (var i = 0; i < nodes.length; i++) {
    adj[i] = new Array(nodes.length);
  }

  edges.forEach((edge) => {
    adj[
      nodes.indexOf(nodes.find((node) => getNodeId(node) == getSource(edge)))
    ][
      nodes.indexOf(nodes.find((node) => getNodeId(node) == getTarget(edge)))
    ] = 1;
  });
  return adj;
}

const iterateUndirected = (adjacencyMatrix, iterFn) => {
  // only iterate over the upper triangular part of the adjacency matrix
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    const row = adjacencyMatrix[i];
    for (let j = i; j < row.length; j++) {
      const entryValue = row[j];
      iterFn(i, j, entryValue);
    }
  }
};

const iterateDirected = (adjacencyMatrix, iterFn) => {
  // use the whole adjacency matrix to build edges
  adjacencyMatrix.forEach((row, i) => {
    row.forEach((entryValue, j) => {
      iterFn(i, j, entryValue);
    });
  });
};

const defaultOptions = {
  directed: true,
  graphInterface: {},
};

export function graphHops(
  nodes,
  edges,
  opts = defaultOptions
) {
  let { directed, graphInterface, makeHop } = opts;
  // fallback to defaults
  graphInterface = {...graphInterfaceDefault, ...graphInterface, ...opts};
  // if a `makeHop` function is specified in the options use that one

  makeHop = makeHop || graphInterface.makeHop;
  // make the graph's adjacency matrix and find all shortest paths
  const adjacencyMatrix = buildUnweightedAdjacencyMatrix(
    nodes,
    edges,
    graphInterface
  );
  const hopsAdjacencyMatrix = new FloydWarshall(adjacencyMatrix).shortestPaths;

  // make info objects for each hop
  const hops = { 1: edges };
  const addHop = (rowIndex, colIndex, hopDistance) => {
    if (hopDistance > 1) {
      if (!hops[hopDistance]) {
        hops[hopDistance] = [];
      }
      let hop = makeHop(
        nodes[rowIndex],
        nodes[colIndex],
        hopDistance,
        graphInterface.getNodeId
      );
      hops[hopDistance].push(hop);
    }
  };

  if (directed) {
    iterateDirected(hopsAdjacencyMatrix, addHop);
  } else {
    iterateUndirected(hopsAdjacencyMatrix, addHop);
  }

  return hops;
}
