function drawThePicture(error, graph) {

  if (error) throw error;

  // Destroy old, just in case
  //d3.select('body').select('svg').remove();
  clearThePicture();

  // Window events
  d3.select(window).on("resize", onResize);

  // Then add new
  svg = d3.select("body")
          .append("svg")
          .attr("width", width) // window.innerWidth
          .attr("height", height) // window.innerHeight
          .call(d3.behavior.zoom().on("zoom", onZoom))
          //.call(d3.behavior.drag().on('dragstart', handleDragstarted))
          .append("g");

  // Add tooltip
  tip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
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
  color = d3.scale.category20();

  // Layout based on forces
  force = d3.layout.force()
            .size([width, height])
            .charge(-120)
            .linkDistance(20)
            .gravity(0.05)
            .linkStrength(1)
            //.friction(0.9)
            //.theta(0.8)
            //.alpha(0.1)
            .on("tick", onTick);

  drag = force.drag()
              //.origin(function(d) { return d; })
              .on("dragstart", onDragstarted)
              .on("drag", onDragged)
              .on("dragend", onDragended);

/*
  x = d3.scale.linear()
        .domain([-width / 2, width / 2])
        .range([0, width]);

  y = d3.scale.linear()
        .domain([-height / 2, height / 2])
        .range([height, 0]);

  xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height);

  yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-width);
*/

  zoom = d3.behavior.zoom()
           //.x(x)
           //.y(y)
           //.scaleExtent([1, 10])
           .center([width / 2, height / 2])
           .size([width, height])
           .on("zoom", onZoomAxis);

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
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut)
            .on("contextmenu", onRightclicked)
            //.on("dblclick", dblclick)
            .on("click", onClicked)
            .call(drag);

  // Tool-tips handled by the browser
  svg.selectAll("circle")
     .append("title")
     .text(function(d) { return d.name + "\n" + d.url; });

  force.nodes(graph.nodes)
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
  d3.select('body').select('svg').remove();
}
