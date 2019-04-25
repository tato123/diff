export class SelectionBox extends HTMLElement {
  private $shadow;

  constructor() {
    super();
    this.$shadow = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.$shadow.innerHTML = this.render();
  }
  disconnectedCallback() {}

  render() {
    return `
        ${this.styles()}
        <div>hello world</div>
    `;
  }

  styles() {
    return `
      <style>
        :host {
            background-color: blue;
        }
      </style>
    `;
  }
}

customElements.define("diff-selection", SelectionBox);
