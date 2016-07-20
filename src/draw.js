function drawThePicture(error, graph) {

  if (error) throw error;

  // Window events
  d3.select(window).on("resize", onResize);

  // Add tooltip
  tip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  try {
      //tip.html(path.basename(view.file));
      tip.html(graph.project.path);
      //sub = { url: "http://www.uw.edu.pl" };
      sub = { url: graph.project.origin };
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }

  // Add context buttons
  var icons = ["git", "bug", "desktop", "qrcode", "photo", "pie-chart", "area-chart", "bar-chart", "database", "history", "plug", "flask", "anchor", "print", "file-image-o", "file-text-o", "info-circle"];
  con = d3.select("body")
    .append("div")
    .attr("class", "conmenu")
    .style("opacity", 0);
  con.selectAll("i")
    .data(icons)
    .enter().append("i")
    .attr("class", function(d){
      return "icon fa fa-lg fa-fw fa-" + d;
    })
    .attr("aria-hidden", "true")
    .on("click", onIcon);
  // Add pane for context actions
  pan = d3.select("body")
    .append("div")
    .attr("class", "conpane")
    .style("opacity", 0);
  // Add buttons
  b01 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0)
    .on("click", clickZoomIn);
  b02 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0)
    .on("click", clickZoomOut);
  b03 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0)
    .on("click", clickZoomFit);

  // We need to scale integers into colors
  //color = d3.scaleOrdinal(d3.schemeCategory20);
  color = d3.scale.category20();

  // Layout based on forces
  force = d3.layout.force()
    .size([window.innerWidth, window.innerHeight])
    .charge(-120)
    .linkDistance(20)
    .gravity(0.05)
    .linkStrength(1)
    //.friction(0.9)
    //.theta(0.8)
    //.alpha(0.1)
    .on("tick", onTick);

  zoom = d3.behavior.zoom()
    //.x(x)
    //.y(y)
    //.scaleExtent([1, 10])
    .center([window.innerWidth / 2, window.innerHeight / 2])
    .size([window.innerWidth, window.innerHeight])
    .on("zoom", onZoom);

  //drag = d3.behavior.drag()
  drag = force.drag()
    .origin(function(d) { return d; })
    .on("dragstart", onDragstarted)
    .on("drag", onDragged)
    .on("dragend", onDragended);

  // Add new canvas
  svg = d3.select("body")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .call(zoom)
    //.call(drag)
    .append("g")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("version", 1.1)
    .attr("class", "graph")
    .attr("transform", "translate(" + 0 + "," + 0 + ")" + " scale(" + 1 + ")");

  try {
    link = svg.selectAll(".link")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link")
      //.style("stroke-width", function(d) { return Math.sqrt(d.value); });
      .style("stroke", function(d) { return 'red'; })
      .style("stroke-width", function(d) { return d.value; });
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }

  try {
    node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      //.attr("r", 5)
      .attr("r",  function(d) { return d.complexity > 1 ? d.complexity : 5 })
      //.style("fill", function(d) { return color(d.group); })
      .style("fill", function(d) { return 'blue'; })
      //.text(function(d) { return d.name + "\n" + d.url; })
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .on("contextmenu", onRightclicked)
      .on("dblclick", onDoubleclicked)
      .on("click", onClicked)
      //.call(zoom)
      .call(drag);
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }

  // Tool-tips handled by the browser
  svg.selectAll("circle")
    .append("title")
    .text(function(d) { return d.group + ": " + d.name + "\n" + d.url; });

  // Time slider
  //formatDate = d3.time.format("%y/%m/%d");
  //formatDate = d3.time.format("%Y-%m-%d");
  formatDate = d3.time.format("%b %Y");
  formatLong = d3.time.format("%d-%m-%Y");
  tscale = d3.time.scale()
    //.domain([new Date('2013-01-01'), new Date('2016-12-30')])
    .domain([new Date('2016-12-30'), new Date('2013-01-01')])
    .range([0, 400])
    .clamp(true);
  //
  slider = d3.select("body")
    .select("svg")
    .append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + (window.innerWidth - 500) + "," + 50 + ")");
  //
  slider.append("line")
    .attr("class", "track")
    .attr("x1", tscale.range()[0])
    .attr("x2", tscale.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay");
  //
  handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    //.attr("cx", 400)
    .attr("cx", 0)
    .attr("r", 9);
  //
  tpanel = slider.append('text')
    //.text(formatLong(tscale.domain()[1]))
    .text(formatLong(tscale.domain()[0]))
    .attr("class", "ticks")
    //.attr("transform", "translate(" + (400-18) + " ," + (-18) + ")");
    .attr("transform", "translate(" + (0-18) + " ," + (-18) + ")");
  //
  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 20 + ")")
    .selectAll("text")
    .data(tscale.ticks(6))
    .enter()
    .append("text")
    .attr("x", tscale)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDate(d); });
  //
  var tdrag = d3.behavior.drag()
    .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); })
    .on("dragend", function() { d3.event.sourceEvent.stopPropagation(); })
    .on("drag", function() { onSlider(d3.event.x-window.innerWidth+500); d3.event.sourceEvent.stopPropagation(); });
  slider.call(tdrag);

  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  onResize();

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

function clearThePicture() {

  d3.select('body').selectAll('svg').remove();
  d3.select('body').selectAll('div').remove();
  d3.select('body').selectAll('canvas').remove();

} // clear elements
