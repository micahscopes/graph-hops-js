(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.graphHops = global.graphHops || {})));
}(this, function (exports) { 'use strict';

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

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
      get: function get() {
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
      get: function get() {
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
      get: function get() {
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
        if (hops <= 1) {
          return;
        }
        if (!hops[hop]) {
          hops[hop] = [];
        };
        hops[hop].push({ source: nodes[i], target: nodes[j] });
      });
    });
    return hops;
  }

  exports.unweightedAdjacencyMatrix = unweightedAdjacencyMatrix;
  exports.graphHops = graphHops;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=graph-hops.js.map