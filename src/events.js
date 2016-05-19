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
  force.stop();
  d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = true} );
}

function clickUnfreeze() {
  d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = false} );
  force.resume();
}

function clickReload() {
  force.stop();
  force.resume();
  force.nodes().forEach(
    function(o, i) {
      o.x += (Math.random() - .5) * 40;
      o.y += (Math.random() - .5) * 40;
    }
  );
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

function handleClicked(d) {
  console.log('click');
  if (d3.event.defaultPrevented) return; // click suppressed
  //d3.select().classed("fixed", d.fixed = false);
  d3.select().classed("fixed", d.fixed = false);
  force.resume();
}

function dragstarted(d) {
  //d3.select(this)
  d3.select().classed("fixed", d.fixed = true);
  d3.event.sourceEvent.stopPropagation();
}

function dragged(d) {
}

function dragended(d) {
  d3.select(this).attr("fill", "rgb(17,19,21)");
}

function onResize() {
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

function handleMouseOver(d, i) {
  // Use D3 to select element, change color and size
  d3.select(this).attr({
    //fill: "orange",
    r: 10
  });
  // tooltip
  tip.transition()
     .duration(500)
     .style("opacity", 0.7);
  tip.html("<p>"+d.url+"</p>");
     //.style("left", (d3.event.pageX) + "px")
     //.style("top", (d3.event.pageY - 28) + "px");
  tip.style("left", width-300 + "px")
     .style("top", height-50 + "px");
  // buttons
  b01.transition().duration(500).style("opacity", 0.7);
  b01.html("1");
  b01.style("left", width-40 + "px").style("top", 10 + "px");
  b02.transition().duration(500).style("opacity", 0.7);
  b02.html("2");
  b02.style("left", width-40 + "px").style("top", 42 + "px");
  b03.transition().duration(500).style("opacity", 0.7);
  b03.html("0");
  b03.style("left", width-40 + "px").style("top", 74 + "px");
  //div.transition()
  //    .duration(500)
  //    .style("opacity", 0);
  //div.html(
  //      '<a href="http://google.com">'+ // The first <a> tag
  //      //formatTime(d.date)+
  //      'google.com' +
  //      "</a>" +                          // closing </a> tag
  //      "<br/>"  +
  //      //d.close
  //      'ala ma kota'
  //    )
  //    .style("left", (d3.event.pageX) + "px")
  //    .style("top", (d3.event.pageY - 28) + "px");
  // Specify where to put label of text
  //svg.append("text").attr({
  //   id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
  //    x: function() { return xScale(d.x) - 30; },
  //    y: function() { return yScale(d.y) - 15; }
  //})
  //.text(function() {
  //  return [d.x, d.y];  // Value of the text
  //});
}

function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr({
    //fill: "black",
    r: 5
  });
  tip.html(" ");
  tip.transition().duration(500).style("opacity", 0.1);
  b01.html(" ");
  b01.transition().duration(500).style("opacity", 0.1);
  b02.html(" ");
  b02.transition().duration(500).style("opacity", 0.1);
  b03.html(" ");
  b03.transition().duration(500).style("opacity", 0.1);
  // Select text by id and then remove
  //d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}
