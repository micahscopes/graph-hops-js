var assert = require('assert');
var gh = require('../dist/graph-hops');
console.log(gh)
describe('graphHops', function() {
  var nodes = ["a","b","c","d"];
  var edges = [ {source: "a", target: "b"},
                {source: "b", target: "c"},
                {source: "c", target: "d"},
                {source: "d", target: "a"}
              ];
  describe('hops', function() {
    var hops = gh.graphHops(nodes,edges);
    console.log(hops);
    it('should give expected results with simple graph', function() {
      assert.equal(hops[2][0].source,"a");
      assert.equal(hops[2][0].target,"c");
      assert.equal(hops[3][0].source,"a");
      assert.equal(hops[3][0].target,"d");
    });
  });
});
