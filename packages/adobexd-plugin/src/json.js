const { getXDWrapper } = require("xd-json-wrapper");
function diffPlugin(selection) {
  let xdNodes = null;
  if (Array.isArray(selection.items)) {
    xdNodes = selection.items.map(item => getXDWrapper(item).toJSON());
  }
  const output = {
    nodes: xdNodes
  };
  return JSON.stringify(output);
}

export default diffPlugin;
