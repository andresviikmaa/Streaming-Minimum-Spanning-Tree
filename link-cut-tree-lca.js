// Converted to JavaScript from https://sites.google.com/site/indy256/algo/link-cut-tree-lca
// Based on Daniel Sleator's implementation http://www.codeforces.com/contest/117/submission/860934
LinkCutTreeLca = function() {

  Node = function() {
    /*Node*/ var left = null;
    /*Node*/ var right = null;
    /*Node*/ var parent = null;

    // tests whether x is a root of a splay tree
    this.isRoot = function() {
      return parent == null || (parent.left != this && parent.right != this);
    }
  };

  /* static */ this.connect = function(/*Node */ch, /*Node */p, /*Boolean */isLeftChild) {
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
  //        g           g
  //       /           /
  //      p           x
  //     / \   -->   / \
  //    x  p.r     x.l  p
  //   / \             / \
  // x.l x.r         x.r p.r
  /*static void */  this.rotate = function(/*Node*/ x) {
    /*Node */ var p = x.parent;
    /*Node */ var g = p.parent;
    /*boolean*/ var isRootP = p.isRoot();
    /*boolean*/ var leftChildX = (x == p.left);

    // create 3 edges: (x.r(l),p), (p,x), (x,g)
    this.connect(leftChildX ? x.right : x.left, p, leftChildX);
    this.connect(p, x, !leftChildX);
    this.connect(x, g, !isRootP ? p == g.left : null);
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
  /*static void*/ this.splay = function(/*Node */x) {
    while (!x.isRoot()) {
      /*Node*/ var p = x.parent;
      /*Node*/ var g = p.parent;
      if (!p.isRoot())
        this.rotate((x == p.left) == (p == g.left) ? p/*zig-zig*/ : x/*zig-zag*/);
      this.rotate(x);
    }
  }

  // makes node x the root of the virtual tree, and also x becomes the leftmost node in its splay tree
  /*static Node */this.expose = function(/*Node */x) {
    /*Node */ var last = null;
    for (/*Node*/ var y = x; y != null; y = y.parent) {
      this.splay(y);
      y.left = last;
      last = y;
    }
    this.splay(x);
    return last;
  }

  /*public static Node */ this.findRoot = function(/*Node*/ x) {
    expose(x);
    while (x.right != null)
      x = x.right;
    splay(x);
    return x;
  }

  /*public static void */ this.link = function(/*Node*/ x, /*Node*/ y) {
    if (findRoot(x) == findRoot(y))
      throw new RuntimeException("error: x and y are already connected");
    expose(x);
    if (x.right != null)
      throw new RuntimeException("error: x is not a root node");
    x.parent = y;
  }

  /*public static void */ this.cut = function(/*Node*/ x) {
    expose(x);
    if (x.right == null)
      throw new RuntimeException("error: x is a root node");
    x.right.parent = null;
    x.right = null;
  }

  /*public static Node */ this.lca = function(/*Node*/ x, /*Node*/ y) {
    if (findRoot(x) != findRoot(y))
      throw new RuntimeException("error: x and y are not connected");
    expose(x);
    return expose(y);
  }

  /*static int */ this.root = function(/*int[] */p, /*int */u) {
    /*int*/var root = u;
    while (p[root] != -1)
      root = p[root];
    return root;
  }
}