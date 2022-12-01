var states = [];
var periodicTableClasses = ['Alkali Metals', 'Alkaline Earth Metals', 'Transition Metals','Other Metals', 'Metalloids', 'Non Metals', 'Noble Gases' ]
var periodicELements={
  0: ['Li','Na','K','Rb','Cs','Fr','La','Ce','Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu'],
  1: ['Be','Mg','Ca', 'Sr','Ba','Ra'],
  2: ['Sc','Y','Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn','Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd','Hf', 'Ta', 'W','Re', 'Os', 'lr', 'Pt', 'Au', 'Hg','Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'FI', 'Mc', 'Lv', 'Ts', 'Og'],
  3: ['Al','Ga','In','Sn','Tl','Pb','Bi','Po','At'],
  4: ['B','Si','Ge','As','Sb','Te'],
  5: ['C','N','O','F', 'P','S','Cl','Se','Br','I'],
  6: ['He','Ne','Ar','Kr','Xe','Rn']
}

var periodicColorScale = d3.scaleOrdinal().domain([0,1,2,3,4,5,6]).range(['#7fc97f','#bf5b17','#386cb0','#beaed4','#ffff99','#fdc086','#f0027f']);

const colorFromElement=(element)=>{
   var allElements = Object.values(periodicELements)
   var index=6 ;
   allElements.forEach((v,k)=>{
     if(v.includes(element)){
      index = k
     }
   });
   return periodicColorScale(index)
}

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
      d3.select(this).style("fill",colorFromElement(item.name));
    } else {
      clicked.add(item.name);
      d3.select(this).style("fill",'blue');
    }
    filterFromPeriodic();
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
  .style('fill','black')
  .on("click", function (d, item) {
    if (clicked.has(item.name)) {
      clicked.delete(item.name);
      d3.select(this.parentNode).select("circle").style("fill",colorFromElement(item.name));
      
    } else {
      clicked.add(item.name);
      d3.select(this.parentNode).select("circle").style("fill", "blue");
    }
    filterFromPeriodic();
  })
  .on("mouseout", function (d) {
    div_tooltip.transition().duration(100).style("opacity", 0);
  });

state
  .style('fill',function(d){
    return colorFromElement(d.name)
  })