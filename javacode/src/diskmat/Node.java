package diskmat;

public class Node {
	public final int id;

	public int cost;

	// tree pointers
	public Node pathParentLink;
	public Node parent;
	public Node left;
	public Node right;

	public Node(int id, int cost) {
		this.id = id;
		this.cost = cost;
	}

	@Override
	public boolean equals(Object obj) {
		return obj != null && id == ((Node)obj).id;
	}

	public int getCost() {
		return 0;
	}

	@Override
	public String toString() {
		String parentStr = "";
		if (pathParentLink != null) {
			parentStr+=", link=" + pathParentLink.id;
		}
		if (parent != null) {
			parentStr+=", p=" + parent.id;
		}

		return "Node [id=" + id 
					+ ", cost="+cost
					+ parentStr
					+ (left == null ? "" : ", l=" + left.id)
					+ (right == null ? "" : ", r=" + right.id) 
					+ "]";
	}
}