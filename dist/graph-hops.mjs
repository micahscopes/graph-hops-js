var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/** Calculator for finding widest and/or shortest paths in a graph using the Floyed-Warshall algorithm. */

var FloydWarshall = function () {

  /**
   * Create a Floyd-Warshall calculator for a specific adjacency matrix.
   * @param {number[][]} adjacencyMatrix - A square matrix representing a graph with weighted edges.
   */
  function FloydWarshall(adjacencyMatrix) {
    classCallCheck(this, FloydWarshall);

    this.adjacencyMatrix = adjacencyMatrix;
  }

  /**
   * Calculates the widest distance from one node to the other.
   * @return {number[][]} - Matrix with distances from a node to the other
   */


  createClass(FloydWarshall, [{
    key: '_initializeDistanceMatrix',


    /**
     * @private
     */
    value: function _initializeDistanceMatrix(blankFiller) {
      var distMatrix = [];
      for (var i = 0; i < this.order; ++i) {
        distMatrix[i] = [];
        for (var j = 0; j < this.order; ++j) {
          if (i === j) {
            distMatrix[i][j] = 0;
          } else {
            var val = this.adjacencyMatrix[i][j];
            if (val) {
              distMatrix[i][j] = val;
            } else {
              distMatrix[i][j] = blankFiller;
            }
          }
        }
      }
      return distMatrix;
    }
  }, {
    key: 'widestPaths',
    get: function get$$1() {
      var distMatrix = this._initializeDistanceMatrix(0);
      for (var k = 0; k < this.order; ++k) {
        for (var i = 0; i < this.order; ++i) {
          if (i === k) {
            continue;
          }
          for (var j = 0; j < this.order; ++j) {
            if (j === i || j === k) {
              continue;
            }
            var direct = distMatrix[i][j];
            var detour = Math.min(distMatrix[i][k], distMatrix[k][j]);
            if (detour > direct) {
              distMatrix[i][j] = detour;
            }
          }
        }
      }
      return distMatrix;
    }

    /**
     * Calculates the shortest paths of the weighted graph.
     * (The output will not be accurate if the graph has a negative cycle.)
     * @return {number[][]} - Matrix with distances from a node to the other
     */

  }, {
    key: 'shortestPaths',
    get: function get$$1() {
      var distMatrix = this._initializeDistanceMatrix(Infinity);

      for (var k = 0; k < this.order; ++k) {
        for (var i = 0; i < this.order; ++i) {
          for (var j = 0; j < this.order; ++j) {
            var dist = distMatrix[i][k] + distMatrix[k][j];
            if (distMatrix[i][j] > dist) {
              distMatrix[i][j] = dist;
            }
          }
        }
      }

      for (var _i = 0; _i < this.order; ++_i) {
        for (var _j = 0; _j < this.order; ++_j) {
          if (distMatrix[_i][_j] === Infinity) {
            distMatrix[_i][_j] = -1;
          }
        }
      }

      return distMatrix;
    }

    /**
     * Get the order of the adjacency matrix (and of the output distance matrices.)
     * @return {integer} The order of the adjacency matrix.
     */

  }, {
    key: 'order',
    get: function get$$1() {
      return this.adjacencyMatrix.length;
    }
  }]);
  return FloydWarshall;
}();

var index = FloydWarshall;

function unweightedAdjacencyMatrix(nodes, edges) {
  if (nodes.length < 2) {
    return [];
  }
  var adj = [];
  for (var i = 0; i < nodes.length; i++) {
    adj[i] = new Array(nodes.length);
  }

  edges.forEach(function (edge) {
    adj[nodes.indexOf(edge.source)][nodes.indexOf(edge.target)] = 1;
  });
  return adj;
}

function graphHops(nodes, edges) {
  var adj = unweightedAdjacencyMatrix(nodes, edges);
  var hopMatrix = new index(adj).shortestPaths;
  var hops = {};
  hopMatrix.forEach(function (row, i) {
    row.forEach(function (hop, j) {
      if (hop > 1) {
        if (!hops[hop]) {
          hops[hop] = [];
        }
        hops[hop].push({ source: nodes[i], target: nodes[j] });
      }
    });
  });
  return hops;
}

export { unweightedAdjacencyMatrix, graphHops };
//# sourceMappingURL=graph-hops.mjs.map
