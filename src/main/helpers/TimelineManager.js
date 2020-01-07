import { getDate, getFormattedDate, getNextUnit } from "./DateManager";

export const getScaleData = (start, end) => {
  const startDate = getDate(start);
  const endDate = getDate(end).getTime();
  let curDate = startDate;
  const result = [];
  let prevMonth = "";
  let curMonth = curDate.getMonth();
  const months = [];
  let bottomCounterInTop = 0;
  let days = [];

  while (curDate.getTime() < endDate) {
    curMonth = curDate.getMonth();

    if (prevMonth !== curMonth) {
      prevMonth = curMonth;

      months.push({
        label: getFormattedDate(curDate, "MMMM, YYYY"),
        index: months.length
      });

      bottomCounterInTop = 0;
    }

    bottomCounterInTop++;

    days.push({
      label: getFormattedDate(curDate, "DD"),
      index: days.length
    });

    curDate = getNextUnit(curDate);

    months[curMonth].width = bottomCounterInTop * 50;
  }

  return {
    top: Object.values(months),
    bottom: days
  };
};
