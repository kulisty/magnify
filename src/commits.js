function clickGithub() {
  shell.openExternal("http://github.com");
}

function clickSova() {
  shell.openExternal("http://www.uw.edu.pl");
}

function clickMagnify() {
  shell.openExternal("http://www.mimuw.edu.pl");
}

function clickZoomIn() {
  console.log("Zoom in");
}

function clickZoomOut() {
  console.log("Zoom out");
}

function clickZoomFit() {
  console.log("Zoom fit");
}

function clickReload() {
  //clickUnfreeze();
  //force.stop();
  //force.start();
  d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = false} );
  d3.layout.force().stop();
  d3.layout.force().start();
}

function clickFiles() {
  shell.openExternal("http://www.mimuw.edu.pl");
}

function clickClasses() {
  shell.openExternal("http://www.mimuw.edu.pl");
}

function clickCommits() {
  shell.openExternal("http://www.mimuw.edu.pl");
}

function clickAuthors() {
  shell.openExternal("http://www.mimuw.edu.pl");
}

function clickFreeze() {
  //d3.layout.force().stop();
  d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = true} );
}

function clickUnfreeze() {
  d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = false} );
  //d3.layout.force().start();
}

function rgtclick(d, i) {
  //clipboard.writeText(d.url);
  //window.open(d.url)
  shell.openExternal(d.url);
}

function dblclick(d) {
  //d3.select(this)
  d3.select().classed("fixed", d.fixed = false);
  //d3.event.sourceEvent.stopPropagation();
}

function dragstart(d) {
  console.log("Drag start");
  //d3.select(this)
  d3.select().classed("fixed", d.fixed = true);
  d3.event.sourceEvent.stopPropagation();
}

function onResize() {
  console.log("On resize")
  /*
  margin = {top: 0, right: 0, bottom: 0, left: 0};
  width = window.innerWidth - margin.left - margin.right;
  height = window.innerHeight - margin.top - margin.bottom;
  svg.attr("width", width)
     .attr("height", height);
  d3.select('body').select('svg').select('rect').attr("width", width).attr("height", height);
  */
  width = window.innerWidth, height = window.innerHeight;
  d3.select('body').select('svg').attr("width", width).attr("height", height);
  force.size([width, height]).resume();
}

function onTick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
  // Use D3 to select element, change color and size
  d3.select(this).attr({
    //fill: "orange",
    r: 10
  });
  /*
  // Specify where to put label of text
  svg.append("text").attr({
     id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
      x: function() { return xScale(d.x) - 30; },
      y: function() { return yScale(d.y) - 15; }
  })
  .text(function() {
    return [d.x, d.y];  // Value of the text
  });
  */
}

function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr({
    //fill: "black",
    r: 5
  });
  /*
  // Select text by id and then remove
  d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
  */
}


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
      .text(function(d) { return d.name + "\n" + d.url; })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("contextmenu", rgtclick)
      //.on("dblclick", dblclick)
      .on("click", function(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        //console.log("Clicked on", d);
        d3.select().classed("fixed", d.fixed = false);
      })
      .call(
        force.drag().on("dragstart", dragstart)
      );

  force
      .nodes(graph.nodes)
      .links(graph.links);

  force.start();

} // draw the picture

function updateThePicture(error, graph) {

  if (error) throw error;

  var n = force.nodes();
  var l = force.links();

  force.start();
  for (i = 0; i <= 94; i++) {
      n[i].x = graph.nodes[i].x; //n[i].x + 100;
      n[i].y = graph.nodes[i].y; //n[i].y + 100;
      n[i].px = n[i].x;
      n[i].py = n[i].y;
      n[i].fixed = true;
  };
  force.start();
  //force.tick();
  //force.stop();

} // update the picture
