// set the dimensions and margins of the graph
var heatmap = document.getElementById("#heatmap");
  
var margin = {top: 50, right: 30, bottom: 100, left: 100},
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select(heatmap)
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = coun=['Australia','Brazil','Canada','Switzerland','France','Germany','U S A','U Arab Emts','Hong Kong','Thailand']
var myVars = ['Fabric Materials',"Plastic Products","Handicrafts","Cosmetics","Metals","Fertilizers"]

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  

// Build X scales and axis:
var y1 = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y1));
 

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([1,100])

//Read the data
d3.csv("export.csv", function(data) {

  // create a tooltip
  var tooltip = d3.select("#heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip.style("opacity", 1)
	d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html("value : " + d.Value)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip.style("opacity", 0)
	d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll()
    .data(data, function(d) {return d.categoryName+':'+d.country_name;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.country_name) })
      .attr("y1", function(d) { return y1(d.categoryName) })
	  .attr("rx", 4)
      .attr("ry1", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y1.bandwidth() )
      .style("fill", function(d) { return myColor(d.Value)} )
	  .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})