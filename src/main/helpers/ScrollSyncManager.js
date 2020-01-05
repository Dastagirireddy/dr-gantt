export default class ScrollSyncManager {
  constructor(elements) {
    this.elements = elements;
    this.init();
  }

  init() {
    const self = this;
    let timeout;

    this.elements.forEach(sync => {
      sync.addEventListener("scroll", function callback(event) {
        clearTimeout(timeout);

        const source = event.target;
        let targets;

        if (event.target === self.elements[0]) {
          targets = self.elements.slice(1);
        } else if (event.target === self.elements[1]) {
          targets = [self.elements[0], self.elements[2]];
        } else {
          targets = self.elements.slice(0, 2);
        }

        targets.forEach(target => {
          target.removeEventListener("scroll", callback);
          target.scrollLeft = source.scrollLeft;
        });

        timeout = setTimeout(() => {
          targets.forEach(target => {
            target.addEventListener("scroll", callback);
          });
        }, 100);
      });
    });
  }
}
