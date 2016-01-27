LCTVis = function(){

  
  this.update = function(lct) {
    for (var ind in lct) {
      if(parseInt(ind) >= nodes.length) {
        addNode(parseInt(ind), lct[ind].name);
      }
    }
    links.splice(0, links.length)
    svg.selectAll("line").remove();
    for (var ind in lct) {
      if('L' in lct[ind]) {
        if(lct[ind].L != -1) addLink(parseInt(ind), lct[ind].L, "left");
        if(lct[ind].R != -1) addLink(parseInt(ind), lct[ind].R, "right");
        if(lct[ind].PP != -1) addLink(lct[ind].PP, parseInt(ind), "path");
      } else {
        if(lct[ind].left != null) addLink(parseInt(ind), lct[ind].left.n, "left");
        if(lct[ind].right != null) addLink(parseInt(ind), lct[ind].right.n, "right");
        if(lct[ind].parent && lct[ind].parent.left != this && lct[ind].parent.right != this) addLink(lct[ind].parent.n, parseInt(ind), "path");      
      }
    }
    force.start();
  }
  
  
var width = 300,
    height = 500;
var force = d3.layout.force()
//    .nodes(nodes)
//    .links(links)
    .size([width, height])
    .charge(-120)
    .linkDistance(30)
    .on("tick", tick)
    .start();
var nodes = force.nodes();
var links = force.links();
window.LCTVlinks = links
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  function findLink(s,t) {
    for (ind in links) {
      if (links[ind].source.n == s) {return ind; }
      if (links[ind].target.n == s) {return ind; }
    }
    return -1;
  }

var selectedNode = -1;
// Use elliptical arc path segments to doubly-encode directionality.
function tick(e) {
  //svg.selectAll("g > path").attr("d", linkArc);
  var k = 6 * e.alpha;
  svg.selectAll("g > line")
      .each(function(d) {
        d.source.y -= k, d.target.y += k; 
        if(d.type=="left") {
          d.target.x -=k;
        }
        if(d.type=="right") {
          d.target.x +=k;
        }
      })
      .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  svg.selectAll("g > circle").attr("transform", transform).attr("class", function(d) { return d.n == selectedNode ? 'selected' : ''; });
  svg.selectAll("g > text").attr("transform", transform);
   
  //circle.attr("transform", transform);
  //text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}


function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function addNode(n, name){
	var node = {};
  if (d3.event.type == "click" )
    node = {name: name, n:n, x:d3.event.offsetX, y:d3.event.offsetY};
  else
    node = {name: name, n:n};
    
	nodes.push(node);
	svg.append("g").attr("class","circle").selectAll("circle")
      .data([node])
      .enter().append("circle")
	  .attr("r", 8)
 	  .call(force.drag)

	svg.append("g").selectAll("text")
		.data([node])
		.enter().append("text")
		.attr("x", 10)
		.attr("y", ".31em")
		.text(function(d) { return d.name; });	  

	//force.start();
  return node.n;
}

function addLink(s, t, type) {

	//console.log(s,t, d3.select("textarea")[0][0].value );
	link = {source: nodes[s], target: nodes[t], type: type};
	links.push(link);
	svg.append("g").selectAll("line")
    .data([link])
	.enter().append("line")
    .attr("class", function(d) { return "link lct " + d.type; })
	//force.start();
  return link;
}

}
