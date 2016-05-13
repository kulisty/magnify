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
  zmf = zmf / 2;
  d3.select('body').select('svg')
    .attr("viewBox", vb(vbx,vby,vbw,vbh));
}

function clickZoomOut() {
  console.log("Zoom out");
  zmf = zmf * 2;
  d3.select('body').select('svg')
    .attr("viewBox", vb(vbx,vby,vbw,vbh));
}

function clickZoomFit() {
  width = window.innerWidth - 26;
  height = window.innerHeight - 26;
  d3.select('body').select('svg')
    .attr("viewBox", vb(-500,-500,3000,3000))
    .attr("width", width)
    .attr("height", height);
}

function clickReload() {
  clickUnfreeze();
  force.stop();
  force.start();
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
}

function dragstart(d) {
  //d3.select(this)
  d3.select().classed("fixed", d.fixed = true);
}

function drawThePicture(error, graph) {

  if (error) throw error;

  force = d3.layout.force()
      .size([width, height])
      .charge(-120)
      .linkDistance(20)
      .on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
          node.attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
      });

  var color = d3.scale.category20();
  var drag = force.drag().on("dragstart", dragstart);

  link = d3.select('body').select('svg').selectAll(".link")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  node = d3.select('body').select('svg').selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .text(function(d) { return d.name + "\n" + d.url; })
      .on("contextmenu", rgtclick)
      .on("dblclick", dblclick)
      .call(drag);

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
  //force.tick();
  //force.stop();

} // update the picture
