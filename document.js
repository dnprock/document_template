/*--- IMPORTANT GUIDELINES --- 
1. Use div #canvas-svg for svg rendering
    var svg = d3.select("#canvas-svg");
2. 'data' variable contains JSON data from Data tab
    Do NOT overwrite this variable 
3. To define customizable properties, use capitalized variable names,
    and define them in Properties tab ---*/

var WIDTH = 600, HEIGHT = 450;

var nodes = {};

// Compute the distinct nodes from the links.
data.forEach(function(link) {
    link[config.source] = nodes[link[config.source]] || 
        (nodes[link[config.source]] = {name: link[config.source]});
    link[config.target] = nodes[link[config.target]] || 
        (nodes[link[config.target]] = {name: link[config.target]});
    link.value = +link.value;
});

var width = WIDTH,
    height = HEIGHT;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(data)
    .size([width, height])
    .linkDistance(config.linkDistance)
    .gravity(0.3)
    .charge(config.charge)
    .on("tick", tick)
    .start();

var svg = d3.select("#canvas-svg").append("svg")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .style("fill", config.linkColor)
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .style("stroke", config.linkColor);

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
    .attr("marker-end", "url(#end)")
    .style("stroke", config.linkColor);

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

// add the nodes
node.append("circle")
    .style("fill", config.nodeColor)
    .attr("r", 5);

// add the text 
node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .style("font-size", "14px")
    .text(function(d) { return d.name; });

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d[config.target].x - d[config.source].x,
            dy = d[config.target].y - d[config.source].y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d[config.source].x + "," + 
            d[config.source].y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d[config.target].x + "," + 
            d[config.target].y;
    });

    node
        .attr("transform", function(d) { 
  	    return "translate(" + d.x + "," + d.y + ")"; });
}

//# sourceURL=document.js
