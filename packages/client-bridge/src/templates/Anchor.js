export default (name, innerHtml) => {
  return `      
    customElements.define("${name}", class CustomAnchor extends HTMLAnchorElement {
        connectedCallback() {
            this.innerHTML = '${innerHtml}'
        }
    }, { extends: "a" });`;
};

