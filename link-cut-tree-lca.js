// https://github.com/PetarV-/Algorithms/blob/master/Data%20Structures/Link-cut%20Tree.cpp

LinkCutTree = function(visualization) {
  var viz = visualization;
  var LCT = {}; // should be fixed size array
window.LCT = LCT;
  this.addEdge = function(s, t, edge) {
      if(!(s in LCT)) make_tree(s, edge.source.name);
      if(!(t in LCT)) make_tree(t, edge.target.name);
      if(find_root(s) != find_root(t)) { // different component
        link(s,t);
        modify(s, t, edge.weight);
        edge.mst = true;
      } else { //same component, adding edge creates cycle
          edge.mst = false;
      }
  }
  this.cut = function(v) {
    cut(v);
     vis.update(LCT);
    
  }
  this.splay = function(v){
    splay(v);
     vis.update(LCT);
  }
  this.expose = function(v){
    expose(v);
     vis.update(LCT);
  }
  this.find_root = function(v){
    var x = find_root(v);
    console.log(x);
     vis.update(LCT);
  }  
  this.select = function(v) {
     expose(v);
     vis.update(LCT);
     
  }
  
  function findMaxEdge(v, maxw){
    console.log("findMaxEdge", v);
    var u = v;
    var x = v;
    expose(v);
    while(LCT[x].L != -1) {
      console.log(x, LCT[x].w, LCT[x].dw);
      x = LCT[x].L;
      if (LCT[x].w > maxw) {
        u = x;
      }
    }
    return u;
  }
  /*
  struct Node
  {
      int L, R, P;
      int PP;
  };
  */
    function push(v) {
      return;
      if (LCT[v].revert) {
        LCT[v].revert = false;
        var t = LCT[v].L;
        console.log(v,t);
        LCT[v].L = LCT[v].R;
        LCT[v].R = t;
        if (LCT[v].L != -1)
          LCT[LCT[v].L].revert = !LCT[LCT[v].L].revert;
        if (LCT[v].R != -1)
          LCT[LCT[v].R].revert = !LCT[LCT[v].R].revert;
      }
      LCT[v].w =  LCT[v].w +  LCT[v].dw;
      if(LCT[v].L != -1)
          LCT[LCT[v].L].dw = LCT[LCT[v].L].dw + LCT[v].dw;
      if(LCT[v].R != -1)
          LCT[LCT[v].R].dw = LCT[LCT[v].R].dw + LCT[v].dw;
      LCT[v].dw = 0;
      
      /*
      nodeValue = joinValueWithDelta(nodeValue, delta);
      subTreeValue = joinValueWithDelta(subTreeValue, deltaEffectOnSegment(delta, size));
      if (left != null)
        left.delta = joinDeltas(left.delta, delta);
      if (right != null)
        right.delta = joinDeltas(right.delta, delta);
      delta = getNeutralDelta();
      */
    }

    function update() {
      //subTreeValue = queryOperation(queryOperation(getSubTreeValue(left), joinValueWithDelta(nodeValue, delta)), getSubTreeValue(right));
      //size = 1 + getSize(left) + getSize(right);
    }  

  function make_tree(v, name) {
    if (v == -1) return;
    LCT[v] = { L: -1, R: -1, P: -1, PP: -1, w:0, dw: 0, revert: false, name:name }; // struct Node
  }
  
  function link( v,  w) // attach v's root to w
  {
    if (v == -1 || w == -1) return;
    expose(w);
    LCT[v].L = w; // the root can only have right children in its splay tree, so no need to check
    LCT[w].P = v;
    LCT[w].PP = -1;
    viz.update(LCT);
  }
  function cut(v)
  {
      if (v == -1) return;
      expose(v);
      if (LCT[v].L != -1)
      {
          LCT[LCT[v].L].P = -1;
          LCT[LCT[v].L].PP = -1;
          LCT[v].L = -1;
      }
  }
  /*
  function cut(x, y) {
    makeRoot(x);
    expose(y);
    // check that exposed path consists of a single edge (y,x)
    if (LCT[y].R != x || LCT[x].L != null)
      throw new RuntimeException("error: no edge (x,y)");
    LCT[LCT[y].R].P = -1;
    LCT[LCT[y].R].PP = -1;
    LCT[y].R = -1;
  }
  */
  function makeRoot(x) {
    expose(x);
    LCT[x].revert = !LCT[x].revert;
  }
  
  function modify( x, y, delta) {
    return;
    makeRoot(x);
    expose(y);
    LCT[y].dw += delta;
  }  

  function expose( v)
  {
      if (v == -1) return;
      splay(v); // now v is root of its aux. tree
      if (LCT[v].R != -1)
      {
          LCT[LCT[v].R].PP = v;
          LCT[LCT[v].R].P = -1;
          LCT[v].R = -1;
      }
      while (LCT[v].PP != -1)
      {
          var w = LCT[v].PP;
          splay(w);
          if (LCT[w].R != -1)
          {
              LCT[LCT[w].R].PP = w;
              LCT[LCT[w].R].P = -1;
          }
          LCT[w].R = v;
          LCT[v].P = w;
          splay(v);
      }
  }  
  function splay( v)
  {
      if (v == -1) return;
      while (LCT[v].P != -1)
      {
          var p = LCT[v].P;
          var g = LCT[p].P;
          
          if (g == -1) // zig
          {
              push(v);
              rotate(v);
          }
          else if ((LCT[p].L == v) == (LCT[g].L == p)) // zig-zig
          {
              push(p);
              push(v);
              rotate(p);
              rotate(v);
          }
          else // zig-zag
          {
              push(p);
              push(v);
              rotate(v);
              rotate(v);
          }
      }

      //update(v)
  }
  function rotate( v)
  {
      if (v == -1) return;
      if (LCT[v].P == -1) return;
      var p = LCT[v].P;
      var g = LCT[p].P;
      if (LCT[p].L == v)
      {
          LCT[p].L = LCT[v].R;
          if (LCT[v].R != -1)
          {
              LCT[LCT[v].R].P = p;
          }
          LCT[v].R = p;
          LCT[p].P = v;
      }
      else
      {
          LCT[p].R = LCT[v].L;
          if (LCT[v].L != -1)
          {
              LCT[LCT[v].L].P = p;
          }
          LCT[v].L = p;
          LCT[p].P = v;
      }
      LCT[v].P = g;
      if (g != -1)
      {
          if (LCT[g].L == p)
          {
              LCT[g].L = v;
          }
          else
          {
              LCT[g].R = v;
          }
      }
      // must preserve path-pointer!
      // (this only has an effect when g is -1)
      LCT[v].PP = LCT[p].PP;
      LCT[p].PP = -1;
  }
  function find_root( v)
  {
      if (v == -1) return -1;
      expose(v);
      var ret = v;
      while (LCT[ret].L != -1) ret = LCT[ret].L;
      expose(ret);
      return ret;
  }
  
};