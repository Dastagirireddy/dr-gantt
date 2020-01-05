export const querySelector = (shadowRoot, selector) => {
  return shadowRoot.querySelector(selector);
};

export const querySelectorAll = (shadowRoot, selectors) => {
  return selectors.map(selector => querySelector(shadowRoot, selector));
};

export const getAvaiableHeight = (shadowRoot, selector) => {
  return querySelector(shadowRoot, selector).getBoundingClientRect().height;
};

export const getAvailableWidth = (shadowRoot, selector) => {
  if (selector instanceof HTMLElement) {
    return selector.getBoundingClientRect().width;
  }

  return querySelector(shadowRoot, selector).getBoundingClientRect().width;
};
