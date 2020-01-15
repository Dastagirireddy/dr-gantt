import { html, LitElement } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";
import Styles from "./styles/index.scss";
import { repeat } from "lit-html/directives/repeat";
import config from "../demoData/config";
import columns from "../demoData/columns";
import { getScrollWindow, getEndPosition } from "./helpers/WindowManager";
import {
  OVERSCAN_COUNT,
  TIMELINE_SYNC_ELEMENTS,
  GRID_SYNC_ELEMENTS,
  CELL_EXPAND_OR_COLLAPSE
} from "./constants";
import ScrollSyncManager from "./helpers/ScrollSyncManager";
import {
  getAvaiableHeight,
  getAvailableWidth,
  querySelectorAll
} from "./helpers/ElementManager";
import getColumns from "./model/columns";
import Tree from "./model/store/Tree";
import { getScaleData } from "./helpers/TimelineManager";
import { configureFormat } from "./helpers/DateManager";
import getTasksAndPositionMap from "../demoData/bigData";

class GanttElement extends LitElement {
  static get styles() {
    return [Styles];
  }

  static get properties() {
    return {
      config: {
        type: Object
      },
      columns: {
        type: Array
      },
      scaleData: {
        type: Object
      },
      viewportScaleData: {
        type: Object
      },
      scrollLeft: {
        type: Number
      },
      scrollTop: {
        type: Number
      },
      availableHeight: {
        type: Number
      },
      availableWidth: {
        type: Number
      },
      viewportTasks: {
        type: Array
      },
      flatList: {
        type: Array
      },
      totalColumnsWidth: {
        type: Number
      },
      totalTimelineWidth: {
        type: Number
      },
      totalBodyHeight: {
        type: Number
      },
      maxTopScaleWidth: {
        type: Number
      }
    };
  }

  constructor() {
    super();

    this.config = config;
    this.viewportScaleData = {
      top: [],
      bottom: []
    };
    this.bottomScaleWidth = 50;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.availableWidth = 0;
    this.availableHeight = 0;
    this.totalTimelineWidth = 0;
    this.totalBodyHeight = 0;
    this.viewportTasks = [];
    this.columns = getColumns(columns);
    this.taskPositionMap = {};
    //this.taskPositionMap = taskPositionMap;
    this.scaleData = [];
    this.totalColumnsWidth = this.getTotalColumnsWidth();
    this.tree = null;
  }

  get gridHeaderTemplate() {
    return html`
      <section
        class="fixed-container grid-header hide-scroll"
        style="width: ${this.config.gridWidth}px; min-width: ${this.config
          .gridWidth}px"
        id="grid-header"
      >
        <div class="grid-inner-scroller">
          ${repeat(
            this.columns,
            column => column.name,
            column => {
              return html`
                <div class="grid__cell" style="width: ${column.width}px">
                  ${column.label}
                </div>
              `;
            }
          )}
        </div>
      </section>
    `;
  }

  get topScaleTemplate() {
    const scaleHeight = this.config.headerHeight / 2;
    let awayFromYAxix = 0;

    if (this.viewportScaleData.top.length > 0) {
      const index = this.viewportScaleData.top[0].index;

      for (let idx = 0; idx < index; idx++) {
        awayFromYAxix += this.scaleData.top[idx].width;
      }
    }

    return html`
      <div
        class="scale"
        style="height: ${scaleHeight}px; line-height: ${scaleHeight}px"
      >
        ${repeat(
          this.viewportScaleData.top,
          item => item.index,
          scale => {
            const template = html`
              <div
                class="scale__cell"
                style="min-width: ${scale.width}px;width: ${scale.width}px; transform: translate(${awayFromYAxix}px, 0px);"
                data-index="${scale.index}"
              >
                ${scale.label}
              </div>
            `;

            awayFromYAxix += scale.width;

            return template;
          }
        )}
      </div>
    `;
  }

