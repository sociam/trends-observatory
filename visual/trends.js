// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d.bar; }
function y(d) { return d.rank ; }
function radius(d) { return d.radius; }
function color(d) { return d.topic; }
function key(d) { return d.timestamp; }

// Chart dimensions.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = 960 - margin.right,
    height = 500 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.linear().domain([0, 10]).range([0, width]),
    yScale = d3.scale.linear().domain([11, 0]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 10]).range([0, 20]),
    colorScale = d3.scale.category20b();

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(11).tickFormat(barName),
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(12).tickFormat(function(d) { if (d<11 && d>0) return d; return ""; });

// Create the SVG container and set the origin.
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add an x-axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Source (and location)");

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Rank");

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(formatDate(new Date()));

function getMonthName(month, short) {
  switch(month) {
    case 0:
      if (short) return "Jan";
      return "January";
    case 1:
      if (short) return "Feb";
      return "February";
    case 2:
      if (short) return "Mar";
      return "March";
    case 3:
      if (short) return "Apr";
      return "April";
    case 4:
      return "May";
    case 5:
      if (short) return "Jun";
      return "June";
    case 6:
      if (short) return "Jul";
      return "July";
    case 7:
      if (short) return "Aug";
      return "August";
    case 8:
      if (short) return "Sep";
      return "September";
    case 9:
      if (short) return "Oct";
      return "October";
    case 10:
      if (short) return "Nov";
      return "November";
    case 11:
      if (short) return "Dec";
      return "December";
  }
}

function padZero(x) {
  if (x>=0 && x<10) {
    return "0"+x;
  }
  return x;
}

function formatDate(d) {
  return padZero(d.getDate())+" "+getMonthName(d.getMonth(), true)+" "+padZero(d.getHours())+":"+padZero(d.getMinutes());
}

function barId(source, location) {
  switch(source.trim()) {
    case "Twitter": 
      switch(location.trim()) {
        case "Worldwide":
          return 1;
        case "United Kingdom":
          return 2;
        case "United States":
          return 3;
        case "London, United Kingdom":
          return 4;
        case "Washington, United States":
          return 5;
      }
    case "Yahoo":
      switch(location.trim()) {
        case "United Kingdom":
          return 6;
        case "United States":
          return 7;
      }
    case "Google":
      switch(location.trim()) {
        case "United Kingdom":
          return 8;
        case "United States":
          return 9;
      }
    default:
      console.log("weird looking source or location: ", source, location);
      return 10;
  }
}

function barName(barId) {
  switch(barId) {
    case 1:
      return "Twitter (Worldwide)";
    case 2:
      return "Twitter (UK)";
    case 3:
      return "Twitter (US)";
    case 4:
      return "Twitter (London)";
    case 5:
      return "Twitter (Washington)";
    case 6:
      return "Yahoo (UK)";
    case 7:
      return "Yahoo (US)";
    case 8:
      return "Google (UK)";
    case 9:
      return "Google (US)";
    default:
      return "";
  }
}

// Load the data.
d3.json("trends.json", function(trends) {

  // A bisector since many nation's data is sparsely-defined.
  // var bisect = d3.bisector(function(d) { return d[0]; });

  // Add a dot per nation. Initialize the data at 1800, and set the colors.
  var dot = svg.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(interpolateData(new Date("2014-10-16")))
      .enter().append("circle")
      .attr("class", "dot")
      .style("fill", function(d) { return colorScale(color(d)); })
      .call(position)
      .sort(order);

  // Add a title.
  dot.append("title")
      .text(function(d) { return d.label; });

  // Add an overlay for the year label.
  var box = label.node().getBBox();

  var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height);
        // .on("mouseover", enableInteraction);

  // Start a transition that interpolates the data based on year.
  svg.transition()
      .duration(576000)
      .ease("linear")
      .tween("interval", tweenInterval)
      .each("end", enableInteraction);

  // Positions the dots based on data.
  function position(dot) {
    dot .attr("cx", function(d) { return xScale(x(d)); })
        .attr("cy", function(d) { return yScale(y(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return key(a) - key(b);
  }

  // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
        .domain([new Date("2014-10-16"), new Date()])
        .range([box.x + 10, box.x + box.width - 10])
        .clamp(true);

    // Cancel the current transition, if any.
    svg.transition().duration(0);

    overlay
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove);

    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    function mousemove() {
      displayInterval(yearScale.invert(d3.mouse(this)[0]));
    }
  }

  // Tweens thetrends entire chart by first tweening the year, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenInterval() {
    var interval = d3.interpolateNumber(new Date("2014-10-16"), new Date());
    console.log(interval);
    return function(t) { console.log("called the tween with t ", t); displayInterval(interval(t)); };
  }

  // Updates the display to show the specified interval.
  function displayInterval(inter) {
    var d = new Date(inter);
    d.setMinutes(d.getMinutes() - (d.getMinutes() % 5));
    d.setSeconds(0);
    d.setMilliseconds(0);
    dot.data(interpolateData(d), key).call(position).sort(order);
    label.text(formatDate(d));
  }


  // Interpolates the dataset for the given timestamp's 5min interval.
  function interpolateData(time) {
    console.log("interpolating on ", time);
    return trends.map(function(d) {
      var ts = new Date(d.timestamp['$date']);
      ts.setMinutes(ts.getMinutes() - (ts.getMinutes() % 5));
      ts.setSeconds(0);
      ts.setMilliseconds(0);
      // if (ts === time) {
        // console.log(ts,time);
        return d.trends.map(function(t) {
          return {
            bar: barId(d.source, d.location),
            rank: t.rank, 
            radius: 11-t.rank, 
            label: t.label,  //interpolateValues(d.income, year),
            topic: findTopic(t.label),
            timestamp: ts,
          };
        });
      // }
    }).reduce(function(a, b) {
      return a.concat(b);
    }, []);
  }

  function findTopic(label) {
    // for now this is the default, no topic detection 
    return label;
  } 

  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(values, year) {
    var i = bisect.left(values, year, 0, values.length - 1),
        a = values[i];
    if (i > 0) {
      var b = values[i - 1],
          t = (year - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
});
