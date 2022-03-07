/**
 * A value representing a graph node.
 * @typedef {string|integer} NodeValue
 */

/**
 * An object containing information about a graph node.
 * @typedef {object} NodeObject
 * @param {string|object} [id]
 */

/**
 * An object containing information about a graph edge. Can take any form but the default is `{ source, target }`.
 * @typedef {object|string} EdgeObject
 * @param {string|object} [source] - The default source key for an edge object.
 * @param {string|object} [target] - The default target key for an edge object.
 */

/**
 * A function that returns a node's ID.
 * @callback getNodeIdFunction
 * @param {NodeObject|NodeValue} node
 */

/**
 * A function that gets an edge's source node.
 * @callback getEdgeSourceFunction
 * @param {EdgeObject} edge
 * @returns {NodeObject|NodeValue}
 */

/**
 * A function that gets an edge's target node.
 * @callback getEdgeTargetFunction
 * @param {EdgeObject} edge
 * @returns {NodeObject|NodeValue}
 */

/**
 * A function that returns information about a geodesic relationship
 * @callback makeHopFunction
 * @param {NodeObject|NodeValue} source - The source node.
 * @param {NodeObject|NodeValue} target - The target node.
 * @param {number} hopDistance - The length of the geodesic path from the source node to the target node.
 * @param {function} getNodeId - The function that gets a node's ID.
 * @returns {object}
 */

/**
 * @typedef {Object} GraphInterface
 * @property {getNodeIdFunction} [getNodeId] - A function that returns a node's ID.
 * @property {getEdgeSourceFunction} [getEdgeSource] - A function that gets an edge's source node.
 * @property {getEdgeTargetFunction} [getEdgeTarget] - A function that gets an edge's target node.
 * @property {makeHopFunction} [makeHop] - A function that returns information about a geodesic relationship.
 */

export const graphInterfaceDefault = {
  getNodeId: (node) => node,
  getEdgeSource: (edge) => edge.source,
  getEdgeTarget: (edge) => edge.target,
  makeHop: (source, target, hopDistance, getNodeId) => ({
    source: getNodeId(source),
    target: getNodeId(target),
    hopDistance,
  }),
};

export default graphInterfaceDefault;

export const graphInterfaceD3 = {
  ...graphInterfaceDefault,
};

export const graphInterfaceVisJS = {
  ...graphInterfaceDefault,
  getEdgeSource: (edge) => edge.from,
  getEdgeTarget: (edge) => edge.to,
  makeHop: (source, target, hopDistance, getNodeId) => ({
    from: getNodeId(source),
    to: getNodeId(target),
    hopDistance,
  }),
};

export const graphInterfaceCytoscapeJS = {
  getNodeId: (node) => node.data.id,
  getEdgeSource: (edge) => edge.data.source,
  getEdgeTarget: (edge) => edge.data.target,
  makeHop: (source, target, hopDistance, getNodeId) => ({
    data: {
      source: getNodeId(source),
      target: getNodeId(target),
      hopDistance,
    },
  }),
};
