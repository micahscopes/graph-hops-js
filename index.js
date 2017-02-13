import FloydWarshall from 'floyd-warshall'

export function unweightedAdjacencyMatrix(nodes,edges){
  if (nodes.length < 2) { return []; }
  // var colors = rainbow(nodes.length)
  var adj = [];
  for(var i=0; i<nodes.length; i++) {
      adj[i] = new Array(nodes.length);
  }

  edges.forEach((edge)=>{
    adj[nodes.indexOf(edge.source)][nodes.indexOf(edge.target)] = 1;
  })
  return adj;
}

export function hops(nodes,edges){
  var adj = unweightedAdjacencyMatrix(nodes,edges);
  var hopMatrix = new FloydWarshall(adj).shortestPaths;
  var hops = {}
  hopMatrix.forEach((row,i)=>{
    row.forEach((hop,j)=>{
      if(!hops[hop]){hops[hop] = []};
      hops[hop].push({source: nodes[i], target: nodes[j]})
    })
  })
  return hops;
}
