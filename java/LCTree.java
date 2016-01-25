package diskmat;

import java.util.ArrayList;
import java.util.List;

public class LCTree {
	private final List<Node> nodes;

	public LCTree (int n) {
		this.nodes = new ArrayList<Node>();
		for (int i = 0; i < n; i++)
			nodes.add(new Node(i));
	}

	public void link(Node v, Node w) {
		access(v);
		access(w);
		v.setLeft(w);
	}

	public void cut(Node v) {
		access(v);
		// add dcost(v) to dcost(right(v))
		v.removeLeft();
	}

	public Node findRoot(Node v) {
		access(v);
		while (v.hasLeft()) {
			v = v.getLeft();
		}
		splay(v);
		return v;
	}

	public int findCost(Node v) {
		access(v);
		return cost(v);
	}

	// Cost of vertex is interpreted as cost of vertex to its parent cost(v) => cost(v, p(v)).
	public int cost(Node v) {
		return 0; // TODO: 
	}

	// expose v;
	// add x to dcost(v);
	public void addCost(Node v) {
		access(v);
		// add x to dcost(v)
	}

	// Returns the vertex w of minimum cost on the path from v to the root
	public Node findMin(Node v) {
		access(v);
		while (v.hasLeft()) { // use deltacost deltamax to walk from v to w
			v = v.getLeft();
		}
		splay(v);
		return v;
	}

	// Returns the vertex w of maximum cost on the path from v to the root
	public Node findMax(Node v) {
		access(v);
		while (v.hasLeft()) { // use deltacost deltamax to walk from v to w
			v = v.getLeft();
		}
		splay(v);
		return v;
	}

	public void access (Node v) {
		splay(v);
		// disconnect right subtree
		if (v.hasRight()) {
			v.pathLinkRight();
		}
		// move up the pathparent-pointer, reconnect to path of v
		Node last = v;
		for (Node w = v; w.hasPathParent(); w = w.getPathParent()) {
			splay(w);
			if (w.hasRight()) {
				w.pathLinkRight();
			}
			w.setRight(last);
			last = w;
		}
		splay(v);
	}

	private void splay (Node v) {
		while (!v.isAuxRoot()) {
			Node p = v.getRealParent();
			Node pp = v.getRealParent().getRealParent();
			if (pp == null) {
				rotate(v);
			} else if ((pp.getLeft() == p && p.getLeft() == v) || (pp.getRight() == p && p.getRight() == v)) {
				rotate(p);
				rotate(v);
			} else {
				rotate(v);
				rotate(v);
			}
		}
	}

	private void rotate (Node v) {
		final Node p = v.getRealParent();
		final Node pp = p.getRealParent();
		if (p.getLeft() == v) { // right rotate
			p.setLeft(v.getRight());
			v.setRight(p);
		} else if (p.getRight() == v) { // left rotate
			p.setRight(v.getLeft());
			v.setLeft(p);
		}
		// TODO rebuild parent pointer
	}

	public boolean connected(Node v, Node w) {
		return findRoot(v).equals(findRoot(w));
	}

	public void addEdge(Node v, Node w, int newEdgeCost) {
		System.out.println("Adding new edge from " + v + " to " + w + " with cost" + newEdgeCost);
		if (!connected(v, w)) {
			System.out.println("Nodes " + v + ", " + w + " not connected. Linking!");
			link(v, w);
			// TODO: handle cost
		} else {
			System.out.println("Nodes " + v + ", " + w + " already connected. Finding max!");
			final Node currentMaxV = findMax(v);
			final Node currentMaxW = findMax(w);
			final int currentMaxVCost = findCost(currentMaxV);
			final int currentMaxWCost = findCost(currentMaxW);
			System.out.println("To root from " + v + " max " + currentMaxV + " with cost " + currentMaxVCost);
			System.out.println("To root from " + w + " max " + currentMaxW + " with cost " + currentMaxWCost);
			final Node currentMax = (currentMaxVCost > currentMaxWCost) ? currentMaxV : currentMaxW;
			final int currentMaxCost = (currentMaxVCost > currentMaxWCost) ? currentMaxVCost : currentMaxWCost;
			if (currentMaxCost > newEdgeCost) {
				cut(currentMax);
				link(v, w, newEdgeweight);
			} else {
				System.out.println("To root from " + v + " max " + currentMaxV + " with cost " + currentMaxVCost);
			}
		}
	}

	public static void main(String[] args) {
		LCTree tree = new LCTree(10);
		List<Node> nodes = tree.nodes;
		tree.addEdge(nodes.get(4), nodes.get(6),6);
		tree.addEdge(nodes.get(6), nodes.get(7),5);
		tree.addEdge(nodes.get(6), nodes.get(9),8);
		tree.addEdge(nodes.get(9), nodes.get(8),2);

		tree.addEdge(nodes.get(2), nodes.get(5),3);
		tree.addEdge(nodes.get(3), nodes.get(2),1);
		System.out.println(tree.connected(nodes.get(2), nodes.get(7)));
		for (Node node : tree.nodes) {
			System.out.println(node);
		}
		tree.access(nodes.get(6));
		System.out.println();
		for (Node node : tree.nodes) {
			System.out.println(node);
		}
		//tree.cut(tree.nodes[9]);
	}
}
