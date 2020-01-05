import { html } from "lit-element";

export default class Column {
  constructor({ name, width = 100, type, label }) {
    this.name = name;
    this.label = label;
    this.width = width;
    this.type = type;
  }

  render(taskNode) {
    const task = taskNode.node;

    return html`
      <div class="grid__cell" style="width: ${this.width}px">
        ${task.get(this.name)}
      </div>
    `;
  }
}
