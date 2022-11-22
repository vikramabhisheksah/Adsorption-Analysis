var states = [];
var clicked = new Set();

d3.select("#grid")
  .text()
  .split("\n")
  .forEach(function (line, i) {
    var re = /\w+/g,
      m;
    while ((m = re.exec(line))) {
      states.push({
        name: m[0],
        x: m.index / 3,
        y: i,
      });
    }
  });

var p_svg = d3.select("#periodic"),
  p_width = +p_svg.attr("width"),
  p_height = +p_svg.attr("height");

var gridWidth =
    d3.max(states, function (d) {
      return d.x;
    }) + 1,
  gridHeight =
    d3.max(states, function (d) {
      return d.y;
    }) + 1,
  cellSize = 30;

var state = p_svg
  .append("g")
  .attr(
    "transform",
    "translate(" + (p_width / 2 - 50) + "," + p_height / 2 + ")"
  )
  .selectAll(".state")
  .data(states)
  .enter()
  .append("g")
  .attr("class", function (d) {
    return "state";
  })
  .attr("transform", function (d) {
    return (
      "translate(" +
      (d.x - gridWidth / 2) * cellSize +
      "," +
      (d.y - gridHeight / 2) * cellSize +
      ")"
    );
  });

var div_tooltip = d3
  .select("#periodicTable")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("padding", "5px")
  .style("position", "absolute")
  .style("text-overflow", "ellipsis")
  .style("white-space", "pre")
  .style("line-height", "2em")
  .style("z-index", "300");

state
  .append("circle")
  .attr("cx", 1)
  .attr("cy", 1)
  .attr("r", 15)
  .on("click", function (d, item) {
    if (clicked.has(item.name)) {
      clicked.delete(item.name);
      d3.select(this).style("fill", "blue");
    } else {
      clicked.add(item.name);
      d3.select(this).style("fill", "red");
    }
    // filterFromPeriodic();
  })
  .on("mouseover", function (e, item) {
    div_tooltip.transition().duration(200).style("opacity", 0.9);
    div_tooltip
      .html(item.name)
      .style("left", e.pageX + "px")
      .style("top", e.pageY + 20 + "px");

    d3.select("#txt").selectAll("text").remove();
  })
  .on("mouseout", function (d) {
    div_tooltip.transition().duration(100).style("opacity", 0);
  });

state
  .append("text")
  .attr("dy", ".55em")
  .style("font-size", 10)
  .text(function (d) {
    return d.name;
  })
  .on("click", function (d, item) {
    if (clicked.has(item.name)) {
      clicked.delete(item.name);
      d3.select(this.parentNode).select("circle").style("fill", "blue");
    } else {
      clicked.add(item.name);
      d3.select(this.parentNode).select("circle").style("fill", "red");
    }
    console.log(clicked.values());
    // filterFromPeriodic();
  })

  .on("mouseout", function (d) {
    div_tooltip.transition().duration(100).style("opacity", 0);
  });
