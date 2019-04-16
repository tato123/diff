import { EventTypeHandler } from "../core/types";
import RxPostmessenger from "rx-postmessenger";

const createAndReturn = (): HTMLStyleElement => {
  const wrapper = document.createElement("div");
  wrapper.id = "df-01-style";

  const style = document.createElement("style");
  wrapper.appendChild(style);

  document.body.appendChild(wrapper);
  return style;
};

const Handshake: EventTypeHandler = (
  request: RxPostmessenger.Request<string, void>
) => {
  if (!document.body) {
    return;
  }

  const stylesheet =
    document.querySelector("#df-01-style > style") || createAndReturn();
  stylesheet.innerHTML = request.payload;
};

export const type = "stylesheet";

export default Handshake;
