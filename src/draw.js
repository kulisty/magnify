function drawThePicture() {

  addButtons();

  d3.select(window).on("resize", resized);

  var drag = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

  var zoom = d3.zoom()
      .scaleExtent([0, 10])
      .translateExtent([[-10000, -10000], [10000, 10000]])
      .on("zoom", zoomed);

  var svg = d3.select("body")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

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

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      //.force("charge", d3.forceManyBody())
      .force("charge", d3.forceManyBody().strength(-30))
      //.force("link", d3.forceLink(links).strength(1).distance(20).iterations(10))
      .force("center", d3.forceCenter(width / 2, height / 2));

  var link = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

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
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation
      .force("link")
      .links(graph.links);

  // global; to be refactored later
  simu = simulation;

  d3.select(".button1").on("click", zoomedIn);
  d3.select(".button2").on("click", zoomedOut);
  d3.select(".button3").on("click", resetted);

  svg.call(zoom);

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

  function zoomedIn() {
    svg.transition().duration(750).call(zoom.scaleBy, 1.50);
  }

  function zoomedOut() {
    svg.transition().duration(750).call(zoom.scaleBy, 0.75);
  }

  function resetted() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  }

  function resized() {
    var width = window.innerWidth,
        height = window.innerHeight;
    d3.select('svg').attr("width", width).attr("height", height);
    simulation
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alphaTarget(1).restart();
    resizePanels();
    resizeButtons();
    resizeIcons();
  }

  function clickedLeft(d) {
    d.fx = null;
    d.fy = null;
    simulation.alphaTarget(1).restart();
  }

  function clickedRight(d) {
    console.log(d);
  }

} // draw the picture

function clearThePicture() {

  d3.select('body').selectAll('svg').remove();
  d3.select('body').selectAll('div').remove();
  d3.select('body').selectAll('canvas').remove();

} // clear the picture
