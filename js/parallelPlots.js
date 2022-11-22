var data = [],
  currdata = [];
const bounds = {};

const svgWidth = 1000,
  svgHeight = 600;

var margin = { top: 80, right: 30, bottom: 80, left: 30 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#parallelPlots")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const createParallelPlot = () => {
  var keys = ["*OH", "*H", "*N", "*O"];

  const y = {};
  for (i in keys) {
    adsorbate = keys[i];
    y[adsorbate] = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
  }

  x = d3.scalePoint().range([0, width]).padding(0.25).domain(keys);

  svg
    .selectAll(".adsorbate")
    // For each dimension of the dataset add a 'g' element:\
    .data(keys)
    .enter()
    .append("g")
    .attr("class", "adsorbate")
    .attr("transform", (d) => "translate(" + x(d) + ")")
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().scale(y[d]));
    })
    // Add axis title
    .append("text")
    .style("text-anchor", "left")
    .style("font-size", "14px")
    .attr("y", -20)
    .text((d) => d)
    .style("fill", "black")
    .style("font-weight", "500");

  //separate function to create lines
  function line(d) {
    pts = d3.line()(
      keys.map(function (p) {
        var val = 0;
        if (p == "*H") {
          val = d.energy_h;
        } else if (p == "*N") {
          val = d.energy_n;
        } else if (p == "*O") {
          val = d.energy_o;
        } else {
          val = d.energy_oh;
        }
        // console.log([x(p), y[p](val)])
        return [x(p), y[p](val)];
      })
    );
    return pts;
  }

  const classKeys = [
    "Single Metals",
    "Binary metals",
    "Ternary Plus Metals(3+)",
    "Non Metals",
  ];

  //generate color pallete
  var colorParallelPlot = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(["#ff005d", "#DDFF00", "#00FFA2", "#2200FF"]);

  var svgLegned = d3
    .select("#parallelPlots")
    .append("div")
    .attr("class", "legend")
    .append("svg")
    .attr("width", width)
    .attr("height", 50);

  var dataL = 0;
  var offset = 220;

  var legend = svgLegned
    .selectAll(".legend")
    .data(classKeys)
    .enter()
    .append("g")
    .attr("class", "legends4")
    .attr("transform", function (d, i) {
      if (i === 0) {
        dataL = d.length + offset;
        return "translate(0,0)";
      } else {
        var newdataL = dataL;
        dataL += d.length + offset;
        return "translate(" + newdataL + ",0)";
      }
    });

  legend.on("click", function (d, structClass) {
    let i = classKeys.indexOf(structClass);
    if (!d3.select(this).classed("selected")) {
      d3.selectAll(".legends4").classed("selected", false);
      d3.select(this).classed("selected", true);

      legend.selectAll(".background").style("fill", "none");
      d3.selectAll("rect[id='class-" + i + "']").style("fill", "grey");

      currdata = data.filter((e) => e.class == i);
      createPath();
      console.log(data.length);
      console.log(currdata.length);
    } else {
      d3.selectAll(".legends4").classed("selected", false);
      legend.selectAll(".background").style("fill", "none");
      currdata = data;
      createPath();
    }
  });

  legend
    .append("rect")
    .attr("class", "background")
    .attr("id", (d, i) => "class-" + i)
    .attr("x", 60)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 50)
    .style("fill", "none")
    .style("opacity", 0.2);

  legend
    .append("rect")
    .attr("x", 80)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d, i) {
      return colorParallelPlot(i);
    });

  legend
    .append("text")
    .attr("x", 100)
    .attr("y", 30)
    .text(function (d, i) {
      return d;
    })
    .style("text-anchor", "start")
    .style("font-size", 15);

  //generate tooltips
  var Tooltip = d3
    .select("#parallelPlots")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  //functions for mouseover, mousemove and mouseleave
  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
    miller_indices = d.target.__data__.miller_index;
    miller_indices = miller_indices.replace("(", "");
    miller_indices = miller_indices.replace(")", "");
    miller_indices = miller_indices.split(",");
    //The function is not ready to be used in alpha release
    // drawThreePointTriangle(miller_indices[0],miller_indices[1],miller_indices[2]);
  };
  var mousemove = function (d) {
    Tooltip.html(
      "bulk mpid:" +
        d.target.__data__.bulk_mpid +
        "<br/>" +
        "bulk symbols:" +
        d.target.__data__.bulk_symbols +
        "<br/>" +
        "miller index:" +
        d.target.__data__.miller_index +
        "<br/>" +
        "shift:" +
        d.target.__data__.shift +
        "<br/>" +
        "top:" +
        d.target.__data__.top
    )
      .style("left", d.pageX + 70 + "px")
      .style("top", d.pageY + "px");
  };

  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "#69b3a2").style("opacity", 0.5);
  };

  //Adding the individual paths to the visualization
  const createPath = () => {
    svg
      .append("g")
      .selectAll("path")
      .data(currdata)
      .enter()
      .append("path")
      .attr("d", (d) => line(d))
      .style("fill", "none")
  
      
  };

  const background = svg
    .append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", line)
    .style("fill", "none");
    

  // Add blue foreground lines for focus.
  const foreground = svg
    .append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(currdata)
    .enter()
    .append("path")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", (d) => colorParallelPlot(d.class))
    .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);;

  var dragging = {};
  var g = svg
    .selectAll(".dimension")
    .data(keys)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .call(
      d3
        .drag()
        .on("start", function (d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function (d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", line);
          dimensions.sort(function (a, b) {
            return position(a) - position(b);
          });
          x.domain(keys);
          g.attr("transform", function (d) {
            return "translate(" + position(d) + ")";
          });
        })
        .on("end", function (d) {
          delete dragging[d];
          transition(d3.select(this)).attr(
            "transform",
            "translate(" + x(d) + ")"
          );
          transition(foreground).attr("d", line);
          background
            .attr("d", line)
            .transition()
            .delay(500)
            .duration(0)
            .attr("visibility", null);
        })
    );

  g.append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(
        (y[d].brush = d3
          .brushY()
          .extent([
            [-10, 0],
            [10, height],
          ])
          .on("start", brushstart)
          .on("brush", brush)
          .on("end", brush))
      );
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  // createPath();


function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

function brushstart(e) {
  e.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  // Get a set of dimensions with active brushes and their current extent.
  var actives = [];
  svg
    .selectAll(".brush")
    .filter(function (d) {
      return d3.brushSelection(this);
    })
    .each(function (keys) {
      actives.push({
        dimension: keys,
        extent: d3.brushSelection(this),
      });
    });
  // Change line visibility based on brush extent.
  if (actives.length === 0) {
    foreground.style("display", null);
  } else {
    foreground.style("display", function (d) {
      return actives.every(function (brushObj) {
        var val;
        p = brushObj.dimension
        if (p == "*H") {
          val = d.energy_h;
        } else if (p == "*N") {
          val = d.energy_n;
        } else if (p == "*O") {
          val = d.energy_o;
        } else {
          val = d.energy_oh;
        }
        return (
          brushObj.extent[0] <= y[brushObj.dimension](val) &&
          y[brushObj.dimension](val) <= brushObj.extent[1]
        );
      })
        ? null
        : "none";
    });
  }
}
};


const loadData = (file) => {
  // read the csv file
  d3.csv(file).then(function (
    fileData // iterate over the rows of the csv file
  ) {
    fileData.forEach((d) => {
      // get the min bounds
      bounds.minEnergy = Math.min(bounds.minEnergy || Infinity, d.energy);

      // get the max bounds
      bounds.maxEnergy = Math.max(bounds.maxEnergy || -Infinity, d.energy);

      // add the element to the data collection
      data.push({
        bulk_symbols: d.bulk_symbols,
        // ads_symbols: d.ads_symbols,
        miller_index: d.miller_index,
        bulk_mpid: d.bulk_mpid,
        class: parseInt(d.class),
        shift: d.shift,
        top: d.top,
        // adsorption_site: d.adsorption_site,
        energy_oh: d.energy_oh,
        energy_h: d.energy_h,
        energy_n: d.energy_n,
        energy_o: d.energy_o,
      });
    });

    currdata = data;
    createParallelPlot();
  });
};
loadData("./data/clean_data_vds_new.csv");
