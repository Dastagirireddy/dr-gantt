import { OVERSCAN_COUNT } from "../constants";

const isForward = (oldVal, newVal) => {
  return newVal > oldVal;
};

const getBottom = (visibleArea, newScroll) => {
  return visibleArea + newScroll;
};

const getPosition = (visibleArea, unitWidth) => {
  return Math.ceil(visibleArea / unitWidth);
};

export const getEndPosition = ({ visibleArea, newScroll, unitWidth }) => {
  return getPosition(getBottom(visibleArea, newScroll), unitWidth);
};

export const getScrollWindow = ({
  oldScroll,
  newScroll,
  unitWidth,
  visibleArea,
  totalCount
}) => {
  const hasForward = isForward(oldScroll, newScroll);

  let start = Math.floor(oldScroll / unitWidth);
  let end = getEndPosition({
    visibleArea,
    newScroll,
    unitWidth
  });

  if (hasForward) {
    end += OVERSCAN_COUNT;
  } else {
    start -= OVERSCAN_COUNT;
  }

  start = start < 0 ? 0 : start;
  end = end > totalCount ? totalCount : end;

  return {
    start,
    end
  };
};
