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

function clickSwitch(d) {
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
    case 'archive'      : onIcon_archive(d); break;
    case 'desktop'      : onIcon_desktop(d); break;
    case 'qrcode'       : onIcon_qrcode(d); break;
    case 'photo'        : onIcon_photo(d); break;
    case 'pie-chart'    : onIcon_piechart(d); break;
    case 'area-chart'   : onIcon_areachart(d); break;
    case 'bar-chart'    : onIcon_barchart(d); break;
    case 'line-chart'   : onIcon_linechart(d); break;
    case 'building'     : onIcon_building(d); break;
    case 'dashboard'    : onIcon_dashboard(d); break;
    case 'file-image-o' : onIcon_fileimage(d); break;
    case 'file-text-o'  : onIcon_filetext(d); break;
    case 'info-circle'  : onIcon_info(d); break;
    default             : console.log('Clicked: '+d);
  };
}

function onIcon_git(d) {
  pan.html('');
  remote.shell.openExternal(sub.url);
}

function onIcon_bug(d) {
  pan.html('');
  remote.shell.openExternal(sub.url+'/issues');
}

function onIcon_archive(d) {
  pan.html('');
  remote.shell.openExternal('https://github.com/kulisty/sova');
}

function onIcon_desktop(d) {
  pan.html('');
}

function onIcon_qrcode(d) {
  pan.html('');
  var svg_string = qr.imageSync(sub.url, { type: 'svg' });
  //var qr_svg = qr.image(sub.url, { type: 'svg' });
  // qr_svg.pipe(fs.createWriteStream('qrcode.svg'));
  pan.html(svg_string);
}

