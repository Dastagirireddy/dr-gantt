export default Object.freeze({
  top: [
    {
      label: "Jan 2020",
      width: 31 * 50,
      index: 0
    },
    {
      label: "Feb 2020",
      width: 29 * 50,
      index: 1
    },
    {
      label: "Mar 2020",
      width: 31 * 50,
      index: 2
    }
  ],
  bottom: (function() {
    const result = [];
    let counter = 0;

    // Jan
    for (let i = 1; i <= 31; i++) {
      result.push({
        label: i,
        index: counter
      });

      counter++;
    }

    // Feb
    for (let i = 1; i <= 29; i++) {
      result.push({
        label: i,
        index: counter
      });

      counter++;
    }

    // Mar
    for (let i = 0; i <= 31; i++) {
      result.push({
        label: i,
        index: counter
      });

      counter++;
    }

    return result;
  })()
});
