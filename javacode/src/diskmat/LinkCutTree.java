package diskmat;

public class LinkCutTree {

	/**
	 * Calculates max cost node on the path from v to MST root.
	 * Travels the whole path (splay-tree) to calculate cost.
	 */
	public Node calcMax(Node v) {
		access(v);
		System.out.println("calcmax " + v);
		return calcMaxRec(v);
	}
	private Node calcMaxRec(Node v) {
		int lCost = 0;
		Node lMax = null;
		if (v.left != null) {
			System.out.println("calcmax l " + v.left);
			lMax = calcMaxRec(v.left);
			lCost = lMax.cost;
		}
		Node rMax = null;
		int rCost = 0;
		if (v.right != null) {
			System.out.println("calcmax r " + v.right);
			rMax = calcMaxRec(v.right);
			rCost = rMax.cost;
		}
		if (v.cost >= Math.max(lCost, rCost)) {
			return v;
		} else if (lCost >= Math.max(v.cost, rCost) ) {
			return lMax;
		} else {
			return rMax;
		}
	}

	public Node link(Node v, Node w) {
		access(v);
		access(w);
		w.left = v;
		v.parent = w;
		return v;
	}

	public void cut(Node v) { // cut left
		access(v);
		v.left.parent = null;
		v.left = null;
	}

	public Node findRoot(Node v) {
		access(v);
		while (v.left != null) {
			v = v.left;
		}
		splay(v);
		return v;
	}

	public void access (Node v) {
		splay(v);
		// disconnect right subtree (v is left as pathparent, not real parent as before)
		if (v.right != null) {
			v.right.parent = null;
			v.right.pathParentLink = v;
			v.right = null;
		}
		// move up the pathparent-pointer, reconnect to path of v
		Node vt = v;
		while (vt.pathParentLink != null) {
			Node w = vt.pathParentLink;
			splay(w);

			final Node wr = w.right;
			if (wr != null) {
				wr.parent = null;
				wr.pathParentLink = w;
			}
			w.right = vt;
			vt.parent = w;
			vt.pathParentLink = null;
			vt = w;
		}
		splay(v);
	}

	private void splay (Node v) {
		while (v.parent != null) {
			final Node p = v.parent;
			if (p.parent == null) { // zig
				zig(v);
			} else {
				final Node g = p.parent;
				final Node gg = g == null ? null : g.parent;
				final boolean isLeftChildG = gg != null && gg.left == g;
				if ((g.left == p && p.left == v) || (g.right == p && p.right == v)) { // both left or both right
					zigzig(v);
				} else {
					zigzag(v);
				}
				
				if (gg != null) {
					if (isLeftChildG) {
						gg.left=v;
					} else {
						gg.right=v;
					}
				}
				v.parent=gg;
				v.pathParentLink = g.pathParentLink;
				g.pathParentLink = null;
			}
		}
	}

	private void zig(Node v) {
		final Node p = v.parent;
		if (p.left == v) { // right rotate
			Node b = v.right;
			p.left = b;
			if (b != null) {
				b.parent = p;
			}
			v.right = p;
			p.parent = v;
		} else {
			Node b = v.left;
			p.right = b;
			if (b != null) {
				b.parent = p;
			}
			v.left = p;
			p.parent = v;
		}
		if (p.pathParentLink != null) {
			v.pathParentLink = p.pathParentLink;
			p.pathParentLink = null;
		}
		v.parent = null;
	}

	private void zigzig(Node v) {
		final Node p = v.parent;
		final Node g = p.parent;
		if (p.left == v) { // right rotate both
			Node b = v.right;
			Node c = p.right;
			p.left = b;
			if (b != null) {
				b.parent = p;
			}
			g.left = c;
			if (c != null) {
				c.parent = g;
			}
			v.right=p;
			p.parent=v;
			p.right=g;
			g.parent=p;
		} else { // left rotate both
			Node b = v.left;
			Node c = p.left;
			p.right = b;
			if (b != null) {
				b.parent = p;
			}
			g.right = c;
			if (c != null) {
				c.parent = g;
			}
			v.left=p;
			p.parent=v;
			p.left=g;
			g.parent=p;
		}
	}

	private void zigzag(Node v) {
		final Node p = v.parent;
		final Node g = p.parent;
		if (p.left == v) {
			Node b = v.right;
			Node c = v.left;
			p.left = b;
			if (b != null) {
				b.parent = p;
			}
			g.right = c;
			if (c != null) {
				c.parent = g;
			}
			v.right = p;
			p.parent = v;
			v.left = g;
			g.parent = v;
		} else {
			Node b = v.left;
			Node c = v.right;
			p.right = b;
			if (b != null) {
				b.parent = p;
			}
			g.left = c;
			if (c != null) {
				c.parent = g;
			}
			v.left = p;
			p.parent = v;
			v.right = g;
			g.parent = v;
		}
	}

	public boolean connected(Node v, Node w) {
		return findRoot(v).equals(findRoot(w));
	}
}