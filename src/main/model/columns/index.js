import Name from "./Name";
import Column from "./Column";
import Percent from "./Percent";

export default columns => {
  return columns.map(column => {
    switch (column.type) {
      case "name": {
        return new Name(column);
      }
      case "percent": {
        return new Percent(column);
      }
      default: {
        return new Column(column);
      }
    }
  });
};
