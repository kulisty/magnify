function drawThePicture(error, graph) {

  if (error) throw error;

  d3.select(window).on("resize", onResize);

  force = d3.layout.force()
      .size([width, height])
      .charge(-120)
      .linkDistance(20)
      .on("tick", onTick);

  var color = d3.scale.category20();
  var drag = force.drag().on("dragstart", dragstart);

  /*
  var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);
  */

  link = svg.selectAll(".link")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      //.text(function(d) { return d.name + "\n" + d.url; })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("contextmenu", rgtclick)
      //.on("dblclick", dblclick)
      .on("click", function(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d3.select().classed("fixed", d.fixed = false);
        force.resume();
      })
      .call(
        force.drag().on("dragstart", dragstart)
      );

  // Tooltips handled by the browser
  svg.selectAll("circle")
     .append("title")
     .text(function(d) { return d.name + "\n" + d.url; });

  force
      .nodes(graph.nodes)
      .links(graph.links);

  force.start();

} // draw the picture

function updateThePicture(error, graph) {

  if (error) throw error;

  force.resume();

  var n = force.nodes();
  var l = force.links();

  for (i = 0; i <= 94; i++) {
      n[i].x = graph.nodes[i].x; //n[i].x + 100;
      n[i].y = graph.nodes[i].y; //n[i].y + 100;
      n[i].px = n[i].x;
      n[i].py = n[i].y;
      n[i].fixed = true;
  };

  svg.selectAll('.node').classed("fixed", function(d) {d.fixed = true} );

} // update the picture
