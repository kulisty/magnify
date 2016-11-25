function resizeButtons() {

  var width = window.innerWidth,
      height = window.innerHeight;

  d3.select('body').selectAll(".button1")
    .transition().duration(500)
    .style("left", width-40 + "px")
    .style("top", 10 + "px");

  d3.select('body').selectAll(".button2")
    .transition().duration(500)
    .style("left", width-40 + "px")
    .style("top", 42 + "px");

  d3.select('body').selectAll(".button3")
    .transition().duration(500)
    .style("left", width-40 + "px")
    .style("top", 74 + "px");

  d3.select('body').selectAll(".button4")
    .transition().duration(500)
    .style("left", width-40 + "px")
    .style("top", 106 + "px");

}

function addButtons() {

  var width = window.innerWidth,
      height = window.innerHeight;

  var b = d3.select("body").append("div").attr("class", "buttons");

  var b1 = b.append("div").attr("class", "button1")
    .style("left", width-40 + "px")
    .style("top", 10 + "px")
    .style("opacity", 0.75)
    .style("position", "absolute")
    .style("width", "30px")
    .style("height", "30px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px")
    .style("background-image", "url('css/images/icon-plus.png')")
  	.style("background-repeat", "no-repeat")
    .style("background-position", "center center");

  var b2 = b.append("div").attr("class", "button2")
    .style("left", width-40 + "px")
    .style("top", 10 + "px")
    .style("opacity", 0.75)
    .style("position", "absolute")
    .style("width", "30px")
    .style("height", "30px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px")
    .style("background-image", "url('css/images/icon-minus.png')")
    .style("background-repeat", "no-repeat")
    .style("background-position", "center center");

  var b3 = b.append("div").attr("class", "button3")
    .style("left", width-40 + "px")
    .style("top", 10 + "px")
    .style("opacity", 0.75)
    .style("position", "absolute")
    .style("width", "30px")
    .style("height", "30px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px")
    .style("background-image", "url('css/images/icon-focus.png')")
    .style("background-repeat", "no-repeat")
    .style("background-position", "center center");

  var b4 = b.append("div").attr("class", "button4")
    .style("left", width-40 + "px")
    .style("top", 10 + "px")
    .style("opacity", 0.75)
    .style("position", "absolute")
    .style("width", "30px")
    .style("height", "30px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border", "0px")
    .style("border-radius", "2px")
    .style("background-image", "url('css/images/icon-layers.png')")
    .style("background-repeat", "no-repeat")
    .style("background-position", "center center");

  resizeButtons();

}
