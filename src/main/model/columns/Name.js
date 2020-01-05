import Column from "./Column";
import { html } from "lit-element";
import {
  HEIRARCHY_PADDING,
  ICON_TYPES,
  CELL_EXPAND_OR_COLLAPSE
} from "../../constants";
import getIcon from "../../helpers/IconManager";

const { ARROW_DOWN, ARROW_RIGHT, DOT } = ICON_TYPES;

export default class Name extends Column {
  constructor(column) {
    super(column);
  }

  onClick(event, taskNode) {
    const ev = new CustomEvent(CELL_EXPAND_OR_COLLAPSE, {
      detail: taskNode
    });

    event.target.getRootNode().dispatchEvent(ev);
  }

  render(taskNode) {
    return html`
      <div class="grid__cell" style="width: ${this.width}px">
        <div
          class="grid__cell__inner"
          style="padding-left: ${taskNode.$level * HEIRARCHY_PADDING}px"
        >
          <span
            class="grid__cell__icon${taskNode.length === 0 ? " leaf" : ""}"
            @click="${taskNode.length === 0
              ? null
              : e => this.onClick(e, taskNode)}"
            tabindex="${taskNode.length === 0 ? -1 : 0}"
          >
            ${taskNode.get("type") !== "parent"
              ? getIcon(DOT)
              : !taskNode.$expanded
              ? getIcon(ARROW_RIGHT)
              : getIcon(ARROW_DOWN)}
          </span>
          ${taskNode.get(this.name)}
        </div>
      </div>
    `;
  }
}
