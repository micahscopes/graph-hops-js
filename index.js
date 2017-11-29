import FloydWarshall from 'floyd-warshall'

function unweightedAdjacencyMatrix(nodes, edges, { id,source,target } = {} )
{
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

function makeHopD3(source, target, hopDistance, id ){
  return {source: id(source), target: id(target)};
}

function makeHopVisJS(source, target, hopDistance, id){
  return {from: id(source), to: (target)};
}

function graphHops(nodes,edges,{ id,source,target,makeHop } = {}){
  // use the D3 style by default
  if (!id) { id = (node) => node }
  if (!makeHop) { makeHop = makeHopD3 }
  var adj = unweightedAdjacencyMatrix(nodes, edges,{id: id, source: source, target: target});
  var hopMatrix = new FloydWarshall(adj).shortestPaths;
  var hops = {1: edges}
  hopMatrix.forEach((row,i)=>{
    row.forEach((hopDistance,j)=>{
      if(hopDistance > 1){
        if(!hops[hopDistance]){hops[hopDistance] = []};
        var h = makeHop(nodes[i], nodes[j], hopDistance, id);
        hops[hopDistance].push(h);
      }
    })
  })
  return hops;
}

export {unweightedAdjacencyMatrix, graphHops, makeHopVisJS, makeHopD3};

