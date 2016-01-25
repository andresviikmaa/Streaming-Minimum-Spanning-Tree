package diskmat;

public class Node {
	private final int id;

	private int dmin;
	private int dcost;

	// tree pointers
	private Node parent;
	private Node left;
	private Node right;

	public Node(int id) {
		this.id = id;
	}

	public Node getRealParent() {
		return hasPathParent() ? null : parent;
	}
	public Node getPathParent() {
		return hasPathParent() ? parent : null;
	}
	public void setPathParent(Node parent) {
		this.parent = parent;
	}
	public boolean hasPathParent() { // Is not a real child of parent
		return parent != null
				&& parent.getLeft() != this
				&& parent.getRight() != this;
	}

	public Node getLeft() {
		return left;
	}
	public void setLeft(Node left) {
		this.left = left;
		if (left != null) {
			left.parent = this;
		}
	}
	public boolean hasLeft() {
		return left != null;
	}
	public void removeLeft() {
		if (left != null) {
			left.parent = null;
			left = null;
		}
	}
	public void pathLinkLeft() {
		left = null;
	}

	public Node getRight() {
		return right;
	}
	public boolean hasRight() {
		return right != null;
	}
	public void setRight(Node right) {
		this.right = right;
		if (right != null) {
			right.parent = this;
		}
	}
	public void removeRight() {
		if (right != null) {
			right.parent = null;
			right = null;
		}
	}
	public void pathLinkRight() {
		right = null;
	}

	@Override
	public boolean equals(Object obj) {
		return obj != null && id == ((Node)obj).id;
	}

	public boolean isAuxRoot() {
		return parent == null || hasPathParent();
	}

	@Override
	public String toString() {
		return "Node [id=" + id 
					+ ", dmin=" + dmin 
					+ ", dcost=" + dcost 
					+ (parent == null ? "" : ", parent=" + parent.id) 
					+ (left == null ? "" : ", left=" + left.id)
					+ (right == null ? "" : ", right=" + right.id) 
					+ "]";
	}
}