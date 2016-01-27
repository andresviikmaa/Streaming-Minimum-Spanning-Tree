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
	public String toString() {
		return "Node [id=" + id 
					+ ", cost="+cost
					+ (pathParentLink == null ? "" : ", link=" + pathParentLink.id)
					+ (parent == null ? "" : ", p=" + parent.id)
					+ (left == null ? "" : ", l=" + left.id)
					+ (right == null ? "" : ", r=" + right.id) 
					+ "]";
	}
}