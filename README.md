# graph-hops-js

Uses Floyd-Warshall to derive n-hop graphs of a directed graph.

## Usage

Check out these tests:
```javascript
var assert = require('assert');
var gh = require('../dist/graph-hops');
describe('graph-hops-js', function() {
  var nodes = ["a","b","c","d"];
  var edges = [ { source: "a", target: "b" },
                { source: "b", target: "c" },
                { source: "c", target: "d" },
                { source: "d", target: "a" } ];

  var edgesAlt = [ { from: "a", to: "b" },
                   { from: "b", to: "c" },
                   { from: "c", to: "d" },
                   { from: "d", to: "a" } ];

  describe('graphHops', function() {
    it('should give expected results with simple graph', function() {
      var hops = gh.graphHops(nodes,edges);
      //console.log(hops);
      assert.equal(hops[2][0].source,"a");
      assert.equal(hops[2][0].target,"c");
      assert.equal(hops[3][0].source,"a");
      assert.equal(hops[3][0].target,"d");
    });

    it('should allow for custom input formats', function(){
      // use the same edges, except that nodes themselves are objects with an `id` property
      var nodesModifiedId = nodes.map((n) => { return {id: n}});
      var hops = gh.graphHops(nodesModifiedId,edgesAlt,{ id: (n) => n.id,
                                                         source: (edge) => edge.from,
                                                         target: (edge) => edge.to })
      //console.log(hops);
      
      assert.equal(hops[2][0].source,"a");
      assert.equal(hops[2][0].target,"c");
      assert.equal(hops[3][0].source,"a");
      assert.equal(hops[3][0].target,"d");
    });

    it('should allow for custom output formats', function(){
      function makeHopObject(source, target, hopDistance, id) {
        return { hopSource: source,
                 hopTarget: target,
                 description: `from ${source} to ${target}, the shortest hop is of distance ${hopDistance}`
               }
      }
      var hops = gh.graphHops(nodes,edges,{ makeHop: makeHopObject })
      //console.log(hops);
      
      assert.equal(hops[2][0].hopSource,"a");
      assert.equal(hops[2][0].hopTarget,"c");
      assert.equal(hops[2][0].description,"from a to c, the shortest hop is of distance 2");
    });
  });
}
);
```
