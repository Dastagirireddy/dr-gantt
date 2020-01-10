let format = "YYYY-MM-DD HH:mm:ss";
const formatMap = {
  YYYY: 0,
  MM: 1,
  DD: 2,
  HH: 3,
  mm: 4,
  ss: 5
};
let formatTokens = [];

let monthFullNames = {
  0: "January",
  1: "Febraury",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};

const getFormatTokens = (f, excludeChar = true) => {
  let str = "";
  const arr = f.split("");
  const result = [];

  arr.forEach(a => {
    if (a.match(/[A-Za-z]/)) {
      str += a;
    } else {
      result.push(str);

      if (!excludeChar) {
        result.push(a);
      }

      str = "";
    }
  });

  result.push(str);

  return result;
};

const configureFormat = f => {
  format = f;

  formatTokens = getFormatTokens(f);
};

configureFormat("DD/MM/YYYY HH:mm:ss");

const getDateTokens = d => {
  let str = "";
  const arr = d.split("");
  const result = new Array(formatTokens.length).fill(null);
  let counter = 0;

  arr.forEach(a => {
    if (!isNaN(parseInt(a))) {
      str += a;
    } else {
      if (str) {
        result[formatMap[formatTokens[counter]]] = str;
        str = "";
        counter++;
      } else {
        return;
      }
    }
  });

  if (str) {
    result[formatMap[formatTokens[counter]]] = str;
  }

  result[1] = result[1] - 1;

  return result;
};

const getDate = d => {
  return new Date(...getDateTokens(d));
};

const padStr = val => {
  return val < 10 ? "0" + val : val;
};

const getFormattedDate = (date, fr) => {
  const tokens = getFormatTokens(fr, false);

  const result = tokens.map(token => {
    switch (token) {
      case "YYYY": {
        return date.getFullYear();
      }
      case "MMMM": {
        return monthFullNames[date.getMonth()];
      }
      case "MM": {
        return padStr(date.getMonth() + 1);
      }
      case "DD": {
        return padStr(date.getDate());
      }
      case "HH": {
        return padStr(date.getHours());
      }
      case "mm": {
        return padStr(date.getMinutes());
      }
      case "ss": {
        return padStr(date.getSeconds());
      }
      default: {
        return token;
      }
    }
  });

  return result
    .join("")
    .replace(/{/g, "")
    .replace(/}/g, "");
};

const getNextUnit = (date, unit = "day", count = 1) => {
  switch (unit) {
    case "day": {
      return new Date(date.setDate(date.getDate() + count));
    }
    case "month": {
      return new Date(date.setMonth(date.getMonth() + count));
    }
    case "year": {
      return new Date(date.setFullYear(date.getFullYear() + count));
    }
  }
};

const getDiff = (start, end) => {
  return Math.abs(getDate(start).getTime() - getDate(end).getTime());
};

const getDuration = (start, end, unit = "day") => {
  switch (unit) {
    case "day": {
      return getDiff(start, end) / (1000 * 60 * 60 * 24);
    }
  }
};

export { configureFormat, getDate, getFormattedDate, getNextUnit, getDuration };
