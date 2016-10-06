function drawThePicture() {

  // Window events
  d3.select(window).on("resize", onResize);

  // Add tooltip
  tip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.5); //0.0

  // Add context buttons
  var icons = ["git", "bug", "archive", "qrcode", "area-chart", "bar-chart", "line-chart", "building", "pie-chart", "dashboard", "history", "photo", "file-image-o", "file-text-o", "print", "info-circle", "desktop"];
  con = d3.select("body")
    .append("div")
    .attr("class", "conmenu")
    .style("opacity", 0.5); //0.0
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
    .style("opacity", 0.5); //0.0

  // Add pane for structure selection
  str = d3.select("body")
    .append("div")
    .attr("class", "strpane")
    .style("opacity", 0.5); //0.0

  // Add pane for structure selection
  sld = d3.select("body")
    .append("div")
    .attr("class", "sldpane")
    .style("opacity", 0.5); //0.0

  // Add pane for structure selection
  srh = d3.select("body")
    .append("div")
    .attr("class", "srhpane")
    .style("opacity", 0.5); //0.0

  // Add buttons
  b01 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0.5) //0.0
    .on("click", clickZoomIn);
  b02 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0.5) //0.0
    .on("click", clickZoomOut);
  b03 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0.5) //0.0
    .on("click", clickZoomFit);
  b04 = d3.select("body")
    .append("div")
    .attr("class", "button")
    .style("opacity", 0.5) //0.0
    .on("click", clickSwitch);

  // We need to scale integers into colors
  //color = d3.scaleOrdinal(d3.schemeCategory20);
  color = d3.scale.category20();

  // Layout based on forces
  force = d3.layout.force()
    .size([window.innerWidth, window.innerHeight])
    .charge(-120)
    .gravity(0.05)
    .linkDistance(20)
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

  /*
  try {
      //tip.html(path.basename(view.file));
      //tip.html(graph.project.path);
      tip.html(project.origin);
      sub = { url: project.origin };
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }
  */

  force
    .nodes(view.lays[lay].nodes)
    .links(view.lays[lay].links)
    .start();

  onFilter(0, 2, 1, 2);

  /*
  try {
    link = svg.selectAll(".link")
      .data(graphs[lay].links)
      .enter()
      .append("line")
      .attr("class", "link")
      //.style("stroke-width", function(d) { return Math.sqrt(d.value); });
      .style("stroke", function(d) { return 'orange'; })
      .style("stroke-width", function(d) { return d.value; });
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }

  try {
    node = svg.selectAll(".node")
      .data(graphs[lay].nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r",  function(d) { return d.complexity > 1 ? d.complexity : 5 })
      .style("fill", function(d) { return 'steelblue'; })
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .on("contextmenu", onRightclicked)
      //.on("dblclick", onDoubleclicked)
      .on("click", onClicked)
      //.call(zoom)
      .call(drag);
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }
  */

  /*
  try {
    // Tool-tips handled by the browser
    svg.selectAll("circle")
      .append("title")
      .text(function(d) { return d.group + ": " + d.name + "\n" + d.url; });
  }
  catch(err) {
      console.log("Some problems encountered when processing warehouse:", err.message);
  }
  */

  onResize();

} // draw the picture

function clearThePicture() {

  d3.select('body').selectAll('svg').remove();
  d3.select('body').selectAll('div').remove();
  d3.select('body').selectAll('canvas').remove();

} // clear elements
