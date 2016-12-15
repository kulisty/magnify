function resizeIcons() {

  var width = window.innerWidth,
      height = window.innerHeight;

  var w = 470,
      h = 28,
      m = 2,
      p = 5;

  d3.select('body').selectAll(".icons")
    .transition().duration(500)
    .style("left", width-w-m-2*p + "px")
    .style("top", height-h-m + "px");

  d3.select('body').selectAll(".info")
    .transition().duration(500)
    //.style("left", width-w-m-2*p + "px")
    .style("left", 440 + 2*m + "px")
    .style("width", width-440-w-4*m-4*p + "px")
    //.style("top", height-2*h-2*m + "px");
    .style("top", height-h-m + "px");

}

function addIcons() {

  var width = window.innerWidth,
      height = window.innerHeight;

  var icons = [
    "git", "bug", "archive",
    "area-chart", "bar-chart", "line-chart", "building",
    "pie-chart", "dashboard", "history", "photo",
    "file-image-o", "file-text-o", "print",
    "info-circle", "qrcode",
    "desktop"
  ];

  var c = d3.select("body").append("div").attr("class", "icons")
    .style("left", width + "px")
    .style("top", height + "px")
    .style("opacity", 0.75)
    .style("position", "absolute")
    .style("width", "470px")
    .style("height", "18px")
    .style("padding", "5px")
    .style("text-align", "left")
    .style("font", "16px font-awesome")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px");

  c.selectAll("i")
    .data(icons)
    .enter().append("i")
    .attr("class", function(d){
      return "icon fa fa-lg fa-fw fa-" + d;
    })
    .attr("aria-hidden", "true")
    .on("click", onIcon);

  var i = d3.select("body").append("div").attr("class", "info")
    .style("left", width + "px")
    .style("top", height + "px")
    .style("opacity", 0.75)
    .style("position", "absolute")
    .style("width", "470px")
    .style("height", "18px")
    .style("padding", "5px")
    .style("text-align", "right")
    .style("background", "#f0f0f0")
    .style("font", "16px sans-serif")
    .style("color", "#000")
    .style("border", "0px")
    .style("border-radius", "2px");

  //i.text(file.data.project.name+"@"+file.data.project.owner+"#"+file.data.project.commit);
  i.text(file.data.project.origin+"#"+file.data.project.commit);

  resizeIcons();

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
    case 'history'      : onIcon_history(d); break;
    case 'file-image-o' : onIcon_fileimage(d); break;
    case 'file-text-o'  : onIcon_filetext(d); break;
    case 'info-circle'  : onIcon_info(d); break;
    default             : console.log('Clicked: '+d);
  };
}

function onIcon_git(d) {
  //pan.html('');
  //remote.shell.openExternal(sub.url);
  remote.shell.openExternal("http://google.pl");
}

function onIcon_bug(d) {
  pan.html('');
  remote.shell.openExternal(sub.url+'/issues');
}

function onIcon_archive(d) {
  pan.html('');
  // remote.shell.openExternal('https://github.com/kulisty/sova');

  // Add time slider
  // formatDate = d3.time.format("%y/%m/%d");
  //  formatDate = d3.time.format("%Y-%m-%d");
  formatDate = d3.time.format("%b %Y");
  formatLong = d3.time.format("%d-%m-%Y");
  tscale = d3.time.scale()
    //.domain([new Date('2013-01-01'), new Date('2016-12-30')])
    .domain([new Date('2016-12-30'), new Date('2013-01-01')])
    .range([0, 400])
    .clamp(true);
  //
  slider = sld.append("svg")
    .attr("width", 450)
    .attr("height", 30)
    .append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + 10 + "," + 10 + ")");
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
    .attr("transform", "translate(" + (0) + " ," + (0) + ")");
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
    .on("drag", function() { onSlider(d3.event.x); d3.event.sourceEvent.stopPropagation(); });
  slider.call(tdrag);
  //
  //slider.attr("transform", "translate(" + (window.innerWidth - 500) + "," + 70 + ")");
  slider.transition().duration(500).style("opacity", 1.0);
  slider.attr("transform", "translate(" + 10 + "," + 10 + ")");

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
  pan.select("svg")
    //.attr("viewBox", "0 0 50 50")
    .attr("width", 470)
    .attr("height", 320);
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
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+470+'" height="'+320+'" viewBox="'+ x +' '+ y +' '+ r +' '+ r +'">' +
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

function onIcon_history(d) {
  str.html('');

  var width = 470,
      height = 320,
      radius = (Math.min(width, height) / 2) - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

  var y = d3.scale.sqrt()
      .range([0, radius]);

  var color = d3.scale.category20c();

  var partition = d3.layout.partition()
      .value(function(d) { return d.size; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  var svg2 = str.append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  d3.json("http://bl.ocks.org/mbostock/raw/4063550/flare.json", function(error, root) {
    if (error) throw error;

    svg2.selectAll("path")
        .data(partition.nodes(root))
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
        .on("click", click)
      .append("title")
        .text(function(d) { return d.name + "\n" + formatNumber(d.value); });
  });

  function click(d) {
    svg2.transition()
        .duration(750)
        .tween("scale", function() {
          var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
              yd = d3.interpolate(y.domain(), [d.y, 1]),
              yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
          return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
        })
      .selectAll("path")
        .attrTween("d", function(d) { return function() { return arc(d); }; });
  }

  d3.select(self.frameElement).style("height", height + "px");
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
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+470+'" height="'+320+'" viewBox="'+ x +' '+ y +' '+ r +' '+ r +'">' +
    svg_html +
    '</svg>';
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svg_string);
  var img = '<img src="'+imgsrc+'">';
  d3.select('body')
    .append("canvas")
    .attr("style", "display:none")
    .attr("width", 470)
    .attr("height", 320);
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
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+470+'" height="'+320+'" viewBox="'+ x +' '+ y +' '+ r +' '+ r +'">' +
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
    'PROJECT' + '</br>' +
    'origin : ' + view.model.project.origin + '</br>' +
    'commit : ' + view.model.project.commit + '</br>' +
    'owner  : ' + view.model.project.owner  + '</br>' +
    'name   : ' + view.model.project.name   + '</br>' +
    '</pre>' +
    '<pre>' +
    'COMMITS' + '</br>' +
    'nodes  : ' + view.model.commits.nodes.length   + '</br>' +
    'links  : ' + view.model.commits.links.length   + '</br>' +
    '</pre>' +
    '<pre>' +
    'FILES' + '</br>' +
    'nodes  : ' + view.model.files.nodes.length   + '</br>' +
    'links  : ' + view.model.files.links.length   + '</br>' +
    '</pre>' +
    '<pre>' +
    'FUNCTIONS' + '</br>' +
    'nodes  : ' + view.model.functions.nodes.length   + '</br>' +
    'links  : ' + view.model.functions.links.length   + '</br>' +
    '</pre>'
  );
}
