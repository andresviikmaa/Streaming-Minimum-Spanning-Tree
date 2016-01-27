UI = function(edgeAddedCallback, selectNodeCallback){
  var mst_in_progress = false;
function dist( a, b )
{
	return ((a - b) % 2) ? 60 : 120;
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx*dx + dy*dy;
}

var selectedNode = -1;
var N = 0;
var width = 960,
    height = 500;
var delay = 1000;
var force = d3.layout.force()
//    .nodes(nodes)
//    .links(links)
    .size([width, height])
//    .linkDistance(60)
    .gravity(0.1)
    .charge(-600)
    .on("tick", tick)
    .linkDistance(function(link){
      //return 60;
      var s=link.source, t= link.target;
	  return dist( parseInt(s.name), parseInt(t.name) )
      //return Math.sqrt(Math.pow(s.x0 - t.x0,2) + Math.pow(s.y0 - t.y0,2));
    })
    .start();

var nodes = force.nodes();
var links = force.links();
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
	.on("click", function(){
    if(d3.event.ctrlKey) return;
    
		var addNode1 = true;
		var addNode2 = true;
    var skipLink = false;
		d3.event.preventDefault();
		d3.event.stopPropagation();
		if(mst_in_progress) return false;
    
    var s = 0;
    var t = 1;
		
		if(N > 1) {
      s = Math.floor(Math.random() * N*2);
      do {
        t = Math.floor(Math.random() * N*2);
      } while(s == t);
    }
    var ss = s + 1;
    var tt = t + 1;
		for (var ind in nodes) { // check if node with same name exists
      if(nodes[ind].name == ss) { s = parseInt(ind); addNode1 = false};
      if(nodes[ind].name == tt) { t = parseInt(ind); addNode2 = false};
    }
		for (var ind in links) {
			if (links[ind].source.n == s && links[ind].target.n == t) skipLink = true;
			if (links[ind].source.n == t && links[ind].target.n == s) skipLink = true;
		}
		if (addNode1) s = addNode(ss);
		if (addNode2) t = addNode(tt);
      
		if(!skipLink){
			link = addLink(s,t);
    }
		return false;
		
	});

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

  var textarea = d3.select("body").append("input").on("keyup", function(e){
    if(d3.event.which == 13) {
      var edge = this.value.split(/[,\/ -]/);
      if(edge.length==2) {
        edge[0] = parseInt(edge[0]);
        edge[1] = parseInt(edge[1]);
        if (edge[0] == edge[1]) return;
        var found1 = -1;
        var found2 = -1;
        for(var ind in nodes) {
          if(nodes[ind].name == edge[0]) found1 = parseInt(ind);
          if(nodes[ind].name == edge[1]) found2 = parseInt(ind);
        }
        if( found1 >=0 && found2 >=0) {
        		for (var ind in links) {
              if (links[ind].source.n == found1 && links[ind].target.n == found2) return;
              if (links[ind].source.n == found2 && links[ind].target.n == found1) return;
            }
        }
        if (found1 < 0) {
          found1 =addNode(edge[0]);
        }
        if (found2 <0) {
          found2 = parseInt(addNode(edge[1]));
        }        
        link = addLink(found1, found2);
        this.value = '';
      }
    }
  }).attr("placeholder", "Add edge: ex: 10 - 43 ");
  var textarea = d3.select("body").append("textarea");
	

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  //svg.selectAll("g > path").attr("d", linkArc);
  svg.selectAll("g > line").attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("class", function(d) { return "link " + (d.mst == 1 ? 'mst' : (d.mst == 0 ? 'no_mst': '')); });
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

function addNode(name){
    if(mst_in_progress) return false;
  if(name == undefined) name = N+1;
	var node = {};
  if (d3.event.type == "click" )
    node = {name: name, n:N, x:d3.event.offsetX, y:d3.event.offsetY};
  else
    node = {name: name, n:N};
    
	nodes.push(node);
	svg.append("g").attr("class","circle").selectAll("circle")
      .data([node])
      .enter().append("circle")
	  .attr("r", 8)
      .call(force.drag)
	  
	  .on("click", function(d) {
	  	d3.event.stopPropagation();
      if(d3.event.ctrlKey) {
        if(selectedNode == -1) {
          selectedNode = d.n;
        } else if (selectedNode == d.n) {
          selectedNode = -1;
        } else {
          link = addLink(selectedNode, d.n);
          selectedNode = -1;
        }
        d3.event.stopPropagation();
        tick();
      } else {
        MST.select(d.n);
      }
	  });
	  
	svg.append("g").selectAll("text")
		.data([node])
		.enter().append("text")
		.attr("x", 10)
		.attr("y", ".31em")
		.text(function(d) { return d.name; });	  
    /*
    if(N > 0) {
      var s = N;
      var t = Math.floor((Math.random() * N));
      link = addLink(s, t);
      link.mst = 1;
      //MST.push(link);
      fixCycle(t, s, link)
    }
    */
	N++;
	delay = (1000 / N)*2;
	force.start();
  return node.n;
}

function addLink(s, t) {
	//console.log(s,t, d3.select("textarea")[0][0].value );
  var ss = nodes[s].name;
  d3.select("textarea")[0][0].value = nodes[s].name + " - " + nodes[t].name + "\n" + d3.select("textarea")[0][0].value;
	link = {source: nodes[s], target: nodes[t], weight: dist( parseInt(nodes[s].name), parseInt(nodes[t].name) )};
	links.push(link);
//	svg.append("g").selectAll("path")
	svg.append("g").selectAll("line")
    .data([link])
	.enter().append("line")
    .attr("class", function(d) { return "link ui " + (d.mst ? 'mst' : ''); })
//    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
  MST.addEdge(s, t, link);
	force.start();
  return link;
  //mst_kruskal();
}

this.OnMstChange = function(s,t,mst) {
  
    for (var ind in links) {
			if (links[ind].source.n == s && links[ind].target.n == t) {
          if(links[ind].weight == 60) {
            alert("Sorry, but you found the first bug from our code!");
          };
          links[ind].mst = mst; tick();
          return;
      };
			if (links[ind].source.n == t && links[ind].target.n == s) {
         if(links[ind].weight == 60) {
            alert("Sorry, but you found the first bug from our code!");
          };
          links[ind].mst = mst; tick();
          return;
      };
		}
}

}