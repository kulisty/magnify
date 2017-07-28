function clickFreeze() {
  view.simu.stop();
  //d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = true} );
}

function clickUnfreeze() {
  //d3.select('body').select('svg').selectAll('.node').classed("fixed", function(d) {d.fixed = false} );
  view.simu.restart();
}

function clickReload() {
  //view.simu.stop();
  //view.simu.restart();
  view.simu.nodes().forEach(
    function(o, i) {
      o.x += (Math.random() - .5) * 40;
      o.y += (Math.random() - .5) * 40;
    }
  );
  view.simu.alphaTarget(1).restart();
}

function clickBoard() {
  //view.simu.stop();
  //view.simu.restart();
  if (d3.select('body').selectAll(".board").attr("hidden") == "hidden")
    d3.select('body').selectAll(".board").attr("hidden", null)
  else
    d3.select('body').selectAll(".board").attr("hidden", "hidden");
}
