function resizePanels() {

  var w = [330, 330, 330, 330],
      h = [110, 330,  25, 330],
      l = 3,
      t = 3,
      m = 3;

  var width = window.innerWidth,
      height = window.innerHeight;

  d3.select('body').selectAll(".panel1")
    .transition().duration(500)
    .style("left", l + "px")
    .style("top", t + "px");

  d3.select('body').selectAll(".panel2")
    .transition().duration(500)
    .style("left", l + "px")
    .style("top",  (t+h[0]+m) + "px");

  d3.select('body').selectAll(".panel3")
    .transition().duration(500)
    .style("left", l + "px")
    .style("top", (t+h[0]+m+h[1]+m) + "px");

  d3.select('body').selectAll(".panel4")
    .transition().duration(500)
    .style("left", l + "px")
    .style("top", (t+h[0]+m+h[1]+m+h[2]+m) + "px")
    .style("height", (height-h[0]-h[1]-h[2]-2*t-3*m) + "px");

}

function addPanels() {

  var w = [330, 330, 330, 330],
      h = [110, 330,  25, 330],
      l = 3,
      t = 3,
      m = 3;

  var width = window.innerWidth,
      height = window.innerHeight;

  var p = d3.select("body").append("div").attr("class", "panels");

  var p1 = p.append("div").attr("class", "panel1")
    .style("left", l + "px")
    .style("top", t + "px")
    .style("opacity", 0.9)
    .style("position", "absolute")
    .style("width", w[0] + "px")
    .style("height", h[0] + "px")
    .style("background", "#f0f0f0")
    .style("font", "16px sans-serif")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px");

  var p2 = p.append("div").attr("class", "panel2")
    .style("left", l + "px")
    .style("top", t + "px")
    .style("opacity", 0.9)
    .style("position", "absolute")
    .style("width", w[1] + "px")
    .style("height", h[1] + "px")
    .style("background", "#f0f0f0")
    .style("font", "16px sans-serif")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px");

  var p3 = p.append("div").attr("class", "panel3")
    .style("left", l + "px")
    .style("top", t + "px")
    .style("opacity", 0.9)
    .style("position", "absolute")
    .style("width", w[2] + "px")
    .style("height", h[2] + "px")
    .style("background", "#f0f0f0")
    .style("font", "16px sans-serif")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px");
    //background-image: url('/css/searchicon.png'); /* Add a search icon to input */
    //background-position: 10px 12px; /* Position the search icon */
    //background-repeat: no-repeat; /* Do not repeat the icon image */

  var p4 = p.append("div").attr("class", "panel4")
    .style("left", l + "px")
    .style("top", t + "px")
    .style("opacity", 0.9)
    .style("position", "absolute")
    .style("width", w[3] + "px")
    .style("height", h[3] + "px")
    .style("background", "#f0f0f0") //rgba(0, 0, 0, 0.8)
    .style("overflow-y", "scroll")
    .style("font", "12px sans-serif")
    .style("color", "#000") //#fff
    .style("border", "0px")
    .style("border-radius", "2px");

  resizePanels();
  panelSunburst();
  panelGauge();
  //panelGrid();
  panelGrid2();
  panelFilter();

}

function panelFilter() { // at panel no 3

  var svg = d3.select(".panel3")
    .append("input")
    .attr("type", "text")
    .attr("id", "myInput")
    .attr("placeholder", "Search for names..")
    .style("position", "absolute")
    .style("left", 2 + "px")
    .style("top", 2 + "px")
    .style("border", "1px")
    .style("border-radius", "2px")
    .style("width", "326px")
    .style("font", "16px sans-serif")
    .on("input", filter);

  function filter() {
    var val = this.value.toString().toUpperCase();
    d3.select("tbody").selectAll("tr")
      .attr("id", this.value)
      .style("display", function(d){
          if (d.id.toString().toUpperCase().indexOf(val) > -1) {
            return "";
          }
          else {
            return "none";
          }
      });
  }

}

function panelSunburst() { // at panel no 2

  var width = 330,
      height = 330,
      radius = (Math.min(width, height) / 2) - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);

  var y = d3.scaleSqrt()
      .range([0, radius]);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var partition = d3.partition();

  var arc = d3.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

  var svg = d3.select(".panel2")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  //d3.json("http://bl.ocks.org/mbostock/raw/4063550/flare.json", function(error, root) {
  //  if (error) throw error;
  var root = d3.hierarchy(file.data.tree);//root
  root.sum(function(d) { return d.size; });
  svg.selectAll("path")
     .data(partition(root).descendants())
     .enter().append("path")
     .attr("d", arc)
     .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
     .on("click", click)
     .append("title")
     .text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });
  //});

  function click(d) {
    svg.transition()
        .duration(750)
        .tween("scale", function() {
          var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
              yd = d3.interpolate(y.domain(), [d.y0, 1]),
              yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
          return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
        })
      .selectAll("path")
        .attrTween("d", function(d) { return function() { return arc(d); }; });
  }

  d3.select(self.frameElement).style("height", height + "px");

}

