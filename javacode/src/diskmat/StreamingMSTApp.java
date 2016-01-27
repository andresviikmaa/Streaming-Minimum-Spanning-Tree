package diskmat;

import java.util.Map;
import java.util.TreeMap;

public class StreamingMSTApp {
	private final LinkCutTree tree = new LinkCutTree();
	private final Map<Integer, Node> nodes = new TreeMap<>();

	public void addEdge(int vId, int wId, int newEdgeCost) {
		if (!nodes.containsKey(vId)) {
			nodes.put(vId, new Node(vId, 0));
		}
		if (!nodes.containsKey(wId)) {
			nodes.put(wId, new Node(wId, newEdgeCost));
		}
		final Node v = nodes.get(vId);
		final Node w = nodes.get(wId);
		System.out.println("Adding new edge from " + v + " to " + w + " with cost " + newEdgeCost);
		if (!tree.connected(v, w)) {
			System.out.println(v + ", " + w + " not connected. Linking!");
			tree.link(v, w);
		} else {
			System.out.println(v + ", " + w + " already connected. Finding max!");

			final Node currentMaxV = tree.calcMaxRec(v);
			final Node currentMaxW = tree.calcMaxRec(w);
			System.out.println("VMax=" + currentMaxV + ", WMax=" + currentMaxW);
			Node currentMax = currentMaxV.costToPath > currentMaxW.costToPath ? currentMaxV : currentMaxW;
			if (currentMax.costToPath > newEdgeCost) {
				System.out.println("Current max " + currentMax + " is more than new edge cost " + newEdgeCost + ", cutting " + currentMax.id);
				tree.cut(currentMax);
				nodes.remove(currentMax.id);
				tree.link(v, w);
			} else {
				System.out.println("To root from " + v + " max " + currentMaxV + " with cost " + currentMaxV.dcost);
			}
		}
	}

	public Node findRoot(int vId) {
		final Node v = get(vId);
		if (v == null) {
			throw new IllegalArgumentException("Node is null " + vId);
		}
		return tree.findRoot(v);
	}

	public boolean connected(int vId, int wId) {
		final Node v = get(vId);
		final Node w = get(wId);
		return tree.connected(v, w);
	}

	private Node get(int vId) {
		final Node v = nodes.get(vId);
		if (v == null) {
			throw new IllegalArgumentException("Node is null " + vId);
		}
		return v;
	}

	public void test() {
		addEdge(2, 5, 3);
		addEdge(2, 7, 7);
		addEdge(3, 2, 7);
		addEdge(3, 6, 7);
		//findRoot(2);
		//findRoot(3);
		//findRoot(5);
		addEdge(3,5,5);
		addEdge(2,9,14);
		//findRoot(9);
		addEdge(17,13,12);
		addEdge(13,23,11);
		//findRoot(13);
		addEdge(17,4,9);
		addEdge(23, 6, 7);
		addEdge(4,13,1);
		//findRoot(13);
		//findRoot(3);
		//findRoot(2);
		//findRoot(3);
		//findRoot(5);
	}

	public static void main(String[] args) {
		new StreamingMSTApp().test();
	}
}