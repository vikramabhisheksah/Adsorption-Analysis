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
console.log(states);

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
console.log(gridHeight);
console.log(gridWidth);

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

var div = d3
  .select("periodicTable")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

state
  .append("circle")
  .attr("cx", 1)
  .attr("cy", 1)
  .attr("r", 15)
  .on("click", function (d, item) {
    if (clicked.has(item)) {
      clicked.delete(item);
      d3.select(this).style("fill", "blue");
    } else {
      clicked.add(item);
      d3.select(this).style("fill", "red");
    }
    console.log(clicked.values());
  })
  .on("mouseover", function (e, item) {
    console.log(e);
    div.transition().duration(200).style("opacity", 0.9);

    div
      .html(item.name)
      .style("left", e.pageX + "px")
      .style("top", e.pageY - 28 + "px");

    d3.select("#txt").selectAll("text").remove();

    d3.select("#txt")
      .append("text")
      .attr("font-size", "2em")
      .attr("color", "black")
      .text(function (d) {
        return "Selected:" + Array.from(clicked);
      });
  })
  .on("mouseout", function (d) {
    div.transition().duration(100).style("opacity", 0);
  });

state
  .append("text")
  .attr("dy", ".55em")
  .style("font-size", 10)
  .text(function (d) {
    return d.name;
  })
  .on("click", function (d, item) {
    if (clicked.has(item)) {
      clicked.delete(item);
      d3.select(this).style("fill", "blue");
    } else {
      clicked.add(item);
      d3.select(this).style("fill", "red");
    }
    console.log(clicked.values());
  })

  .on("mouseout", function (d) {
    div.transition().duration(100).style("opacity", 0);
  });
