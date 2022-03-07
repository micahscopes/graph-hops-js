import FloydWarshall from "floyd-warshall";
import graphInterfaceDefault from "./graphInterfaces";
import "./graphInterfaces";
export * from "./graphInterfaces";
import curry from "curry";

function buildUnweightedAdjacencyMatrix(
  nodes = [],
  edges = [],
  graphInterface = {}
) {
  graphInterface = { ...graphInterfaceDefault, ...graphInterface };
  const { getNodeId, getEdgeSource, getEdgeTarget } = graphInterface;
  var adj = [];
  for (var i = 0; i < nodes.length; i++) {
    adj[i] = new Array(nodes.length);
  }

  edges.forEach((edge) => {
    adj[
      nodes.indexOf(
        nodes.find((node) => getNodeId(node) == getEdgeSource(edge))
      )
    ][
      nodes.indexOf(
        nodes.find((node) => getNodeId(node) == getEdgeTarget(edge))
      )
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

/**
 * @typedef {Object} Options
 * @property {boolean} [directed=true] - Whether or not to treat this as a directed graph.
 * @property {GraphInterface} [graphInterface] - An object containing graph interface functions.
 * @property {getNodeIdFunction} [getNodeId] - A function that returns a node's ID.
 * @property {getEdgeSourceFunction} [getEdgeSource] - A function that gets an edge's source node.
 * @property {getEdgeTargetFunction} [getEdgeTarget] - A function that gets an edge's target node.
 * @property {makeHopFunction} [makeHop] - A function that returns information about a geodesic relationship.
 */

const defaultOptions = {
  directed: true,
  graphInterface: {},
};

/**
 * Generates n-hop graph edges from the given graph's geodesics (auto-curried interface).
 * @function
 * @param {Options} options
 * @param {Array.<NodeObject>|Array.<NodeValue>} nodes
 * @param {Array.<EdgeObject>} edges
 * @return {object|function} An object containing lists of n-hop graph edges keyed by the lengths of their associated geodesics.
 */
export const hopsFinder = curry((options, nodes, edges) => {
  options = { ...defaultOptions, ...options };
  let { directed, graphInterface, makeHop } = options;

  // fallback to defaults
  graphInterface = { ...graphInterfaceDefault, ...graphInterface, ...options };

  // if a `makeHop` function is specified in the options use that one
  makeHop = makeHop || graphInterface.makeHop;

  // make the graph's adjacency matrix and find all shortest paths
  const adjacencyMatrix = buildUnweightedAdjacencyMatrix(
    nodes,
    edges,
    graphInterface
  );
  const hopsAdjacencyMatrix = new FloydWarshall(adjacencyMatrix).shortestPaths;
  const hops = {};

  // make info objects for each hop
  const addHop = (rowIndex, colIndex, distance) => {
    if (distance > 0) {
      if (!hops[distance]) {
        hops[distance] = [];
      }
      let hop = makeHop(
        nodes[rowIndex],
        nodes[colIndex],
        distance,
        graphInterface.getNodeId
      );
      hops[distance].push(hop);
    }
  };

  if (directed) {
    iterateDirected(hopsAdjacencyMatrix, addHop);
  } else {
    iterateUndirected(hopsAdjacencyMatrix, addHop);
  }

  return hops;
});

/**
 * Generates n-hop graph edges from the given graph's geodesics.
 * @function
 * @param {Array.<NodeObject>|Array.<NodeValue>} nodes
 * @param {Array.<EdgeObject>} edges
 * @param {Options} [options]
 * @return {object} An object containing lists of n-hop graph edges keyed by the lengths of their associated geodesics.
 */
export const graphHops = (nodes, edges, options) =>
  hopsFinder(options, nodes, edges);
