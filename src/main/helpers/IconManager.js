import { ICON_TYPES } from "../constants";
import { html } from "lit-element";

const { ARROW_DOWN, ARROW_RIGHT } = ICON_TYPES;

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
    case ARROW_DOWN: {
      return getDownArrow();
    }
    case ARROW_RIGHT: {
      return getRightArrow();
    }
    default: {
      return getCircle();
    }
  }
};

export default getIcon;
