function clickGithub() {
  shell.openExternal("http://github.com");
}

function clickSova() {
  shell.openExternal("http://www.uw.edu.pl");
}

function clickMagnify() {
  shell.openExternal("http://www.mimuw.edu.pl");
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

function clickZoomIn(d) {
  onZoomBy(1.5);
}

function clickZoomOut(d) {
  onZoomBy(0.75);
}

function clickZoomFit(d) {
  svg.call(zoom.event); // https://github.com/mbostock/d3/issues/2387
  zoom.scale(1);
  zoom.translate([0, 0]);
  svg.transition().duration(500).call(zoom.event);
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

function onZoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
 }

function onZoomAxis() {
    //svg.select(".x.axis").call(xAxis);
    //svg.select(".y.axis").call(yAxis);
    onZoom();
}

function onZoomByMB(factor) { // not used - for reference only
  function coordinates(point) {
    var scale = zoom.scale(), translate = zoom.translate();
    return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
  }
  function point(coordinates) {
    var scale = zoom.scale(), translate = zoom.translate();
    return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
  }
  svg.call(zoom.event); //https://github.com/mbostock/d3/issues/2387
  // Record the coordinates (in data space) of the center (in screen space).
  var center0 = zoom.center(), translate0 = zoom.translate(), coordinates0 = coordinates(center0);
  zoom.scale(zoom.scale() * factor);
  // Translate back to the center.
  var center1 = point(coordinates0);
  zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);
  svg.transition().duration(500).call(zoom.event);
}

function onZoomBy(factor) {
  var newZoom = zoom.scale() * factor;
  var newX = ((zoom.translate()[0] - (width / 2)) * factor) + width / 2;
  var newY = ((zoom.translate()[1] - (height / 2)) * factor) + height / 2;
  zoom.scale(newZoom).translate([newX,newY]);
  //svg.call(zoom.event);
  svg.transition().duration(500).call(zoom.event);
}

function onClicked(d) {
  if (d3.event.defaultPrevented) return; // click suppressed
  //d3.select().classed("fixed", d.fixed = false);
  d3.select().classed("fixed", d.fixed = false);
  force.resume();
}

function onIconClicked(icon){
  console.log(icon + " clicked");
}

function onRightclicked(d, i) {
  //clipboard.writeText(d.url);
  //window.open(d.url)
  //shell.openExternal(d.url);
  //tip.html(d.name.link(d.url));
  if (d.name.length > 40) {
    tip.html('... '+d.name.substr(-40));
  } else {
    tip.html(d.name);
  };
  sub = d;
}

function onHome(d) {
  shell.openExternal(sub.url);
}

function onDoubleclicked(d) {
  d3.select(this)
    .style("fill", function(d) { return 'orange'; });
  //d3.event.sourceEvent.stopPropagation();
}

function onDragstarted(d) {
  d3.select()
    .classed("fixed", d.fixed = true);
  d3.select(this)
    .style("fill", function(d) { return 'orange'; });
  d3.event.sourceEvent.stopPropagation();
}

function onDragged(d) {
  //
}

function onDragended(d) {
  d3.select(this)
    .style("fill", function(d) { return color(d.group); });
}

function onResize() {
  width = window.innerWidth, height = window.innerHeight;
  svg.attr("width", width).attr("height", height);
  force.size([width, height]).resume();
  // tool-tip
  tip.transition().duration(500).style("opacity", 0.5);
  tip.style("left", width-500 + "px").style("top", height-50 + "px");
  // context buttons
  con.transition().duration(500).style("opacity", 0.5);
  con.style("left", width-500 + "px").style("top", height-96 + "px");
  // buttons
  b01.transition().duration(500).style("opacity", 0.5);
  b01.style("background-image", "url('css/images/icon-plus.png')");
	b01.style("background-repeat", "no-repeat");
  b01.style("background-position", "center center");
  b01.style("left", width-40 + "px").style("top", 10 + "px");
  //
  b02.transition().duration(500).style("opacity", 0.5);
  b02.style("background-image", "url('css/images/icon-minus.png')");
	b02.style("background-repeat", "no-repeat");
  b02.style("background-position", "center center");
  b02.style("left", width-40 + "px").style("top", 42 + "px");
  //
  b03.transition().duration(500).style("opacity", 0.5);
  b03.style("background-image", "url('css/images/icon-focus.png')");
	b03.style("background-repeat", "no-repeat");
  b03.style("background-position", "center center");
  b03.style("left", width-40 + "px").style("top", 74 + "px");
}

function onTick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

function onMouseOver(d, i) {
  d3.select(this)
    //.style("fill", function(d) { return 'orange'; })
    .attr({r: 10});
}

function onMouseOut(d, i) {
  d3.select(this)
    //.style("fill", function(d) { return color(d.group); })
    .attr({r: 5});
}
