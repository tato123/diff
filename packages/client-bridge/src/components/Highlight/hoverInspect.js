import _ from "lodash-es";
import template from "./template.html";

export default class Inspector {
  static Modes = {
    ALL: "all",
    TARGET: "target"
  };

  constructor(target, options = {}) {
    this.$target = target || document.body;
    this.$cacheEl = document.body;
    this.$cacheElMain = document.body;

    this.serializer = new XMLSerializer();
    this.forbidden = [this.$cacheEl, document.body, document.documentElement];

    this.options = Object.assign(
      {},
      {
        colors: {
          margin: "rgba(255,165,0,0.5)",
          padding: "rgba(158,113,221,0.5)",
          content: "rgba(73,187,231,0.25)",
          transparent: "rgba(0, 0, 0, 0)",
          modal: "rgba(0, 0, 0, 0.4)",
          outline: "#EF3B7B"
        },
        mode: Inspector.Modes.ALL
      },
      options
    );
  }

  state = {
    width: 0,
    height: 0,
    ctx: null
  };

  getNodes = () => {
    this.template = template;
    this.createNodes();
    this.registerEvents();
  };

  createNodes = () => {
    this.$host = document.createElement("div");
    this.$host.className = "tl-host";
    this.$host.style.cssText = "all: initial;";

    const shadow = this.$host.createShadowRoot();
    document.body.appendChild(this.$host);

    const templateMarkup = document.createElement("div");
    templateMarkup.innerHTML = this.template;
    shadow.innerHTML = templateMarkup.querySelector("template").innerHTML;

    this.$wrap = shadow.querySelector(".tl-wrap");

    this.$canvas = shadow.querySelector("#tl-canvas");
    this.$canvas.width = window.innerWidth;
    this.$canvas.height = window.innerHeight;

    this.state = {
      width: this.$canvas.width,
      height: this.$canvas.height,
      ctx: this.$canvas.getContext("2d")
    };
  };

  registerEvents() {
    if (this.options.mode === "all") {
      document.addEventListener("mousemove", this.handleMouseMove);
    }

    document.addEventListener("scroll", this.render);
    window.addEventListener("resize", () => {
      this.handleResize();
      this.render();
    });
  }

  handleMouseMove = e => {
    this.$target = e.target;

    // check if element cached
    if (this.forbidden.indexOf(this.$target) !== -1) return;

    this.$cacheEl = this.$target;
    this.render();
  };

  fixNegatives = input => {
    const box = _.clone(input);

    // pluck negatives
    ["margin", "padding"].forEach(property => {
      Object.keys(box[property]).forEach(el => {
        const val = parseInt(box[property][el], 10);
        box[property][el] = Math.max(0, val);
      });
    });

    return box;
  };

  renderAll = (ctx, box) => {
    // margin
    const margin = {
      x: box.left - box.margin.left,
      y: box.top - box.margin.top,
      w: box.width + box.margin.left + box.margin.right,
      h: box.height + box.margin.top + box.margin.bottom
    };

    ctx.fillStyle = this.options.colors.margin;
    ctx.fillRect(margin.x, margin.y, margin.w, margin.h);

    // padding
    const padding = {
      x: box.left,
      y: box.top,
      w: box.width,
      h: box.height
    };

    ctx.fillStyle = this.options.colors.padding;
    ctx.clearRect(padding.x, padding.y, padding.w, padding.h);
    ctx.fillRect(padding.x, padding.y, padding.w, padding.h);

    // content
    const content = {
      x: box.left + box.padding.left,
      y: box.top + box.padding.top,
      w: box.width - box.padding.right - box.padding.left,
      h: box.height - box.padding.bottom - box.padding.top
    };

    ctx.fillStyle = this.options.colors.content;
    ctx.clearRect(content.x, content.y, content.w, content.h);
    ctx.fillRect(content.x, content.y, content.w, content.h);
  };

  renderTarget = (ctx, box) => {
    // content
    const content = {
      x: box.left + box.padding.left,
      y: box.top + box.padding.top,
      w: box.width - box.padding.right - box.padding.left,
      h: box.height - box.padding.bottom - box.padding.top
    };

    ctx.strokeStyle = this.options.colors.outline;
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.clearRect(content.x, content.y, content.w, content.h);
    ctx.strokeRect(content.x, content.y, content.w, content.h);
  };

  // redraw overlay
  render = () => {
    const {
      state: { ctx, width, height }
    } = this;

    const rect = this.$target.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(this.$target);
    const box = this.fixNegatives({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      margin: {
        top: computedStyle.marginTop,
        right: computedStyle.marginRight,
        bottom: computedStyle.marginBottom,
        left: computedStyle.marginLeft
      },
      padding: {
        top: computedStyle.paddingTop,
        right: computedStyle.paddingRight,
        bottom: computedStyle.paddingBottom,
        left: computedStyle.paddingLeft
      }
    });

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle =
      this.options.mode === Inspector.Modes.ALL
        ? this.options.colors.transparent
        : this.options.colors.modal;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = "difference-out";

    if (this.options.mode === Inspector.Modes.TARGET) {
      this.renderTarget(ctx, box);
    } else {
      this.renderAll(ctx, box);
    }

    box.left = Math.floor(box.left) + 1.5;
    box.width = Math.floor(box.width) - 1;

    ctx.restore();
  };

  handleResize = () => {
    this.$canvas.width = window.innerWidth;
    this.$canvas.height = window.innerHeight;

    this.state = {
      ...this.state,
      width: this.$canvas.width,
      height: this.$canvas.height
    };
  };

  activate = () => {
    this.getNodes();
    this.render();
  };

  deactivate() {
    this.$wrap.classList.add("-out");
    if (this.options.mode === "all") {
      document.removeEventListener("mousemove", this.handleMouseMove);
    }
    setTimeout(() => {
      try {
        document.body.removeChild(this.$host);
      } catch (error) {
        console.warn("Error occured removing element", error.message);
      }
    }, 600);
  }
}
