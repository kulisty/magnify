function drawThePicture() {

  d3.select(window).on("resize", resized);

  var drag = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

  var zoom = d3.zoom()
      .scaleExtent([0, 10])
      //.translateExtent([[-10000, -10000], [10000, 10000]])
      .on("zoom", zoomed);

  var svg = d3.select("body")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .call(zoom);

  var graph = file.data.graph;

  var width = +svg.attr("width"),
      height = +svg.attr("height");

  var r = svg.append("rect")
      .attr("class", "view")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

  var g = svg.append("g");

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  /*OK
  var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink())
      .force("center", d3.forceCenter(width / 2, height / 2));
  */
  /*OK
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.index; }))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(width / 2, height / 2));
  */
  /*OK
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(8).strength(0.45))
      .force("charge", d3.forceManyBody().strength(-30).distanceMax(250))
      .force("center", d3.forceCenter(width / 2, height / 2));
  */

  /*
  var simulation = d3.forceSimulation(graph.nodes)
      .force("charge", d3.forceManyBody().strength(-30))
      .force("link", d3.forceLink(graph.links).strength(1).distance(10));
      //.force("link", d3.forceLink(links).strength(1).distance(20).iterations(10))
      //.force("x", d3.forceX())
      //.force("y", d3.forceY());
  */

  /*
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(8).strength(0.45))
      .force("charge", d3.forceManyBody().strength(-2).distanceMax(250))
      .force("center", d3.forceCenter(width / 2, height / 2));
  */

  /*
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(8).strength(0.45))
      .force("charge", d3.forceManyBody().strength(-30).distanceMax(250))
      .force("center", d3.forceCenter(width / 2, height / 2));
  */

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody().strength(-15).theta(0.75).distanceMin(10).distanceMax(300)) //.strength(-10)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("colision", d3.forceCollide(1))
      .force("vertical", d3.forceY().strength(0.018))
      .force("horizontal", d3.forceX().strength(0.006));

  var link = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .style("stroke", function(d) { return 'orange'; })
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = g.append("g").attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .on("click", clickedLeft)
      .on("contextmenu", clickedRight)
      .call(drag);

  node
      .append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation
      .force("link")
      .links(graph.links);

  //svg.call(zoom);

  // global elements
  view.svg = svg;
  view.zoom = zoom;
  view.simu = simulation;

  // additional gui elements
  addButtons();
  addPanels();
  addIcons();

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    //uncomment for instant realese; for now they remain fixed
    //d.fx = null;
    //d.fy = null;
  }

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }

  function resized() {
    var width = window.innerWidth,
        height = window.innerHeight;
    d3.select('svg').attr("width", width).attr("height", height);
    simulation
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alphaTarget(1).restart();
    resizeButtons();
    resizePanels();
    resizeIcons();
  }

  function clickedLeft(d) {
    d.fx = null;
    d.fy = null;
    simulation.alphaTarget(1).restart();
    //refreshIcons();
    console.log(d);
  }

  function clickedRight(d) {
    view.obj = d;
    refreshIcons();
    console.log(d);
  }

} // draw the picture

function clearThePicture() {

  d3.select('body').selectAll('svg').remove();
  d3.select('body').selectAll('div').remove();
  d3.select('body').selectAll('canvas').remove();

} // clear the picture
