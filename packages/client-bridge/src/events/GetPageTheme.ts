import {
  CommandBuilder,
  Context,
  CommandOptions,
  EventTypeHandler
} from "../core/types";
import { action, autorun, runInAction } from "mobx";
import RxPostmessenger from "rx-postmessenger";
import _ from "lodash";

interface ResponsePayload {}

const GetPageTheme: EventTypeHandler = (
  request: RxPostmessenger.Request<void, ResponsePayload>
) => {
  const components = ["h1", "h2", "h3", "p", "label", "a", "button"];
  const whitelist = ["color", "fontSize", "fontWeight", "padding", "margin"];
  const theme = components.reduce((acc, val) => {
    console.log("[diff] collecting", val);

    const elements = document.querySelectorAll(val);
    if (elements.length === 0 || elements == null || elements === undefined) {
      return acc;
    }

    elements.forEach(e => {
      const styles = window.getComputedStyle(e);
      //   const key = e
      const classes = e.classList.value.split(" ").join(".");
      const id = e.id;
      const tagName = e.tagName.toLowerCase();
      const key = `${tagName}${id ? `#${id}` : ""}${
        classes ? "." + classes : ""
      }`;

      acc[key] = whitelist.reduce((acc, val) => {
        return {
          ...acc,
          [val]: styles[val]
        };
      }, {});
    });

    return acc;
  }, {});

  request.respond(theme);
};

export default GetPageTheme;
