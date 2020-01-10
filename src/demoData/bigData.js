import { TASK_TYPES } from "../main/constants";
import {
  getNextUnit,
  getDate,
  getFormattedDate,
  getDuration
} from "../main/helpers/DateManager";

const getRandom = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (+max - +min) + +min);
};

const getTasks = () => {
  const tasks = [];
  let curDate = getDate("2020-01-01");

  try {
    for (let idx = 0; idx < 1000; idx++) {
      let startDate = getFormattedDate(curDate, "YYYY-MM-DD");
      let endDate = getNextUnit(curDate, "day", 100);
      let _endDate = getFormattedDate(endDate, "YYYY-MM-DD");

      tasks.push({
        id: idx + 1,
        name: `Task#${idx + 1}`,
        percentDone: getRandom(0, 100),
        type: idx === 0 ? "parent" : TASK_TYPES[getRandom(1, 3)],
        parent: idx === 0 ? null : 1,
        startDate,
        endDate: _endDate
      });

      curDate = getDate(startDate);
    }
  } catch (e) {
    console.log(e);
  }

  return tasks;
};

const getPositionMap = ({ tasks, config }) => {
  const positionMap = {};

  tasks.forEach(task => {
    positionMap[task.id] = {
      width: getDuration(task.startDate, task.endDate) * 50,
      left: getDuration("2019-01-01", task.startDate) * 50
    };
  });

  return positionMap;
};

export default ({ config }) => {
  const taskData = getTasks();

  const startDate = taskData[0].startDate;
  const endDate = taskData[taskData.length - 1].endDate;

  return {
    taskPositionMap: getPositionMap({
      tasks: taskData,
      config
    }),
    taskData,
    startDate,
    endDate
  };
};
