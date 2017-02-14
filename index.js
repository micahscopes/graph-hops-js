import FloydWarshall from 'floyd-warshall'

function unweightedAdjacencyMatrix(nodes,edges,id){
  if (!id){
    id = function(obj){return obj}
  }
  if (nodes.length < 2) { return []; }
  var adj = [];
  for(var i=0; i<nodes.length; i++) { adj[i] = new Array(nodes.length); }

  edges.forEach((edge)=>{
    adj[nodes.indexOf(nodes.find((o)=>id(o)==edge.source))]
        [nodes.indexOf(nodes.find((o)=>id(o)==edge.target))] = 1;
  })
  return adj;
}

function graphHops(nodes,edges,id,proto){
  var adj = unweightedAdjacencyMatrix(nodes,edges,id);
  var hopMatrix = new FloydWarshall(adj).shortestPaths;
  var hops = {1: edges}
  hopMatrix.forEach((row,i)=>{
    row.forEach((hop,j)=>{
      if(hop > 1){
        if(!hops[hop]){hops[hop] = []};
        var h = {};
        if (proto) proto(h);
        h.source = nodes[i]; h.target = nodes[j]
        hops[hop].push(h);
      }
    })
  })
  return hops;
}

export {unweightedAdjacencyMatrix, graphHops};