function onIcon_photo(d) {
  pan.html('');
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

function onIcon_piechart(d) {
  pan.html('');
  pan.append("div")
     .attr("id", "chart");
  var chart = c3.generate({
      data: {
          // iris data from R
          columns: [
              ['data1', 30],
              ['data2', 120],
          ],
          type : 'pie',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      }
  });
  setTimeout(function () {
      chart.load({
          columns: [
              ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
              ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
              ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
          ]
      });
  }, 1500);
  setTimeout(function () {
      chart.unload({
          ids: 'data1'
      });
      chart.unload({
          ids: 'data2'
      });
  }, 2500);
}

function onIcon_areachart(d){
  pan.html('');
  pan.append("div")
     .attr("id", "chart");
  /*
  var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ]
      }
  });
  */
  var chart = c3.generate({
      data: {
          columns: [
              ['data1', 300, 350, 300, 0, 0, 120],
              ['data2', 130, 100, 140, 200, 150, 50]
          ],
          types: {
              data1: 'area-spline',
              data2: 'area-spline'
              // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
          },
          groups: [['data1', 'data2']]
      }
  });
}

function onIcon_barchart(d) {
  pan.html('');
  pan.append("div")
     .attr("id", "chart");
  var chart = c3.generate({
     data: {
         columns: [
             ['data1', 30, 200, 100, 400, 150, 250],
             ['data2', 130, 100, 140, 200, 150, 50]
         ],
         type: 'bar'
     },
     bar: {
         width: {
             ratio: 0.5 // this makes bar width 50% of length between ticks
         }
         // or
         //width: 100 // this makes bar width 100px
     }
  });
  setTimeout(function () {
     chart.load({
         columns: [
             ['data3', 130, -150, 200, 300, -200, 100]
         ]
     });
  }, 1000);
}

function onIcon_linechart(d){
  pan.html('');
  pan.append("div")
     .attr("id", "chart");
  var chart = c3.generate({
     data: {
         x: 'x',
  //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
         columns: [
             ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
  //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
             ['data1', 30, 200, 100, 400, 150, 250],
             ['data2', 130, 340, 200, 500, 250, 350]
         ]
     },
     axis: {
         x: {
             type: 'timeseries',
             tick: {
                 format: '%Y-%m-%d'
             }
         }
     }
  });
  setTimeout(function () {
     chart.load({
         columns: [
             ['data3', 400, 500, 450, 700, 600, 500]
         ]
     });
  }, 1000);
}

function onIcon_building(d){
  pan.html('');
  pan.append("div")
     .attr("id", "chart");
   var chart = c3.generate({
       data: {
           xs: {
               setosa: 'setosa_x',
               versicolor: 'versicolor_x',
           },
           // iris data from R
           columns: [
               ["setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
               ["versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
               ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
               ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
           ],
           type: 'scatter'
       },
       axis: {
           x: {
               label: 'Sepal.Width',
               tick: {
                   fit: false
               }
           },
           y: {
               label: 'Petal.Width'
           }
       }
   });
   setTimeout(function () {
       chart.load({
           xs: {
               virginica: 'virginica_x'
           },
           columns: [
               ["virginica_x", 3.3, 2.7, 3.0, 2.9, 3.0, 3.0, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3.0, 2.5, 2.8, 3.2, 3.0, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3.0, 2.8, 3.0, 2.8, 3.8, 2.8, 2.8, 2.6, 3.0, 3.4, 3.1, 3.0, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3.0, 2.5, 3.0, 3.4, 3.0],
               ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
           ]
       });
   }, 1000);
   setTimeout(function () {
       chart.unload({
           ids: 'setosa'
       });
   }, 2000);
   setTimeout(function () {
       chart.load({
           columns: [
               ["virginica", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
           ]
       });
   }, 3000);
}

function onIcon_dashboard(d) {
  pan.html('');
  // CHART1
  pan.append("div")
     .attr("id", "chart");
  var chart = c3.generate({
      data: {
          columns: [
              ['data', 91.4]
          ],
          type: 'gauge',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      gauge: {
  //        label: {
  //            format: function(value, ratio) {
  //                return value;
  //            },
  //            show: false // to turn off the min/max labels.
  //        },
  //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
  //    max: 100, // 100 is default
  //    units: ' %',
  //    width: 39 // for adjusting arc thickness
      },
      color: {
          pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
          threshold: {
  //            unit: 'value', // percentage is default
  //            max: 200, // 100 is default
              values: [30, 60, 90, 100]
          }
      },
      size: {
          height: 180
      }
  });
  setTimeout(function () {
      chart.load({
          columns: [['data', 10]]
      });
  }, 1000);
  setTimeout(function () {
      chart.load({
          columns: [['data', 50]]
      });
  }, 2000);
  setTimeout(function () {
      chart.load({
          columns: [['data', 70]]
      });
  }, 3000);
  setTimeout(function () {
      chart.load({
          columns: [['data', 0]]
      });
  }, 4000);
  setTimeout(function () {
      chart.load({
          columns: [['data', 100]]
      });
  }, 5000);
}

function onIcon_fileimage(d) {
  pan.html('');
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
  pan.html('');
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
    'origin : ' + view.model.project.origin + '</br>' +
    'commit : ' + view.model.project.commit + '</br>' +
    'owner  : ' + view.model.project.owner  + '</br>' +
    'name   : ' + view.model.project.name   + '</br>' +
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
  b04.transition().duration(500).style("opacity", 0.5);
  b04.style("background-image", "url('css/images/icon-layers.png')");
	b04.style("background-repeat", "no-repeat");
  b04.style("background-position", "center center");
  //b04.style("left", width-72 + "px").style("top", 74 + "px");
  b04.style("left", width-40 + "px").style("top", 106 + "px");
  //
  //slider.attr("transform", "translate(" + (window.innerWidth - 500) + "," + 70 + ")");
  slider.attr("transform", "translate(" + (window.innerWidth - 500) + "," + 32 + ")");
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
    .style("fill", function(d) { return 'orangered'; });
    //.attr({r: 10});
}

function onMouseOut(d, i) {
  d3.select(this)
    .style("fill", function(d) { return 'steelblue'; });
    //.style("fill", function(d) { return color(d.group); });
    //.attr({r: 5});
}
