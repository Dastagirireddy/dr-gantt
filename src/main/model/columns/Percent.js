import Column from "./Column";
import { html } from "lit-element";

export default class Percent extends Column {
  constructor(column) {
    super(column);
  }

  render(taskNode) {
    return html`
      <div class="grid__cell" style="width: ${this.width}px">
        <div class="grid__cell__percent">
          <div
            class="grid__cell__progress"
            style="width: ${taskNode.get("percentDone")}%;"
          ></div>
        </div>
      </div>
    `;
  }
}
