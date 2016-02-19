function drawThePicture(error, graph) {

  if (error) throw error;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .size([width, height])
      .charge(-120)
      .linkDistance(20);

  var drag = force.drag()
      .on("dragstart", dragstart);

  var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .on("dblclick", dblclick)
      .call(drag);

  node.append("title")
      .text(function(d) { return d.name; });

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
  }

  function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
  }

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  force.on("tick", tick);

} // draw the picture
