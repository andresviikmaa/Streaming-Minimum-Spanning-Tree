package diskmat;

public class Node {
	public final int id;

	public Integer dcost;
	public Integer dmin;
	public int costToPath;

	// tree pointers
	public Node pathParentLink;
	public Node parent;
	public Node left;
	public Node right;

	public Node(int id, int cost) {
		this.id = id;
		this.dcost = cost;
		this.dmin = 0;
		this.costToPath = cost;
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
					+ ", dcost="+dcost
					+ ", dmin="+dmin
					+ ", cost="+costToPath
					+ parentStr
					+ (left == null ? "" : ", l=" + left.id)
					+ (right == null ? "" : ", r=" + right.id) 
					+ "]";
	}
}