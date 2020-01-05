import Node from "./Node";

export default class Tree {
  constructor(tasks = []) {
    this.head = new Node(null);
    this.head.$expanded = true;
    this.nodeList = {};

    tasks.forEach(task => {
      const node = new Node(task);

      this.nodeList[node.get("id")] = node;
    });

    this.buildTree(tasks);
  }

  getTask(id) {
    return this.nodeList[id];
  }

  buildTree(tasks) {
    tasks.forEach(task => {
      const node = this.getTask(task.id);

      if (node.get("parent") === null) {
        this.head.add(node);
      } else {
        const parent = this.getTask(node.get("parent"));

        parent.add(node);
      }
    });
  }

  getFlatList() {
    const list = [];
    let counter = 0;

    const buildFlatList = currentNode => {
      for (let idx = 0; idx < currentNode.children.length; idx++) {
        if (currentNode.$expanded) {
          const node = currentNode.children[idx];

          node.$index = counter;
          node.$level = node.getLevel();

          list.push(node);

          counter++;
          buildFlatList(currentNode.children[idx]);
        }
      }
    };

    buildFlatList(this.head);

    return list;
  }
}
