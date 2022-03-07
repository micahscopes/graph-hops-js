# graph-hops-js

A tool for analyzing and exploring the structure of geodesic paths between nodes
in a graph.

[Click here for a demo.](https://micahscopes.github.io/graph-hops-js/)

## What does it do?
It generates a series of "n-hop graphs" representing the graph-geodesic
distances between the nodes of a given input graph.

### Hops
Imagine yourself traversing a graph made of nodes and edges. To get around you hop
from node to node, following the edges of the graph.

What's the shortest number of hops it takes to get from one node to another? The
shortest path from node `A` to node `B` is called a geodesic path.

### n-hop graphs
An n-hop graph's edges reflect all length `n` geodesics of the original graph.

### Directed or undirected?
For directed graphs, the minimum distance between nodes `A` and `B` might be
different depending on which one you start on. For undirected graphs it
will be the same either way.

## Usage
### Basic usage

```js
import { graphHops } from "graph-hops";

// the graph `A --> B --> C --> D`
const nodes = ["A", "B", "C", "D"];
const edges = [
  { source: "A", target: "B" },
  { source: "B", target: "C" },
  { source: "C", target: "D" },
];

const hops = graphHops(nodes, edges);

console.log(hops);
```

Will print:

```js
[
  1: [
    { source: "A", target: "B", hopDistance: 1 },
    { source: "B", target: "C", hopDistance: 1 },
    { source: "C", target: "D", hopDistance: 1 },
  ],
  2: [
    { source: "A", target: "C", hopDistance: 2 },
    { source: "B", target: "D", hopDistance: 2 },
  ],
  3: [
    { source: "A", target: "D", hopDistance: 3 },
  ],
]
```

### Input and output formats

You can use different graph formats by passing in any or all of four interface
functions: `getNodeId`, `getEdgeSource`, `getEdgeTarget` and `makeHop`.

```js
// The default interface matches the format commonly used in D3 examples
const graphInterface = {
  // how to interpret input elements
  getNodeId: (node) => node,
  getEdgeSource: (edge) => edge.source,
  getEdgeTarget: (edge) => edge.target,

  // how to make output objects
  makeHop: (source, target, hopDistance, getNodeId) => ({
    source: getNodeId(source),
    target: getNodeId(target),
    hopDistance,
  }),
};

// you can pass these functions in via a `graphInterface` object
graphHops(nodes, edges, { graphInterface })

// or directly pass only the functions you want to override
graphHops(nodes, edges, { getNodeId: (node) => node.id, makeHop: ...})
```

### Directed or undirected?

The input graph is assumed to be directed by default, but undirected input and
output can be handled by passing `directed: false` in the options object:

```js
graphHops(nodes, edges, { directed: false, ... })
```

### Alternative auto-curried interface

The `hopFinder` interface allows quick re-use of the same options with different
node/edge sets.

```js
import { hopFinder, graphInterfaceVisJS } from "graph-hops";
const graphHops = hopFinder({ graphInterface: graphInterfaceVisJS });

graphHops(A.nodes, A.edges);
graphHops(B.nodes, B.edges);
```

# API

<!-- api -->

### Functions

<dl>
<dt><a href="#hopsFinder">hopsFinder(options, nodes, edges)</a> ⇒ <code>object</code> | <code>function</code></dt>
<dd><p>Generates n-hop graph edges from the given graph&#39;s geodesics (auto-curried interface).</p>
</dd>
<dt><a href="#graphHops">graphHops(nodes, edges, [options])</a> ⇒ <code>object</code></dt>
<dd><p>Generates n-hop graph edges from the given graph&#39;s geodesics.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#NodeValue">NodeValue</a> : <code>string</code> | <code>integer</code></dt>
<dd><p>A value representing a graph node.</p>
</dd>
<dt><a href="#NodeObject">NodeObject</a> : <code>object</code></dt>
<dd><p>An object containing information about a graph node.</p>
</dd>
<dt><a href="#EdgeObject">EdgeObject</a> : <code>object</code> | <code>string</code></dt>
<dd><p>An object containing information about a graph edge. Can take any form but the default is <code>{ source, target }</code>.</p>
</dd>
<dt><a href="#getNodeIdFunction">getNodeIdFunction</a> : <code>function</code></dt>
<dd><p>A function that returns a node&#39;s ID.</p>
</dd>
<dt><a href="#getEdgeSourceFunction">getEdgeSourceFunction</a> ⇒ <code><a href="#NodeObject">NodeObject</a></code> | <code><a href="#NodeValue">NodeValue</a></code></dt>
<dd><p>A function that gets an edge&#39;s source node.</p>
</dd>
<dt><a href="#getEdgeTargetFunction">getEdgeTargetFunction</a> ⇒ <code><a href="#NodeObject">NodeObject</a></code> | <code><a href="#NodeValue">NodeValue</a></code></dt>
<dd><p>A function that gets an edge&#39;s target node.</p>
</dd>
<dt><a href="#makeHopFunction">makeHopFunction</a> ⇒ <code>object</code></dt>
<dd><p>A function that returns information about a geodesic relationship</p>
</dd>
<dt><a href="#GraphInterface">GraphInterface</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="hopsFinder"></a>

### hopsFinder(options, nodes, edges) ⇒ <code>object</code> \| <code>function</code>
Generates n-hop graph edges from the given graph's geodesics (auto-curried interface).

**Kind**: global function  
**Returns**: <code>object</code> \| <code>function</code> - An object containing lists of n-hop graph edges keyed by the lengths of their associated geodesics.  

| Param | Type |
| --- | --- |
| options | [<code>Options</code>](#Options) | 
| nodes | [<code>Array.&lt;NodeObject&gt;</code>](#NodeObject) \| [<code>Array.&lt;NodeValue&gt;</code>](#NodeValue) | 
| edges | [<code>Array.&lt;EdgeObject&gt;</code>](#EdgeObject) | 

<a name="graphHops"></a>

### graphHops(nodes, edges, [options]) ⇒ <code>object</code>
Generates n-hop graph edges from the given graph's geodesics.

**Kind**: global function  
**Returns**: <code>object</code> - An object containing lists of n-hop graph edges keyed by the lengths of their associated geodesics.  

| Param | Type |
| --- | --- |
| nodes | [<code>Array.&lt;NodeObject&gt;</code>](#NodeObject) \| [<code>Array.&lt;NodeValue&gt;</code>](#NodeValue) | 
| edges | [<code>Array.&lt;EdgeObject&gt;</code>](#EdgeObject) | 
| [options] | [<code>Options</code>](#Options) | 

<a name="NodeValue"></a>

### NodeValue : <code>string</code> \| <code>integer</code>
A value representing a graph node.

**Kind**: global typedef  
<a name="NodeObject"></a>

### NodeObject : <code>object</code>
An object containing information about a graph node.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| [id] | <code>string</code> \| <code>object</code> | 

<a name="EdgeObject"></a>

### EdgeObject : <code>object</code> \| <code>string</code>
An object containing information about a graph edge. Can take any form but the default is `{ source, target }`.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>string</code> \| <code>object</code> | The default source key for an edge object. |
| [target] | <code>string</code> \| <code>object</code> | The default target key for an edge object. |

<a name="getNodeIdFunction"></a>

### getNodeIdFunction : <code>function</code>
A function that returns a node's ID.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| node | [<code>NodeObject</code>](#NodeObject) \| [<code>NodeValue</code>](#NodeValue) | 

<a name="getEdgeSourceFunction"></a>

### getEdgeSourceFunction ⇒ [<code>NodeObject</code>](#NodeObject) \| [<code>NodeValue</code>](#NodeValue)
A function that gets an edge's source node.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| edge | [<code>EdgeObject</code>](#EdgeObject) | 

<a name="getEdgeTargetFunction"></a>

### getEdgeTargetFunction ⇒ [<code>NodeObject</code>](#NodeObject) \| [<code>NodeValue</code>](#NodeValue)
A function that gets an edge's target node.

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| edge | [<code>EdgeObject</code>](#EdgeObject) | 

<a name="makeHopFunction"></a>

### makeHopFunction ⇒ <code>object</code>
A function that returns information about a geodesic relationship

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| source | [<code>NodeObject</code>](#NodeObject) \| [<code>NodeValue</code>](#NodeValue) | The source node. |
| target | [<code>NodeObject</code>](#NodeObject) \| [<code>NodeValue</code>](#NodeValue) | The target node. |
| hopDistance | <code>number</code> | The length of the geodesic path from the source node to the target node. |
| getNodeId | <code>function</code> | The function that gets a node's ID. |

<a name="GraphInterface"></a>

### GraphInterface : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [getNodeId] | [<code>getNodeIdFunction</code>](#getNodeIdFunction) | A function that returns a node's ID. |
| [getEdgeSource] | [<code>getEdgeSourceFunction</code>](#getEdgeSourceFunction) | A function that gets an edge's source node. |
| [getEdgeTarget] | [<code>getEdgeTargetFunction</code>](#getEdgeTargetFunction) | A function that gets an edge's target node. |
| [makeHop] | [<code>makeHopFunction</code>](#makeHopFunction) | A function that returns information about a geodesic relationship. |

<a name="Options"></a>

### Options : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [directed] | <code>boolean</code> | <code>true</code> | Whether or not to treat this as a directed graph. |
| [graphInterface] | [<code>GraphInterface</code>](#GraphInterface) |  | An object containing graph interface functions. |
| [getNodeId] | [<code>getNodeIdFunction</code>](#getNodeIdFunction) |  | A function that returns a node's ID. |
| [getEdgeSource] | [<code>getEdgeSourceFunction</code>](#getEdgeSourceFunction) |  | A function that gets an edge's source node. |
| [getEdgeTarget] | [<code>getEdgeTargetFunction</code>](#getEdgeTargetFunction) |  | A function that gets an edge's target node. |
| [makeHop] | [<code>makeHopFunction</code>](#makeHopFunction) |  | A function that returns information about a geodesic relationship. |


<!-- apistop -->
