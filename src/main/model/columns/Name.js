import Column from "./Column";
import { html } from "lit-element";
import { HEIRARCHY_PADDING } from "../../constants";

const getRightArrow = () => {
  return html`
    <svg height="8" width="8">
      <polygon points="0,0,0,8,8,4" style="fill:black;"></polygon>
      Sorry, your browser does not support inline SVG.
    </svg>
  `;
};

const getDownArrow = () => {
  return html`
    <svg height="8" width="8">
      <polygon points="0,0,4,8,8,0" style="fill:black;" />
      Sorry, your browser does not support inline SVG.
    </svg>
  `;
};

const getCircle = () => {
  return html`
    <svg height="10" width="10">
      <circle cx="4" cy="4" r="3" fill="black" />
      Sorry, your browser does not support inline SVG.
    </svg>
  `;
};

const getIcon = icon => {
  switch (icon) {
    case "down": {
      return getDownArrow();
    }
    case "right": {
      return getRightArrow();
    }
    default: {
      return getCircle();
    }
  }
};

export default class Name extends Column {
  constructor(column) {
    super(column);
  }

  render(taskNode) {
    const task = taskNode.node;

    return html`
      <div class="grid__cell" style="width: ${this.width}px">
        <div
          style="width: 100%;height: 100%;display: flex; align-items: center; padding-left: ${taskNode.$level *
            HEIRARCHY_PADDING}px"
        >
          <span style="display: flex; width: 10px;margin-right: 3px">
            ${task.get("type") === "task" || !task.expanded
              ? getIcon("right")
              : getIcon("down")}
          </span>
          ${task.get(this.name)}
        </div>
      </div>
    `;
  }
}
