export const graphInterfaceDefault = {
  getNodeId: (node) => node,
  getSource: (edge) => edge.source,
  getTarget: (edge) => edge.target,
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
  getSource: (edge) => edge.from,
  getTarget: (edge) => edge.to,
  makeHop: (source, target, hopDistance, getNodeId) => ({
    from: getNodeId(source),
    to: getNodeId(target),
    hopDistance,
  }),
};

export const graphInterfaceCytoscapeJS = {
  getNodeId: (node) => node.data.id,
  getSource: (edge) => edge.data.source,
  getTarget: (edge) => edge.data.target,
  makeHop: (source, target, hopDistance, getNodeId) => ({
    data: {
      source: getNodeId(source),
      target: getNodeId(target),
      hopDistance,
    },
  }),
};
