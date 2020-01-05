import Name from "./Name";
import Column from "./Column";
import Percent from "./Percent";
import { COLUMN_TYPES } from "../../constants";

const { NAME, PERCENT } = COLUMN_TYPES;

export default columns => {
  return columns.map(column => {
    switch (column.type) {
      case NAME: {
        return new Name(column);
      }
      case PERCENT: {
        return new Percent(column);
      }
      default: {
        return new Column(column);
      }
    }
  });
};
