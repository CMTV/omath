export class Tree<TNode>
{
    rootNode: TNode;
}

class TreeNode
{
    label: string;
    nodes: TreeNode[] = [];
}

class TOCTreeNode
{
}