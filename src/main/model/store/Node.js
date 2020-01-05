export default class Node {
  constructor(data) {
    this.data = data;
    this.length = 0;
    this.children = [];
    this.parent = null;
  }

  set(key, value) {
    return !!(this.data[key] = value);
  }

  get(key) {
    return this.data[key];
  }

  add(child) {
    const node = child instanceof Node ? child : new Node(child);

    node.parent = this;
    this.children.push(node);
    this.length++;

    return this.length;
  }

  remove(id) {
    const idx = this.findIndex(id);
    const removedItems = [];

    if (idx > -1) {
      const removedItem = this.children[idx];

      this.children.splice(idx, 1);
      this.length--;

      removedItems.push(removedItem);
    }

    return removedItems;
  }

  findIndex(id) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id === id) {
        return i;
      }
    }

    return -1;
  }

  getPath() {
    let current = this;
    let path = [];

    while (current && current.parent) {
      path.push(current.get("id"));
      current = current.parent;
    }

    return path;
  }

  getLevel() {
    return this.getPath().length - 1;
  }
}
