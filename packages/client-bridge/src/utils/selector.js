import finder from "@medv/finder";
import { select } from "optimal-select"; // global: 'OptimalSelect'

/**
 * Valid classnames cannot contain a number
 * or be gibberish
 * @param {*} name
 */
const isValidClassname = name => {
  return !(/\d/.test(name) || name.startsWith("sc-") || name.length < 7);
};

const finderSelector = node => {
  try {
    const selector = finder(node, {
      root: document.body,
      seedMinLength: 4,
      className: isValidClassname,
      optimizedMinLength: 2,
      threshold: 1000
    });
    return selector;
  } catch (error) {
    return null;
  }
};

const optimalSelector = node => {
  const options = {
    // default reference
    root: document,

    skip(traverseNode) {
      // ignore select information of the direct parent
      return traverseNode === node.parentNode;
    },

    // define order of attribute processing
    priority: ["id", "class", "href", "src"],

    // define patterns which should't be included
    ignore: {
      class(className) {
        console.log("classname", className);
        // disregard short classnames
        return (
          className.length < 5 ||
          /\d/.test(className) ||
          className.startsWith("sc-")
        );
      },

      attribute(name, value, defaultPredicate) {
        // exclude HTML5 data attributes
        return /data-*/.test(name) || defaultPredicate(name, value);
      },

      // define simplified ignore patterns as a boolean/string/number/regex
      tag: "div"
    }
  };

  return select(node, options);
};

export default finderSelector;
