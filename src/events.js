function clickZoomIn(d) {
  onZoomBy(1.2);
}

function clickZoomOut(d) {
  onZoomBy(0.6);
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
  //svg.transition().duration(500).call(zoom.event);
  svg.call(zoom.event);
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

function onIcon(d) {
  switch(d) {
    case 'git'          : onIcon_git(d); break;
    case 'bug'          : onIcon_bug(d); break;
    case 'desktop'      : onIcon_desktop(d); break;
    case 'qrcode'       : onIcon_qrcode(d); break;
    case 'photo'        : onIcon_photo(d); break;
    case 'file-image-o' : onIcon_fileimage(d); break;
    case 'file-text-o'  : onIcon_filetext(d); break;
    case 'info-circle'  : onIcon_info(d); break;
    default             : console.log('Clicked: '+d);
  };
}

function onIcon_git(d) {
  remote.shell.openExternal(sub.url);
  pan.html('');
}

function onIcon_bug(d) {
  remote.shell.openExternal(sub.url+'/issues');
  pan.html('');
}

function onIcon_desktop(d) {
  pan.html('');
}

function onIcon_qrcode(d) {
  var svg_string = qr.imageSync(sub.url, { type: 'svg' });
  //var qr_svg = qr.image(sub.url, { type: 'svg' });
  // qr_svg.pipe(fs.createWriteStream('qrcode.svg'));
  pan.html(svg_string);
}

function onIcon_photo(d) {
  // d3.selectAll(".graph").node().getBoundingClientRect();
  // zoom.translate()[1] / zoom.scale()
  var svg_rect =
    d3.selectAll(".graph")
      .node()
      .getBBox();
  var r = Math.max(svg_rect.width, svg_rect.height);
  var x = svg_rect.x;
  var y = svg_rect.y;
  //
  var svg_html =
    d3.selectAll(".graph")
      //.attr("version", 1.1)
      //.attr("xmlns", "http://www.w3.org/2000/svg")
      .node()
      //.parentNode
      .innerHTML;
  //
  var svg_string =
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+470+'" height="'+470+'" viewBox="'+ x +' '+ y +' '+ r +' '+ r +'">' +
    svg_html +
    '</svg>';
  pan.html(svg_string);
}

function onIcon_fileimage(d) {
  var svg_rect =
    d3.selectAll(".graph")
      .node()
      .getBBox();
  var r = Math.max(svg_rect.width, svg_rect.height);
  var x = svg_rect.x;
  var y = svg_rect.y;
  var svg_html =
    d3.selectAll(".graph")
      .node()
      .innerHTML;
  var svg_string =
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+470+'" height="'+470+'" viewBox="'+ x +' '+ y +' '+ r +' '+ r +'">' +
    svg_html +
    '</svg>';
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svg_string);
  var img = '<img src="'+imgsrc+'">';
  d3.select('body')
    .append("canvas")
    .attr("style", "display:none")
    .attr("width", 470)
    .attr("height", 470);
  var canvas = document.querySelector("canvas"),
  	  context = canvas.getContext("2d");
  var image = new Image;
  image.src = imgsrc;
  image.onload = function() {
	  context.drawImage(image, 0, 0);
	  var canvasdata = canvas.toDataURL("image/png");
	  var pngimg = '<img src="'+canvasdata+'">';
    pan.html(pngimg);
    var a = document.createElement("a");
	  //a.download = "file.png";
    a.download = path.basename(view.file, '.json')+'.png';
	  a.href = canvasdata;
	  a.click();
  };
  d3.select('body').selectAll('canvas').remove();
}

function onIcon_filetext(d) {
  var svg_rect =
    d3.selectAll(".graph")
      .node()
      .getBBox();
  var r = Math.max(svg_rect.width, svg_rect.height);
  var x = svg_rect.x;
  var y = svg_rect.y;
  var svg_html =
    d3.selectAll(".graph")
      .node()
      .innerHTML;
  var svg_string =
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+470+'" height="'+470+'" viewBox="'+ x +' '+ y +' '+ r +' '+ r +'">' +
    svg_html +
    '</svg>';
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svg_string);
  var img = '<img src="'+imgsrc+'">';
  var image = new Image;
  image.src = imgsrc;
  image.onload = function() {
    pan.html(img);
    var a = document.createElement("a");
	  //a.download = "file.svg";
    a.download = path.basename(view.file, '.json')+'.svg';
	  a.href = imgsrc;
	  a.click();
  };
}

function onIcon_info(d) {
  pan.html(
    '<pre>' +
    'path   : ' + view.model.project.path   + '</br>' +
    'origin : ' + view.model.project.origin + '</br>' +
    'commit : ' + view.model.project.commit + '</br>' +
    'nodes  : ' + view.model.nodes.length   + '</br>' +
    'links  : ' + view.model.links.length   + '</br>' +
    '</pre>'
  );
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

function onSlider(d) {
  handle.attr("cx", tscale(tscale.invert(d)));
  tpanel.text(formatLong(tscale.invert(d)));
  tpanel.attr("transform", "translate(" + (tscale(tscale.invert(d))-18) + " ," + (-18) + ")")
}

function onResize() {
  width = window.innerWidth, height = window.innerHeight;
  d3.select('svg').attr("width", width).attr("height", height);
  force.size([width, height]).resume();
  // tool-tip
  tip.transition().duration(500).style("opacity", 0.5);
  tip.style("left", width-500 + "px").style("top", height-50 + "px");
  // context buttons
  con.transition().duration(500).style("opacity", 0.5);
  con.style("left", width-500 + "px").style("top", height-96 + "px");
  // pane for context actions
  pan.html('');
  pan.transition().duration(500).style("opacity", 0.5);
  pan.style("left", width-500 + "px").style("top", height-592 + "px");
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
  //
  slider.attr("transform", "translate(" + (window.innerWidth - 500) + "," + 50 + ")");
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
    .style("fill", function(d) { return 'orange'; });
    //.attr({r: 10});
}

function onMouseOut(d, i) {
  d3.select(this)
    .style("fill", function(d) { return 'blue'; });
    //.style("fill", function(d) { return color(d.group); });
    //.attr({r: 5});
}
