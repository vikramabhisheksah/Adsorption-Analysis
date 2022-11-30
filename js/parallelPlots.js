var data = [],
  currdata = [];
const bounds = {};
var brushFlag = 0;
const svgWidth = 700,
  svgHeight = 500;
var clicked = new Set();
let background=null, foreground=null;

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

  x = d3.scalePoint().range([0, width]).padding(0.05).domain(keys);

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
        return [x(p), y[p](val)];
      })
    );
    return pts;
  }

  const classKeys = [
    "Single Metals",
    "Binary Metals",
    "Ternary Metals(3+)",
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
  var offset = 150;

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
   
    

  let brushedPaths;
  const getBrushedPaths = () => {
    brushedPaths = foreground.filter(function () {
      return (
        d3.select(this).style("display") === "inline" ||
        d3.select(this).style("display") === null
      );
    });
  };
  legend.on("click", function (d, structClass) {
    let i = classKeys.indexOf(structClass);
    if (!brushedPaths) {
      getBrushedPaths();
    }
    if (!d3.select(this).classed("selected")) {
      d3.selectAll(".legends4").classed("selected", false);
      d3.select(this).classed("selected", true);
      brushedPaths.style("display", (d) => (d.class === i ? null : "none"));
    } else {
      d3.selectAll(".legends4").classed("selected", false);
      brushedPaths.style("display", "inline");
    }
  });

  legend
    .append("rect")
    .attr("class", "background")
    .attr("id", (d, i) => "class-" + i)
    .attr("x", 20)
    .attr("y", 0)
    .attr("width", 150)
    .attr("height", 50)
    .style("opacity", 0.2)
    .on("mouseover", function(d){
      d3.select(this).style('border-color','black').style('border-style','solid').style('border-width','5px')
    })
    .on("mouseleave", function(d){
      d3.select(this).style('background','none')
    });

  legend
    .append("rect")
    .attr('id',function(d,i){
      return 'color-block'+i
    })
    .attr("x", 30)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d, i) {
      return colorParallelPlot(i);
    });
    

  legend
    .append("text")
    .attr("x", 50)
    .attr("y", 30)
    .text(function (d, i) {
      return d;
    })
    .style("text-anchor", "start")
    .style("font-size", 15)
    .on("mouseover", function(d,i){
      let x = classKeys.indexOf(i)
      d3.select(this).style('font-size',18)
      d3.select('#color-block'+x).attr('width', 14).attr('height', 14)
    })
    .on("mouseleave", function(d,i){
      d3.select(this).style('font-size',15)
      let x = classKeys.indexOf(i)
      d3.select('#color-block'+x).attr('width', 10).attr('height', 10)
    });

  //generate tooltips
  var Tooltip = d3
    .select("#parallelPlots")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background", "transparent")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("text-overflow", "ellipsis")
    .style("white-space", "pre")
    .style("line-height", "2em")
    .style("z-index", "300");

  //functions for mouseover, mousemove and mouseleave
  var mouseover = function (d) {
    Tooltip.style("opacity", 0.5).style("font-weight", 800);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
      .style("stroke-width", 2);
    miller_indices = d.target.__data__.miller_index;
    miller_indices = miller_indices.replace("(", "");
    miller_indices = miller_indices.replace(")", "");
    miller_indices = miller_indices.split(",");
    // drawThreePointTriangle(miller_indices[0],miller_indices[1],miller_indices[2]);
  };
  var mousemove = function (d) {
    Tooltip.html(
      "bulk mpid:&#09;" +
        d.target.__data__.bulk_mpid +
        "<br/>" +
        "bulk symbols:&#09;" +
        d.target.__data__.bulk_symbols +
        "<br/>" +
        "miller index:&#09;" +
        d.target.__data__.miller_index +
        "<br/>" +
        "shift:&#09;" +
        d.target.__data__.shift +
        "<br/>"
    )
      .style("left", d.pageX + 70 + "px")
      .style("top", d.pageY + "px");
  };

  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    d3.select(this)
      .style("stroke", (d) => colorParallelPlot(d.class))
      .style("opacity", 0.3)
      .style("stroke-width", 0.5);
  };

   background = svg
    .append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", line)
    .style("fill", "none");

  // Add blue foreground lines for focus.
   foreground = svg
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
    .on("mouseleave", mouseleave);

  var g = svg
    .selectAll(".dimension")
    .data(keys)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    });

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

  function brushstart(e) {
    e.sourceEvent.stopPropagation();
    brushFlag = 1;
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
        let clickedArr = Array.from(clicked)
        return actives.every(function (brushObj) {
          var val;
          p = brushObj.dimension;
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
          )
        }) && clickedArr.some((val)=>{
          return (d.bulk_symbols.includes(val))
        })
          ? null
          : "none";
      });
    }
    getBrushedPaths();
  }

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
    .style("stroke-width", 1)
    // .on('mouseover', ()=>{
    //   d3.select('g').style('stroke-width',2)
    // })
    // Add axis title
    .append("text")
    .style("text-anchor", "left")
    .style("font-size", "14px")
    .attr("y", -20)
    .text((d) => d)
    .style("fill", "black")
    .style("font-weight", "500");

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

const filterFromPeriodic=()=>{
  let clickedArr = Array.from(clicked)
  currdata = data.filter((item)=>clickedArr.some((val)=>{
    return (item.bulk_symbols.includes(val))
  }))

  foreground.style("display", function (d) {
    return clickedArr.some((val)=>{
      return (d.bulk_symbols.includes(val))
    })? null:'none'
  })
}

loadData("./data/clean_data_vds_new.csv");
