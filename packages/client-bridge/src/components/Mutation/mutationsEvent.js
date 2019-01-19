import finder from "@medv/finder";
import client from "./graphql/client";
import gql from "graphql-tag";

const deltas = {};

function getSelector(node) {
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
}

const characterDataBlackList = ["body"];

const styleMutator = mutation => {
  const selector = getSelector(mutation.target);

  if (selector == null || selector === undefined) {
    return;
  }

  deltas[selector] = Object.assign({}, deltas[selector], {
    style: window.getComputedStyle(mutation.target).cssText
  });
};

const characterDataMutator = mutation => {
  const selector = getSelector(mutation.target.parentNode);

  if (selector == null || selector === undefined) {
    return;
  }

  if (characterDataBlackList.includes(selector)) {
    return;
  }

  deltas[selector] = Object.assign({}, deltas[selector], {
    characterData: mutation.target.textContent
  });
};

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === "attributes" && mutation.attributeName === "style") {
      styleMutator(mutation);
    }

    if (mutation.type === "characterData") {
      characterDataMutator(mutation);
    }

    window.parent.postMessage(
      { type: "SITE_CHANGE", source: "getDiff-client", payload: deltas },
      "*"
    );
  });
});

window.printDeltas = function() {
  console.log(JSON.stringify(deltas, null, 4));
};

window.getDeltas = () => {
  return deltas;
};

window.applyChanges = data => {
  Object.assign(deltas, data);

  const applyRecordToElement = record => element => {
    if (record.characterData) {
      try {
        // apply character changes
        element.innerText = record.characterData;
      } catch (error) {
        console.warn("cant apply character change to ", key);
      }
    }

    if (record.style) {
      try {
        element.setAttribute("style", record.style);
      } catch (error) {
        console.warn("cant apply style change to ", key);
      }
    }
  };

  Object.keys(data).forEach(key => {
    const elements = document.querySelectorAll(key);
    const record = data[key];
    elements.forEach(applyRecordToElement(record));
  });
};

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

export default () => {
  const targetNode = document.body;
  observer.observe(targetNode, observerConfig);
};