function panelGauge() { // at panel no 1

  var width = 330,
      height = 110;

  var memoryGaugeContainer = d3.select(".panel1").append("span")
    .attr("id", "weightGaugeContainer");

  var cpuGaugeContainer = d3.select(".panel1").append("span")
    .attr("id", "qualityGaugeContainer");

  var networkGaugeContainer = d3.select(".panel1").append("span")
    .attr("id", "complexityGaugeContainer");

  var gauges = [];

  function createGauge(name, label, min, max)
  {
    var config =
    {
      size: 120,
      label: label,
      min: undefined != min ? min : 0,
      max: undefined != max ? max : 100,
      minorTicks: 5
    }

    var range = config.max - config.min;
    //config.greenZones = [{ from: config.min, to: + range*0.25 }];
    //config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
    config.yellowZones = [{ from: config.min + range*0.10, to: config.min + range*0.25 }];
    //config.redZones = [{ from: config.min + range*0.9, to: config.max }];
    config.redZones = [{ from: config.min + range*0.00, to: config.min + range*0.10 }];

    gauges[name] = new Gauge(name + "GaugeContainer", config);
    gauges[name].render();
  }

  function createGauges()
  {
    createGauge("weight", "Weight");
    createGauge("quality", "Quality");
    createGauge("complexity", "Complexity");
    //createGauge("test", "Test", -50, 50 );
  }

  function updateGauges()
  {
    for (var key in gauges)
    {
      var value = getRandomValue(gauges[key])
      gauges[key].redraw(value);
    }
  }

  function getRandomValue(gauge)
  {
    var overflow = 0; //10;
    return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
  }

  function initialize()
  {
    createGauges();
    //setInterval(updateGauges, 5000);
    updateGauges();
  }

  initialize();

}

function panelGrid() { // at panel no 4

  var ch3 = d3.select(".panel4")
    .append("div")
    .attr("class", "list")
    .style("opacity", 1.0)
    .style("left", "0px")
    .style("top", "0px")
    .style("width", "100%")
    .style("height", "100%");

  var ch3d = ch3.append("div")
    .attr("id", "myList")
    .style("width", "100%")
    .style("height", "100%");

  var listData = {
    Head : [["Name", "ID", "W", "Q", "C", "V", "X", "Y"]],
    Body : file.data.graph.nodes.reduce(function(a,b,c,d){return a.concat([[
      b.name,
      b.id,//.toFixed(0),
      b.weight,//.toFixed(2),
      b.quality,//.toFixed(2),
      b.complexity,//.toFixed(2),
      b.visibility,//.toFixed(2),
      b.x,//.toFixed(2),
      b.y//.toFixed(2)
    ]]); },new Array())
  };

  var grid = new Grid("myList", {
    srcType : "json",
    srcData : listData,
    allowGridResize : true,
    allowColumnResize : true,
    allowClientSideSorting : true,
    allowSelections : true,
    allowMultipleSelections : true,
    showSelectionColumn : true,
    fixedCols : 1
  });

}

function panelGrid2() { // at panel no 4

  var t = d3.select(".panel4").append("table");

  var v = ["x", "y"];
  var k = d3.keys(v);

  /*
  var h = t.append("thead").append("tr");
  h.append("th").text("Id");
  h.selectAll("td") //td
   .data(v).enter()
   .append("td").text(function(d){return d;}); //td
  */

  var b = t.append("tbody");
  var r = d3.select("tbody").selectAll("tr")
   .data(file.data.graph.nodes).enter()
   .append("tr");

  r.append("th").text(function(d){return d.id;});
  r.selectAll("td")
   .data(function(d){ return v.map(function(k){ return k.toString().substr(0,2) + ":" + d[k].toFixed(2).toString(); }); }).enter()
   .append("td")
   .text(function(d){ return d; });

}

function ch9() {
  var ch1 = d3.select(".panel1")
    .append("div")
    .attr("class", "chart1")
    .style("opacity", 0.5)
    .style("left", "1200px")
    .style("top", "0px")
    .style("width", "500px")
    .style("height", "310px"); //0.0
  var ch1d = ch1.append("div")
     .attr("id", "chart");
  var chart1 = c3.generate({
     data: {
         x: 'x',
  //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
         columns: [
             ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
  //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
             ['wycena', 30, 200, 100, 400, 150, 250],
             ['średnia', 130, 340, 200, 500, 250, 350]
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
     chart1.load({
         columns: [
             ['benchmark', 400, 500, 450, 700, 600, 500]
         ]
     });
  }, 3000);
  ch1d.attr("id", "chart1");
};
