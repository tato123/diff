import { build, expose } from "./core";
import { action, autorun, runInAction } from "mobx";

// Commands are things that we can do, actively modify
// the page in some way or provide some way of interacting in diff
import AddPagelet from "./commands/AddPagelet";
import Designer from "./commands/Designer";
import getPageTheme from "./events/GetPageTheme";

// Handlers are reactive, they consume infomration about the
// context and allow us to perform operations
import Handler from "./handlers/InlineStyle";
import StyleSheet from "./handlers/StyleSheet";

// Event Type handlers
import Stylesheet, { type as StylesheetType } from "./events/stylesheet";

// Our product configuration
import config from "./config.json";

let diff = build("diff")
  // Handlers respond to record types
  .onRecordType("stylesheet", StyleSheet)
  .onRecordType("inline-style", Handler)

  // Event Types
  .onEventType(StylesheetType, Stylesheet)
  .onEventType("getPageTheme", getPageTheme)
  .onEventType("designer", () => {
    window["diff"]["designer"]();
  })

  // contruct the commands that can be performed by diff
  .command("addPagelet", AddPagelet)
  .command("designer", Designer)

  .create();

expose(diff, config["_API_KEY_"], config["_INITIAL_STATE_"]);
