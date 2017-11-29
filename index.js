import FloydWarshall from 'floyd-warshall'

function unweightedAdjacencyMatrix(nodes,edges,id,source,target){
  if (!id) { id = (node) => node }
  if (!source) { source = (edge) => edge.source } 
  if (!target) { target = (edge) => edge.target }

  if (nodes.length < 2) { return []; }
  var adj = [];
  for(var i=0; i<nodes.length; i++) { adj[i] = new Array(nodes.length); }

  edges.forEach((edge)=>{
    adj[nodes.indexOf(nodes.find( (node)=>id(node)==source(edge) ))]
        [nodes.indexOf(nodes.find( (node)=>id(node)==target(edge) ))] = 1;
  })
  return adj;
}

function makeHopD3(source, target){
  return {source: source, target: target};
}

function makeHopVisJS(source, target){
  return {from: source, to: target};
}

function graphHops(nodes,edges,id,makeHop){
  // use the D3 style by default
  if (!makeHop) { makeHop = makeHopD3 }
  
  var adj = unweightedAdjacencyMatrix(nodes,edges,id);
  var hopMatrix = new FloydWarshall(adj).shortestPaths;
  var hops = {1: edges}
  hopMatrix.forEach((row,i)=>{
    row.forEach((hop,j)=>{
      if(hop > 1){
        if(!hops[hop]){hops[hop] = []};
        var h = makeHop(nodes[i],nodes[j]);
        hops[hop].push(h);
      }
    })
  })
  return hops;
}

export {unweightedAdjacencyMatrix, graphHops};

