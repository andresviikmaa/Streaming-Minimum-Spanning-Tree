
// LinkCut tree with path queries. Query complexity is O(log(n)) amortized.
// Based on Daniel Sleator's implementation http://www.codeforces.com/contest/117/submission/860934
LinkCutTree = function(visualization) {
  var viz = visualization;
  var LCT = {}; // should be fixed size array
  window.LCT = LCT;
  this.addEdge = function(s, t, edge) {
      if(!(s in LCT)) LCT[s] = new Node(0, s, edge.source.name);
      if(!(t in LCT)) LCT[t] = new Node(0, t, edge.target.name);
      if (!connected(LCT[s], LCT[t])) {
        link(LCT[s], LCT[t]);
        modify(LCT[s], LCT[t], edge.weight);
        edge.mst = true;
      } else {
        console.log("check path, ", LCT[s].name, LCT[t].name);
        makeRoot(LCT[s]);
        expose(LCT[t]);
        var path = LCT[t].getPath(0);
        console.log(path);
        var ii, jj = 0;
        var maxValue = -1
        for(var i=0;i<path.length;i++) {
            console.log(path[i].name, path[i].revert, path[i].nodeValue, path[i].subTreeValue, path[i].edgeValue, path[i].size);
      
            if(i>0) {
              // check that path exists
              var x = path[i];
              var y = path[i-1];
              makeRoot(x);
              expose(y);
              // check that exposed path consists of a single edge (y,x)
              if (y.right != x || x.left != null){
                alert("Sorry, but you found the second bug from our code!");
                edge.mst = -1;
                return;
              }

            
              if( path[i].edgeValue > maxValue) {
                maxValue = path[i].edgeValue;
                ii = i-1;
                jj = i;
              }
            }
        }
        if (maxValue > edge.weight) {
          console.log("must cut:" , path[ii].name , "->", path[jj].name);
          cut(path[ii], path[jj]);
          if(this.onChange != undefined) {
            this.onChange(path[ii].n, path[jj].n, false);
          }
          link(LCT[s], LCT[t]);
          modify(LCT[s], LCT[t], edge.weight);          
          edge.mst = true;
        } else {
          edge.mst = false;          
        }
      }
      vis.update(LCT);
  }

  this.select = function(v) {
    expose(LCT[v]);
    vis.update(LCT);
    
  }

  // Modify the following 5 methods to implement your custom operations on the tree.
  // This example implements Add/Sum operations. Operations like Add/Max, Set/Max can also be implemented.
  function modifyOperation(x, y) {
    return x + y;
  }

  // query (or combine) operation
  function queryOperation(leftValue, rightValue) {
    return leftValue + rightValue;
  }

  function deltaEffectOnSegment(delta, segmentLength) {
    if (delta == getNeutralDelta()) return getNeutralDelta();
    // Here you must write a fast equivalent of following slow code:
    // int result = delta;
    // for (int i = 1; i < segmentLength; i++) result = queryOperation(result, delta);
    // return result;
    return delta * segmentLength;
  }

  function getNeutralDelta() {
    return 0;
  }

  function getNeutralValue() {
    return 0;
  }

  // generic code
  function joinValueWithDelta(value, delta) {
    if (delta == getNeutralDelta()) return value;
    return modifyOperation(value, delta);
  }

  function joinDeltas(delta1, delta2) {
    if (delta1 == getNeutralDelta()) return delta2;
    if (delta2 == getNeutralDelta()) return delta1;
    return modifyOperation(delta1, delta2);
  }

  Node = function (value, id, name){
    this.nodeValue = value;
    this.subTreeValue =value;
    this.delta= getNeutralDelta();; // delta affects nodeValue, subTreeValue, left.delta and right.delta
    this.size = 1;
    this.revert = false;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.n = id;
    this.name = name;
    
    
    this.getPath = function(incomingEdgeValue) {
      this.edgeValue = incomingEdgeValue;
      var path = [];
      //if(!this.revert)
      //  path = path.concat([this]);
      if(this.left != null)
        path = path.concat(this.left.getPath(this.nodeValue - incomingEdgeValue));
      //if(this.revert)
        path = path.concat([this]);
      if(this.right != null)
        path = path.concat(this.right.getPath(this.nodeValue -incomingEdgeValue));
      return path;
    }
  
    // tests whether x is a root of a splay tree
    this.isRoot = function() {
      return this.parent == null || (this.parent.left != this && this.parent.right != this);
    }

    this.push = function() {
      if (this.revert) {
        this.revert = false;
        var t = this.left;
        this.left = this.right;
        this.right = t;
        if (this.left != null)
          this.left.revert = !this.left.revert;
        if (this.right != null)
          this.right.revert = !this.right.revert;
      }

      this.nodeValue = joinValueWithDelta(this.nodeValue, this.delta);
      this.subTreeValue = joinValueWithDelta(this.subTreeValue, deltaEffectOnSegment(this.delta, this.size));
      if (this.left != null)
        this.left.delta = joinDeltas(this.left.delta, this.delta);
      if (this.right != null)
        this.right.delta = joinDeltas(this.right.delta, this.delta);
      this.delta = getNeutralDelta();
    }

    this.update=function() {
      this.subTreeValue = queryOperation(queryOperation(getSubTreeValue(this.left), joinValueWithDelta(this.nodeValue, this.delta)), getSubTreeValue(this.right));
      this.size = 1 + getSize(this.left) + getSize(this.right);
    }
  }
  function getPath(x, y) {
    
  }
  function getSize(root) {
    return root == null ? 0 : root.size;
  }

  function getSubTreeValue(root) {
    return root == null ? getNeutralValue() : joinValueWithDelta(root.subTreeValue, deltaEffectOnSegment(root.delta, root.size));
  }

  function connect(ch, p, isLeftChild) {
    if (ch != null)
      ch.parent = p;
    if (isLeftChild != null) {
      if (isLeftChild)
        p.left = ch;
      else
        p.right = ch;
    }
  }

  // rotates edge (x, x.parent)
  //        g            g
  //       /            /
  //      p            x
  //     / \    ->    / \
  //    x  p.r      x.l  p
  //   / \              / \
  // x.l x.r          x.r p.r
   function rotate(x) {
    var p = x.parent;
    var g = p.parent;
    var isRootP = p.isRoot();
    var leftChildX = (x == p.left);

    // create 3 edges: (x.r(l),p), (p,x), (x,g)
    connect(leftChildX ? x.right : x.left, p, leftChildX);
    connect(p, x, !leftChildX);
    connect(x, g, isRootP ? null : p == g.left);
    p.update();
  }

  // brings x to the root, balancing tree
  //
  // zig-zig case
  //        g                                  x
  //       / \               p                / \
  //      p  g.r rot(p)    /   \     rot(x) x.l  p
  //     / \      -->    x       g    -->       / \
  //    x  p.r          / \     / \           x.r  g
  //   / \            x.l x.r p.r g.r             / \
  // x.l x.r                                    p.r g.r
  //
  // zig-zag case
  //      g               g
  //     / \             / \               x
  //    p  g.r rot(x)   x  g.r rot(x)    /   \
  //   / \      -->    / \      -->    p       g
  // p.l  x           p  x.r          / \     / \
  //     / \         / \            p.l x.l x.r g.r
  //   x.l x.r     p.l x.l
  function splay(x) {
    while (!x.isRoot()) {
      var p = x.parent;
      var g = p.parent;
      if (!p.isRoot())
        g.push();
      p.push();
      x.push();
      if (!p.isRoot())
        rotate((x == p.left) == (p == g.left) ? p/*zig-zig*/ : x/*zig-zag*/);
      rotate(x);
    }
    x.push();
    x.update();
  }

  // makes node x the root of the virtual tree, and also x becomes the leftmost node in its splay tree
  function expose(x) {
    var last = null;
    for (var y = x; y != null; y = y.parent) {
      splay(y);
      y.left = last;
      last = y;
    }
    splay(x);
    return last;
  }

  function makeRoot(x) {
    expose(x);
    x.revert = !x.revert;
  }

  function connected(x, y) {
    if (x == y)
      return true;
    expose(x);
    // now x.parent is null
    expose(y);
    return x.parent != null;
  }

  function link(x, y) {
    makeRoot(x);
    x.parent = y;
  }

  function cut(x, y) {
    makeRoot(x);
    expose(y);
    // check that exposed path consists of a single edge (y,x)
    if (y.right != x || x.left != null)
      throw new RuntimeException("error: no edge (x,y)");
    y.right.parent = null;
    y.right = null;
  }

  function query(_from, to) {
    makeRoot(_from);
    expose(to);
    return getSubTreeValue(to);
  }

  function modify(_from, to, delta) {
    makeRoot(_from);
    expose(to);
    to.delta = joinDeltas(to.delta, delta);
  }
}