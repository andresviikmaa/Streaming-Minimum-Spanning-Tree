MstNaive = function() {
  this.edges = [];
  this.findEdge = function (s) {
    for (ind in this.edges) {
      if (this.edges[ind].source.n == s && !this.edges[ind].visited) { this.edges[ind].visited = true; return [this.edges[ind], this.edges[ind].target.n, ind]; }
      if (this.edges[ind].target.n == s && !this.edges[ind].visited) { this.edges[ind].visited = true; return [this.edges[ind], this.edges[ind].source.n, ind]; }
    }
    return [-1, -1];
  }
  this.traversePath = function(v, t, path) {
    if(t == v) return path;
    while(true) {
      var edge = this.findEdge(v);
      if(edge[0] == -1) return -1;
      var new_path = this.traversePath(edge[1], t, path.concat([ edge ]));
      if(new_path !== -1) return new_path;
    }
    return -1;
  }

  this.addEdge = function(s, t, edge) {
      console.log(s, t, this.edges);
      for (ind in this.edges) {
          this.edges[ind].visited = false;
      }
      path = this.traversePath(s, t, []);
      if(path === -1 || path.length == 0) {
        link.mst = true;
        this.edges.push(link);
        tick();
        return;
      }
      path.sort( function(a, b) { return a[0].weight - b[0].weight; } );
      console.log(path);
      if(path[path.length-1][0].weight > link.weight) {
        path[path.length-1][0].mst = false;
        this.edges.splice(path[path.length-1][2], 1);
        link.mst = true;
        this.edges.push(link);
        tick();
        return;
      }
      link.mst = false;

        
  }
}