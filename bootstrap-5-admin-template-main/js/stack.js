var path="export.csv";
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var chart4 = d3.select("#stackArea1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv(path, function(data) {

  // group the data: one array for each value of the X axis.
  var sumstat = d3.nest()
    .key(function(d) { return d.year;})
    .entries(data);

  // Stack the data: each group will be represented on top of each other
  var mygroups = ['Australia','Brazil','Canada','Switzerland','France','Germany','U S A','U Arab Emts','Thailand'] // list of group names
  var mygroup = [1,2,3,4,5,6,7,8,9] // list of group names
  var stackedData = d3.stack()
    .keys(mygroup)
    .value(function(d, key){
      return d.values[key].quantity
    })
    (sumstat)

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  chart4.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(9));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.quantity; })*0.07])
    .range([ height, 0 ]);
  chart4.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var color = d3.scaleOrdinal()
    .domain(mygroups)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Show the areas
  chart4
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .style("fill", function(d) { name = mygroups[d.key-1] ;  return color(name); })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data.key); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )

})
