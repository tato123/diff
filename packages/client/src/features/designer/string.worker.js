/* eslint-disable */
const JsonCSS = require('json-css');




self.isWhitelisted = cssKey => {
  if (cssKey.startsWith("-") || cssKey.startsWith("animation")) {
    return false;
  }

  return true;
};

self.convertToStyles = deltas => {
  return Object.keys(deltas).reduce((acc, key) => {
    if (deltas[key] && !deltas[key].style) {
      return acc;
    }

    const innerStyle = `out{${deltas[key].style}}`;
    
    const handle = new JsonCSS();
    const cssStyles = handle.toJSON(innerStyle)
    
    acc[key] = cssStyles.out;

    return acc;
  }, {});
};


function startCounter (e) {
  const deltas = e.data;
  const styles = self.convertToStyles(deltas);
  

  postMessage(styles);
}



self.addEventListener("message", startCounter);


