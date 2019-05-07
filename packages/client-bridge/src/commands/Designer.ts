import { CommandBuilder, Context, CommandOptions } from "../core/types";
import "../designer/App";

type Inner = { [records: string]: any[] };

const Designer: CommandBuilder = ({ ctx, win }: CommandOptions) => () => {
  console.log("loaded designer");
  document.body.insertAdjacentHTML("beforeend", "<diff-designer />");
};

export default Designer;
