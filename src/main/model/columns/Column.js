import { html } from "lit-element";

export default class Column {
  constructor({ name, width = 100, type, label }) {
    this.name = name;
    this.label = label;
    this.width = width;
    this.type = type;
  }

  render(taskNode) {
    return html`
      <div class="grid__cell" style="width: ${this.width}px">
        ${taskNode.get(this.name)}
      </div>
    `;
  }
}
