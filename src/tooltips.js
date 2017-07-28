// PIASKOWNICA



function onMouseOver(d, i) {
  d3.select(this)
    .style("fill", function(d) { return 'orangered'; });
    //.attr({r: 10});
}

function onMouseOut(d, i) {
  d3.select(this)
    .style("fill", function(d) { return 'steelblue'; });
    //.style("fill", function(d) { return color(d.group); });
    //.attr({r: 5});
}


function onIconClicked(icon){
  console.log(icon + " clicked");
}

function onSlider(d) {
  handle.attr("cx", tscale(tscale.invert(d)));
  tpanel.text(formatLong(tscale.invert(d)));
  tpanel.attr("transform", "translate(" + (tscale(tscale.invert(d))-18) + " ," + (-18) + ")")
}



function onClicked(d) {
  // TODO: deprecated?
  // click suppressed, ie. if d3.event.preventDefault(); executed earlier
  console.log("Click");
  if (d3.event.defaultPrevented) return;
  d3.select().classed("fixed", d.fixed = false);
  force.resume();
}

function onDoubleclicked(d) {
  // TODO: deprecated?
  console.log("Double click");
  d3.select(this)
    .style("fill", function(d) { return 'orange'; });
  //d3.event.sourceEvent.stopPropagation();
}

function onRightclicked(d, i) {
  // TODO: deprecated?
  //console.log("Right click");
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

function onDragstarted(d) {
  //console.log("Drag started");
  d3.select(this).style("fill", function(d) { return 'orange'; });
  // distinguish left (0) or right (2) mouse button
  if (d3.event.sourceEvent.button == 0) {
    d3.select().classed("fixed", d.fixed = true);
  }
  d3.event.sourceEvent.stopPropagation();
}

function onDragged(d) {
  //console.log("Dragged");
}

function onDragended(d) {
  //console.log("Drag ended");
  d3.select(this).style("fill", function(d) { return color(d.group); });
}

function onResize() {
  var width = window.innerWidth,
      height = window.innerHeight;
  d3.select('svg').attr("width", width).attr("height", height);

  resizeButtons();
  resizeIcons();

/*
  d3.select('svg').attr("width", width).attr("height", height);
  force.size([width, height]).resume();
  // tool-tip
  tip.transition().duration(500).style("opacity", 0.5);
  tip.style("left", width-490 + "px").style("top", height-72 + "px");
  // pane for search selection
  srh.html('');
  srh.transition().duration(500).style("opacity", 0.5);
  srh.style("left", 10 + "px")
     .style("top", 10 + "px")
     .style("width", 480 + "px")
     .style("height", 80 + "px");
  // pane for time selection
  sld.html('');
  sld.transition().duration(500).style("opacity", 0.5);
  sld.style("left", 10 + "px")
     .style("top", 92 + "px")
     .style("width", 480 + "px")
     .style("height", 80 + "px");
  // pane for structure selection
  str.html('');
  str.transition().duration(500).style("opacity", 0.5);
  str.style("left", 10 + "px")
     .style("top", 174 + "px")
     .style("width", 480 + "px")
     .style("height", 320 + "px");
  // pane for context actions
  pan.html('');
  pan.transition().duration(500).style("opacity", 0.5);
  pan.style("left", 10 + "px")
     .style("top", 496 + "px")
     .style("width", 480 + "px")
     .style("height", 320 + "px");
*/
}

function onTick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}
