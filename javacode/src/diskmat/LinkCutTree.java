package diskmat;

public class LinkCutTree {

	/**
	 * Calculates max cost.
	 * Travels the whole path (splay-tree) to calculate cost.
	 * Expected v to be accessed.
	 */
	public Node calcMaxRec(Node v) {
		int lCost = 0;
		Node lMax = null;
		if (v.left != null) {
			lMax = calcMaxRec(v.left);
			lCost = lMax.costToPath;
		}
		Node rMax = null;
		int rCost = 0;
		if (v.right != null) {
			rMax = calcMaxRec(v.right);
			rCost = rMax.costToPath;
		}
		if (v.costToPath >= Math.max(lCost, rCost)) {
			return v;
		} else if (lCost >= Math.max(v.costToPath, rCost) ) {
			return lMax;
		} else {
			return rMax;
		}
	}

	public Node link(Node v, Node w) {
		access(v);
		access(w);
		w.dcost -= v.dcost;
		w.left = v;
		v.parent = w;
		v.dmin = Math.min(
					Math.min(0, minCost(w)),
					minCost(v.right));
		return v;
	}

	public void cut(Node v) { // cut left
		access(v);
		v.left.dcost += v.dcost;
		v.dmin = minCost(v.right);
		v.left.parent = null;
		v.left = null;
	}

	public Node findRoot(Node v) {
		access(v);
		int vId = v.id;
		while (v.left != null) {
			System.out.println("FindRoot for " + vId + ", " + v.id);
			v = v.left;
		}
		splay(v);
		return v;
	}

	// expose v;
	// add x to dcost(v);
	public void addCost(Node v, int cost) {
		access(v);
		v.dcost = cost;
		if (v.right != null) {
			v.right.dcost -= cost;
		}
	}

	public int min(Node v) {
		access(v);
		if (v.left != null) {
			int leftminCost = v.left.dmin + v.left.dcost;
			if (leftminCost < v.dcost) {
				return leftminCost;
			}
		}
		return v.dcost;
	}

	// Returns the vertex w of minimum cost on the path from v to the root
	public Node findMin(Node v) {
		access(v);
		while (v.left != null) { // use deltacost deltamax to walk from v to w
			v = v.left;
		}
		splay(v);
		return v;
	}

	private int minCost(Node n) {
		return (n == null) ? 0 : (n.dcost + n.dmin);
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
			
			vt.dcost -= w.dcost;
			w.dmin = calcDmin(w);

			vt.pathParentLink = null;
			vt = w;
		}
		splay(v);
	}

	int calcDmin(Node v) {
		return Math.min(0, Math.min(minCost(v.left), minCost(v.right)));
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
			rotationUpdate(v, p, b);
			v.right = p;
			p.parent = v;
		} else {
			Node b = v.left;
			p.right = b;
			if (b != null) {
				b.parent = p;
			}
			rotationUpdate(v, p, b);
			v.left = p;
			p.parent = v;
		}
		if (p.pathParentLink != null) {
			v.pathParentLink = p.pathParentLink;
			p.pathParentLink = null;
		}
		v.parent = null;
	}

	private void rotationUpdate(Node v, Node p, Node c) {
		int initialVcost = v.dcost;
		v.dcost +=p.dcost;
		p.dcost = -initialVcost;
		if (c != null) {
			c.dcost += initialVcost;
		}
		v.dmin=calcDmin(v);
		p.dmin=calcDmin(p);
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
			rotationUpdate(v, p, b);
			rotationUpdate(v, g, c);
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
			rotationUpdate(v, p, b);
			rotationUpdate(v, g, c);
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
			rotationUpdate(v, p, b);
			rotationUpdate(v, g, c);
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
			rotationUpdate(v, p, b);
			rotationUpdate(v, g, c);
		}
	}

	public boolean connected(Node v, Node w) {
		return findRoot(v).equals(findRoot(w));
	}
}