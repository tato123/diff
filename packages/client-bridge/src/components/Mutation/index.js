import React from "react";
import finder from "@medv/finder";

export default class MutationListener extends React.Component {
  componentDidMount() {
    // do stuff

    this.observer = new MutationObserver(this.mutationHandler);
    this.deltas = {};

    // Notify me of style changes
    const observerConfig = {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true
    };

    const targetNode = document.body;
    this.observer.observe(targetNode, observerConfig);
  }

  getSelector = node => {
    try {
      const selector = finder(node, {
        seedMinLength: 4,
        optimizedMinLength: 2,
        threshold: 1000
      });
      return selector;
    } catch (error) {
      // do nothing
    }
  };

  styleMutator = mutation => {
    const selector = this.getSelector(mutation.target);

    if (selector == null || selector === undefined) {
      return;
    }

    this.deltas[selector] = Object.assign({}, this.deltas[selector], {
      style: window.getComputedStyle(mutation.target).cssText
    });
  };

  characterDataMutator = mutation => {
    const characterDataBlackList = ["body"];

    const selector = this.getSelector(mutation.target.parentNode);

    if (selector == null || selector === undefined) {
      return;
    }

    if (characterDataBlackList.includes(selector)) {
      return;
    }

    this.deltas[selector] = Object.assign({}, this.deltas[selector], {
      characterData: mutation.target.textContent
    });
  };

  mutationHandler = mutations => {
    mutations.forEach(mutation => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        this.styleMutator(mutation);
      }

      if (mutation.type === "characterData") {
        this.characterDataMutator(mutation);
      }

      window.parent.postMessage(
        { type: "SITE_CHANGE", source: "getDiff-client", payload: this.deltas },
        "*"
      );
    });
  };

  componentWillUnmount() {
    // do stuff
    this.observer.disconnect();
  }

  render() {
    return null;
  }
}
