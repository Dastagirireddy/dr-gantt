import { getDate, getFormattedDate, getNextUnit } from "./DateManager";

export const getScaleData = (start, end) => {
  const startDate = getDate(start);
  const endDate = getDate(end).getTime();
  let curDate = startDate;
  let prevMonth = "";
  let curMonth = curDate.getMonth();
  const months = {};
  let bottomCounterInTop = 0;
  let monthsCounter = 0;
  let days = [];

  while (curDate.getTime() < endDate) {
    curMonth = curDate.getMonth();

    if (prevMonth !== curMonth) {
      prevMonth = curMonth;

      months[`${curDate.getFullYear()} - ${curDate.getMonth()}`] = {
        label: getFormattedDate(curDate, "MMMM, YYYY"),
        index: monthsCounter
      };

      monthsCounter++;

      bottomCounterInTop = 0;
    }

    bottomCounterInTop++;

    days.push({
      label: getFormattedDate(curDate, "DD"),
      index: days.length
    });

    months[`${curDate.getFullYear()} - ${curDate.getMonth()}`].width =
      bottomCounterInTop * 50;

    curDate = getNextUnit(curDate);
  }

  return {
    top: Object.values(months),
    bottom: days
  };
};
