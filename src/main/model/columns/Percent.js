import Column from "./Column";
import { html } from "lit-element";

export default class Percent extends Column {
  constructor(column) {
    super(column);
  }

  render(taskNode) {
    const task = taskNode.node;

    return html`
      <div class="grid__cell" style="width: ${this.width}px">
        <div
          style="background-color: #FAFAFA; width: 100%;height: 10px;display: flex;position: relative"
        >
          <div
            style="width: ${task.get(
              "percentDone"
            )}%;position:absolute;background-color: #0091EA;height: 100%"
          ></div>
        </div>
      </div>
    `;
  }
}
