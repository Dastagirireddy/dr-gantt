import { html, LitElement } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";
import Styles from "./styles.scss";
import { repeat } from "lit-html/directives/repeat";
import scaleData from "../demoData/scaleData";
import taskData from "../demoData/taskData";
import config from "../demoData/config";
import taskPositionMap from "../demoData/taskPositionMap";
import columns from "../demoData/columns";
import { getScrollWindow, getEndPosition } from "./helpers/WindowManager";
import {
  OVERSCAN_COUNT,
  TIMELINE_SYNC_ELEMENTS,
  GRID_SYNC_ELEMENTS
} from "./constants";
import ScrollSyncManager from "./helpers/ScrollSyncManager";
import {
  getVisibleHeight,
  getVisibleWidth,
  querySelectorAll
} from "./helpers/ElementManager";
import getColumns from "./model/columns";
import Tree from "./model/store/Tree";

class GanttElement extends LitElement {
  static get styles() {
    return [Styles];
  }

  static get properties() {
    return {
      scaleData: {
        type: Array
      },
      scrollLeft: {
        type: Number
      },
      visibleWidth: {
        type: Number
      },
      scrollTop: {
        type: Number
      },
      visibleHeight: {
        type: Number
      },
      taskData: {
        type: Array
      },
      columns: {
        type: Array
      }
    };
  }

  constructor() {
    super();

    this.config = config;
    this.scaleData = {
      top: [],
      bottom: []
    };
    this.timelineSync = [];
    this.scaleHeight = 25;
    this.bottomScaleWidth = 50;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.visibleWidth = 0;
    this.totalHeight = taskData.length * this.config.rowHeight;
    this.taskPositionMap = taskPositionMap;
    this.taskData = [];
    this.columns = getColumns(columns);
    this.maxGridWidth = this.getMaxColumnsWidth();

    const tree = new Tree(taskData);

    this.flatList = tree.getFlatList();
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

  get timelineHeaderTemplate() {
    return html`
      <section class="flexible-container hide-scroll" id="timeline-header">
        <div
          class="scroll-area scale-area"
          style=${styleMap(this.hScrollAreaStyles)}
        >
          <div class="scale" style="height: ${this.scaleHeight}px">
            ${repeat(
              this.scaleData.top,
              item => item.index,
              scale => {
                return html`
                  <div
                    class="scale__cell"
                    style="min-width: ${scale.width}px;width: ${scale.width}px; transform: translate(${scale.index *
                      scale.width}px, 0px)"
                  >
                    ${scale.label}
                  </div>
                `;
              }
            )}
          </div>
          <div class="scale" style="height: ${this.scaleHeight}px">
            ${repeat(
              this.scaleData.bottom,
              item => item.index,
              scale => {
                return html`
                  <div
                    class="scale__cell"
                    style="min-width: ${this.bottomScaleWidth}px;width: ${this
                      .bottomScaleWidth}px; transform: translate(${scale.index *
                      this.bottomScaleWidth}px, 0px)"
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
        class="fixed-container grid-body"
        style="width: ${this.config.gridWidth}px; min-width: ${this.config
          .gridWidth}px; height: ${this.totalHeight}px"
        id="grid-body"
      >
        <div class="grid-inner-scroller" style="width: ${this.maxGridWidth}px">
          ${repeat(
            this.taskData,
            item => item.node.get("id"),
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
            style="height: ${this.totalHeight}px"
            class="body-main-container"
            $
            id="timeline-body"
          >
            <div class="body-main-wrapper" style=${styleMap(
              this.hScrollAreaStyles
            )}>
              <div
                class="scroll-area timeline-body"
                style=${styleMap(this.hScrollAreaStyles)}
              >
                <div class="area__bars timeline-layer">
                  ${repeat(
                    this.taskData,
                    item => item.node.get("id"),
                    taskNode => {
                      const task = taskNode.node;
                      const position = this.taskPositionMap[task.get("id")];

                      return html`
                        <div
                          class="timeline__row"
                          style="transform: translate(0px, ${taskNode.$index *
                            this.config.rowHeight}px); height: ${this.config
                            .rowHeight}px"
                          data-index="${task.get("id")}"
                        >
                          <div
                            class="task__container"
                            style=${styleMap({
                              height: "24px",
                              transform: `translateX(${position.left}px)`,
                              width: `${position.width}px`
                            })}
                          >
                            <div class="task__wrapper">
                              <div
                                class="task${task.get("type") === "parent"
                                  ? " task__parent"
                                  : ""}${task.get("type") === "milestone"
                                  ? " task__milestone"
                                  : ""}"
                              >
                                <div
                                  class="task__progress"
                                  style="width: ${task.get("percentDone")}%"
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
            style="width: ${this.maxGridWidth}px;min-width: ${this
              .maxGridWidth}px;"
          ></div>
        </section>
        <section class="flexible-container" id="timeline-virtual-scroller">
          <div
            class="scroll-area"
            style=${styleMap(this.hScrollAreaStyles)}
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
          ${this.virtualScrollTemplate}
        </section>
      </section>
    `;
  }

  render() {
    return html`
      <div class="container">
        ${this.headerTemplate} ${this.bodyTemplate}
      </div>
    `;
  }

  handleScroll(e) {
    console.log("sasd");
  }

  getMaxColumnsWidth() {
    return this.columns.reduce((sum, column) => {
      sum += column.width;

      return sum;
    }, 0);
  }

  handleVerticalScroll(e) {
    const indices = getScrollWindow({
      oldScroll: this.scrollTop,
      newScroll: e.target.scrollTop,
      visibleArea: this.visibleHeight,
      totalCount: this.flatList.length,
      unitWidth: this.config.rowHeight
    });

    this.scrollTop = e.target.scrollTop;
    this.taskData = this.flatList.slice(indices.start, indices.end);
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
    this.visibleHeight = getVisibleHeight(this.shadowRoot, ".body-container");
    this.visibleWidth = getVisibleWidth(
      this.shadowRoot,
      timelineSyncElements[0]
    );

    // Calculate timescale data
    this.scaleData = scaleData;

    // Total width of timeline
    this.totalWidth = scaleData.bottom.length * this.bottomScaleWidth;
    this.hScrollAreaStyles = {
      width: `${this.totalWidth}px`,
      minWidth: `${this.totalWidth}px`
    };
    console.log(this.flatList);

    // Viewport task list
    this.taskData = this.flatList.slice(
      0,
      getEndPosition({
        visibleArea: this.visibleHeight,
        newScroll: this.scrollTop,
        unitWidth: this.config.rowHeight
      }) + OVERSCAN_COUNT
    );
  }
}

window.customElements.define("dr-gantt", GanttElement);
