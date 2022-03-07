import assert from 'assert'
import { graphHops } from '../dist/esm/index.js'

// test data
const nodes = ["a", "b", "c", "d"];
const edges = [
  { source: "a", target: "b" },
  { source: "b", target: "c" },
  { source: "c", target: "d" },
  { source: "d", target: "a" },
];
const edgesAlternativeFormat = [
  { from: "a", to: "b" },
  { from: "b", to: "c" },
  { from: "c", to: "d" },
  { from: "d", to: "a" },
];
const undirectedGraphEdges = [
  { source: "a", target: "b" },
  { source: "b", target: "a" },
  { source: "b", target: "c" },
  { source: "c", target: "b" },
  { source: "c", target: "d" },
  { source: "d", target: "c" },
];
const nodesWithId = nodes.map((n) => {
  return { id: n };
});
describe("graph-hops-js", function () {
  describe("graphHops", function () {
    it("should give expected results with simple graph", function () {
      var hops = graphHops(nodes, edges);

      assert.equal(hops[2][0].source, "a");
      assert.equal(hops[2][0].target, "c");
      assert.equal(hops[3][0].source, "a");
      assert.equal(hops[3][0].target, "d");
    });

    it("should allow for custom input formats", function () {
      // use the same edges, except that nodes themselves are objects with an `id` property
      const graphInterface = {
        getNodeId: (n) => n.id,
        getEdgeSource: (edge) => edge.from,
        getEdgeTarget: (edge) => edge.to,
      };
      var hops = graphHops(nodesWithId, edgesAlternativeFormat, {
        graphInterface,
      });

      assert.equal(hops[2][0].source, "a");
      assert.equal(hops[2][0].target, "c");
      assert.equal(hops[3][0].source, "a");
      assert.equal(hops[3][0].target, "d");
    });

    it("should allow for custom output formats", function () {
      function makeHopObject(source, target, distance, id) {
        return {
          hopSource: source,
          hopTarget: target,
          description: `from ${source} to ${target}, the shortest hop is of distance ${distance}`,
        };
      }
      var hops = graphHops(nodes, edges, { makeHop: makeHopObject });

      assert.equal(hops[2][0].hopSource, "a");
      assert.equal(hops[2][0].hopTarget, "c");
      assert.equal(
        hops[2][0].description,
        "from a to c, the shortest hop is of distance 2"
      );
    });

    it("creates both directed and undirected hop graphs", function () {
      assert.equal(
        graphHops(nodes, undirectedGraphEdges, { directed: true })[3].length,
        2
      );
      assert.equal(
        graphHops(nodes, undirectedGraphEdges, { directed: false })[3].length,
        1
      );
    });
  });
});
