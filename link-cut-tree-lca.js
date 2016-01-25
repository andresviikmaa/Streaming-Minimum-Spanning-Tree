// https://github.com/PetarV-/Algorithms/blob/master/Data%20Structures/Link-cut%20Tree.cpp

LinkCutTree = function() {
  var LCT = {}; // should be fixed size array

  this.addEdge = function(s, t, edge) {
      if(!(s in LCT)) make_tree(s);
      if(!(t in LCT)) make_tree(t);
      if(find_root(s) != find_root(t)) { // different component
        link(s,t);
        edge.mst = true;
      } else { //same component, adding edge creates cycle
        if(edge.weight < 0 /* max_edge(s, t)*/) {
          cut(u, v);
          link(s, t);
          edge.mst = true;
        } else { // edge weight i
          edge.mst = false;
        }
        
      }
  }
  /*
  struct Node
  {
      int L, R, P;
      int PP;
  };
  */

  function make_tree(v) {
    if (v == -1) return;
    LCT[v] = { L: -1, R: -1, P: -1, PP: -1 }; // struct Node
  }
  
  function link( v,  w) // attach v's root to w
  {
    if (v == -1 || w == -1) return;
    expose(w);
    LCT[v].L = w; // the root can only have right children in its splay tree, so no need to check
    LCT[w].P = v;
    LCT[w].PP = -1;
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
              rotate(v);
          }
          else if ((LCT[p].L == v) == (LCT[g].L == p)) // zig-zig
          {
              rotate(p);
              rotate(v);
          }
          else // zig-zag
          {
              rotate(v);
              rotate(v);
          }
      }
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