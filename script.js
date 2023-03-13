"use strict";

class Graph {
  constructor() {
    this.adj = {};
  }

  addVertex(v) {
    if (!this.adj[v]) this.adj[v] = [];
  }
  addEdge(u, v) {
    this.adj[u].push(v);
  }
  print() {
    console.log(this.adj);
  }
}

const mygraph = new Graph();
const graphProp = {};
const addBtn = document
  .getElementById("add")
  .addEventListener("click", function () {
    //getting values from html
    const u = document.getElementById("source").value;
    const v = document.getElementById("destination").value;

    //if u or v is empty we do not have a valid connection from (u,v)
    if (!u || !v) return;
    mygraph.addVertex(u);
    mygraph.addVertex(v);
    mygraph.addEdge(u, v);

    const vertices = Object.keys(mygraph.adj);
    const indegree = {};

    for (const vertice of vertices) {
      for (const neighbour of mygraph.adj[vertice]) {
        indegree[neighbour] = indegree[neighbour] + 1 || 1;
      }
    }
    console.log(indegree);

    const q = [];
    for (const vertice of vertices) {
      if (!indegree[vertice]) q.push(vertice);
    }

    let cnt = 0;
    const order = {};
    while (q.length) {
      const curr = q.shift();
      order[curr] = cnt++;
      for (const neighbour of mygraph.adj[curr]) {
        indegree[neighbour]--;
        if (indegree[neighbour] === 0) q.push(neighbour);
      }
    }

    let nodes = [];
    let edges = [];
    for (const v of vertices) nodes.push({ id: v });
    for (const v of vertices) {
      for (const u of mygraph.adj[v]) {
        edges.push({ from: v, to: u });
      }
    }
    const obj = {
      nodes,
      edges,
    };
    document.getElementById("myg").innerHTML = "";
    var chart = anychart.graph(obj);

    // set the title
    chart.title("Original Graph");
    //sundar nodes
    var node = chart.nodes();

    // set the size of nodes
    node.normal().height(30);
    node.hovered().height(45);
    node.selected().height(45);

    // set the fill of nodes
    node.normal().fill("#ffa000");
    node.hovered().fill("white");
    node.selected().fill("#ffa000");

    // set the stroke of nodes
    node.normal().stroke(null);
    node.hovered().stroke("#333333", 3);
    node.selected().stroke("#333333", 3);

    chart.nodes().labels().enabled(true);

    chart.nodes().labels().format("{%id}");
    chart.nodes().labels().fontSize(15);
    chart.nodes().labels().fontWeight(600);
    // draw the chart
    chart.container("myg").draw();
    document.getElementById(
      "myg"
    ).innerHTML += `<div class="w-100 text-end"><button onclick="saveOg()" class="btn" id="og"><i class="fas fa-file-download"></i></button></div>`;
    graphProp.og = chart;
    //creating order graph
    console.log(order);
    const temp = new Array(nodes.length);
    for (let [key, val] of Object.entries(order)) {
      temp[val] = key;
    }
    console.log(temp);
    const orderEdges = [];
    for (let i = 1; i < temp.length; i++) {
      orderEdges.push({ from: temp[i - 1], to: temp[i] });
    }
    const orderNode = [];
    for (const v of Object.keys(order)) orderNode.push({ id: v });
    const orderObj = {
      nodes: orderNode,
      edges: orderEdges,
    };

    document.getElementById("myg2").innerHTML = "";
    var chart = anychart.graph(orderObj);
    // set the title
    chart.title("Order Graph");
    //sundar nodes
    var node = chart.nodes();

    // set the size of nodes
    node.normal().height(30);
    node.hovered().height(45);
    node.selected().height(45);

    // set the fill of nodes
    node.normal().fill("#ffa000");
    node.hovered().fill("white");
    node.selected().fill("#ffa000");

    // set the stroke of nodes
    node.normal().stroke(null);
    node.hovered().stroke("#333333", 3);
    node.selected().stroke("#333333", 3);

    chart.nodes().labels().enabled(true);

    chart.nodes().labels().format("{%id}");
    chart.nodes().labels().fontSize(15);
    chart.nodes().labels().fontWeight(600);
    // draw the chart
    chart.container("myg2").draw();
    graphProp.fin = chart;
    document.getElementById(
      "myg2"
    ).innerHTML += `<div class="w-100 text-end"><button onclick="saveFin()" class="btn" id="og"><i class="fas fa-file-download"></i></button></div>`;
    if (cnt !== vertices.length) {
      console.log("Cycle is present");
      document.getElementById(
        "myg2"
      ).innerHTML = `<h3 class="text-danger h-100 d-flex justify-content-center align-items-center">Cycle Detected! Please Reset</h3>`;

      document.getElementById("source").setAttribute("disabled", "disabled");
      document
        .getElementById("destination")
        .setAttribute("disabled", "disabled");
      document.getElementById("add").setAttribute("disabled", "disabled");
    }
    //clearing textfield to prevent duplicacy
    document.getElementById("destination").value = "";
    document.getElementById("source").value = "";
  });

function saveOg() {
  graphProp.og.saveAsPdf();
}

function saveFin() {
  graphProp.fin.saveAsPdf();
}
const resetBtn = document
  .getElementById("reset")
  .addEventListener("click", function () {
    document.getElementById("source").removeAttribute("disabled");
    document.getElementById("destination").removeAttribute("disabled");
    document.getElementById("add").removeAttribute("disabled");
    mygraph.adj = {};
    document.getElementById("myg").innerHTML = "";
    document.getElementById("myg2").innerHTML = "";
  });