  get timelineHeaderTemplate() {
    const scaleHeight = this.config.headerHeight / 2;

    return html`
      <section
        class="flexible-container hide-scroll"
        id="timeline-header"
        @scroll="${this.handleTimelineHorizontalScroll}"
      >
        <div
          class="scroll-area scale-area"
          style=${styleMap(this.timelineWidthStyles)}
        >
          ${this.topScaleTemplate}
          <div
            class="scale"
            style="height: ${scaleHeight}px; line-height: ${scaleHeight}px"
          >
            ${repeat(
              this.viewportScaleData.bottom,
              item => item.index,
              scale => {
                return html`
                  <div
                    class="scale__cell"
                    style="min-width: ${this.bottomScaleWidth}px;width: ${this
                      .bottomScaleWidth}px; transform: translate(${scale.index *
                      this.bottomScaleWidth}px, 0px)"
                    data-index="${scale.index}"
                  >
                    ${scale.label}
                  </div>
                `;
              }
            )}
          </div>
        </div>
      </section>
    `;
  }

  get headerTemplate() {
    return html`
      <header
        class="header grid"
        style="height: ${this.config.headerHeight}px; min-height: ${this.config
          .headerHeight}px"
      >
        ${this.gridHeaderTemplate} ${this.timelineHeaderTemplate}
      </header>
    `;
  }

  get gridBodyTemplate() {
    return html`
      <section
        class="fixed-container grid-body hide-scroll"
        style="width: ${this.config.gridWidth}px; min-width: ${this.config
          .gridWidth}px; height: ${this.totalBodyHeight}px"
        id="grid-body"
      >
        <div
          class="grid-inner-scroller"
          style="width: ${this.totalColumnsWidth}px"
        >
          ${repeat(
            this.viewportTasks,
            item => item.get("id"),
            taskNode => {
              return html`
                <div
                  class="grid__row"
                  style="transform: translate(0px, ${taskNode.$index *
                    this.config.rowHeight}px); height: ${this.config
                    .rowHeight}px"
                  data-index="${taskNode.$index}"
                >
                  ${repeat(
                    this.columns,
                    column => column.name,
                    column => column.render(taskNode)
                  )}
                </div>
              `;
            }
          )}
        </div>
      </section>
    `;
  }

  get timelineBodyTemplate() {
    return html`
      <section
            style="height: ${this.totalBodyHeight}px; background-size: 1px ${
      this.config.rowHeight
    }px; background-position: left 1px top ${this.config.rowHeight - 1}px"
            class="body-main-container hide-scroll"
            id="timeline-body"
            @scroll="${this.handleTimelineHorizontalScroll}"
          >
            <div class="body-main-wrapper" style=${styleMap(
              this.timelineWidthStyles
            )}>
              <div
                class="scroll-area timeline-body"
                style=${styleMap({
                  ...this.timelineWidthStyles,
                  backgroundSize: `${this.bottomScaleWidth}px 1px`,
                  backgroundPosition: `left ${this.bottomScaleWidth -
                    1}px top 1px`
                })}
              >
                <div class="area__bars timeline-layer">
                  ${repeat(
                    this.viewportTasks,
                    item => item.get("id"),
                    taskNode => {
                      const position = this.taskPositionMap[taskNode.get("id")];
                      const isMilestone = taskNode.get("type") === "milestone";

                      return html`
                        <div
                          class="timeline__row"
                          style="transform: translate(0px, ${taskNode.$index *
                            this.config.rowHeight}px); height: ${this.config
                            .rowHeight}px"
                          data-index="${taskNode.get("id")}"
                        >
                          <div
                            class="task__container"
                            style=${styleMap({
                              height: `${this.config.barHeight}px`,
                              transform: `translateX(${position.left}px)`,
                              width: `${
                                isMilestone
                                  ? this.config.barHeight
                                  : position.width
                              }px`
                            })}
                          >
                            <div class="task__wrapper">
                              <div
                                class="task${taskNode.get("type") === "parent"
                                  ? " task__parent"
                                  : ""}${isMilestone ? " task__milestone" : ""}"
                              >
                                <div
                                  class="task__progress"
                                  style="width: ${taskNode.get("percentDone")}%"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      `;
                    }
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
    `;
  }

  get virtualScrollTemplate() {
    return html`
      <footer class="grid virtual-scroll">
        <section
          class="fixed-container enable-scroll"
          style="width: ${this.config.gridWidth}px; min-width: ${this.config
            .gridWidth}px"
          id="grid-virtual-scroller"
        >
          <div
            class="scroll-area"
            style="width: ${this.totalColumnsWidth}px;min-width: ${this
              .totalColumnsWidth}px;"
          ></div>
        </section>
        <section class="flexible-container" id="timeline-virtual-scroller">
          <div
            class="scroll-area"
            style=${styleMap(this.timelineWidthStyles)}
          ></div>
        </section>
      </footer>
    `;
  }

  get bodyTemplate() {
    return html`
      <section class="body-container">
        <section class="inner-scroller" @scroll="${this.handleVerticalScroll}">
          ${this.gridBodyTemplate} ${this.timelineBodyTemplate}
        </section>
        ${this.virtualScrollTemplate}
      </section>
    `;
  }

  render() {
    return html`
      <div class="container">
        ${this.headerTemplate} ${this.bodyTemplate}
        <div class="x-resizer" style="left: ${this.config.gridWidth}px"></div>
      </div>
    `;
  }

  getTotalBodyHeight() {
    const bodyHeight = this.flatList.length * this.config.rowHeight;

    return bodyHeight < this.availableHeight
      ? this.availableHeight
      : bodyHeight;
  }

  getTotalTimelineWidth() {
    return this.scaleData.bottom.length * this.bottomScaleWidth;
  }

  getMaxTopScaleWidth() {
    const top = this.scaleData.top;
    let max = -Infinity;

    for (let idx = 0; idx < top.length; idx++) {
      if (top[idx].width > max) {
        max = top[idx].width;
      }
    }

    return max;
  }

  getTotalColumnsWidth() {
    const length = this.columns.length;
    let sum = 0;

    for (let idx = 0; idx < length; idx++) {
      sum += this.columns[idx].width;
    }

    return sum;
  }

  handleVerticalScroll(e) {
    const indices = getScrollWindow({
      oldScroll: this.scrollTop,
      newScroll: e.target.scrollTop,
      visibleArea: this.availableHeight,
      totalCount: this.flatList.length,
      unitWidth: this.config.rowHeight
    });

    this.scrollTop = e.target.scrollTop;
    this.viewportTasks = this.flatList.slice(indices.start, indices.end);
  }

  handleTimelineHorizontalScroll(e) {
    if (this.scrollLeft === e.target.scrollLeft) {
      return;
    }

    const topIndices = getScrollWindow({
      oldScroll: this.scrollLeft,
      newScroll: e.target.scrollLeft,
      visibleArea: this.availableWidth,
      totalCount: this.scaleData.top.length,
      unitWidth: this.maxTopScaleWidth
    });
    const bottomIndices = getScrollWindow({
      oldScroll: this.scrollLeft,
      newScroll: e.target.scrollLeft,
      visibleArea: this.availableWidth,
      totalCount: this.scaleData.bottom.length,
      unitWidth: this.bottomScaleWidth
    });

    this.scrollLeft = e.target.scrollLeft;
    this.viewportScaleData = {
      top: this.scaleData.top.slice(topIndices.start, topIndices.end),
      bottom: this.scaleData.bottom.slice(
        bottomIndices.start,
        bottomIndices.end
      )
    };
  }

  updateViewportTasks() {
    this.flatList = this.tree.getFlatList();

    this.viewportTasks = this.flatList.slice(
      0,
      getEndPosition({
        visibleArea: this.availableHeight,
        newScroll: this.scrollTop,
        unitWidth: this.config.rowHeight
      }) + OVERSCAN_COUNT
    );

    this.totalBodyHeight = this.getTotalBodyHeight();
  }

  firstUpdated() {
    const timelineSyncElements = querySelectorAll(
      this.shadowRoot,
      TIMELINE_SYNC_ELEMENTS
    );
    const gridSyncElements = querySelectorAll(
      this.shadowRoot,
      GRID_SYNC_ELEMENTS
    );

    // Enable scroll sync for grid and timeline
    new ScrollSyncManager(timelineSyncElements);
    new ScrollSyncManager(gridSyncElements);

    // Calculate available width of timeline and height of body container
    this.availableHeight = getAvaiableHeight(
      this.shadowRoot,
      ".body-container"
    );
    this.availableWidth = getAvailableWidth(
      this.shadowRoot,
      timelineSyncElements[0]
    );

    configureFormat(this.config.dateFormat);
    const myData = getTasksAndPositionMap({
      config: this.config
    });
    this.taskPositionMap = myData.taskPositionMap;
    this.tree = new Tree(myData.taskData);
    this.scaleData = getScaleData("2019-01-01", "2022-01-01");

    // Viewport task list
    this.updateViewportTasks();

    // Total width of timeline
    this.totalTimelineWidth = this.getTotalTimelineWidth();

    // Calculate timescale data
    this.maxTopScaleWidth = this.getMaxTopScaleWidth();
    this.viewportScaleData = {
      top: this.scaleData.top.slice(
        0,
        getEndPosition({
          visibleArea: this.availableWidth,
          newScroll: this.scrollLeft,
          unitWidth: this.maxTopScaleWidth
        }) + OVERSCAN_COUNT
      ),
      bottom: this.scaleData.bottom.slice(
        0,
        getEndPosition({
          visibleArea: this.availableWidth,
          newScroll: this.scrollLeft,
          unitWidth: this.bottomScaleWidth
        }) + OVERSCAN_COUNT
      )
    };

    this.timelineWidthStyles = {
      width: `${this.totalTimelineWidth}px`,
      minWidth: `${this.totalTimelineWidth}px`
    };

    this.shadowRoot.addEventListener(CELL_EXPAND_OR_COLLAPSE, event => {
      const taskNode = event.detail;

      taskNode.$expanded = !taskNode.$expanded;
      this.updateViewportTasks();
    });
  }
}

window.customElements.define("dr-gantt", GanttElement);
