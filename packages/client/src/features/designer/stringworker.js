/* eslint-disable */

const stringworker = () => {
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

      const innerStyle = deltas[key].style;
      const cssParts = innerStyle.split(";");

      const cssStyles = cssParts.reduce((acc, val) => {
        if (!val) {
          return acc;
        }

        try {
          const a = val.split(":");
          const cssKey = a[0].trim();
          const cssVal = a[1].trim();

          if (!self.isWhitelisted(cssKey)) {
            return acc;
          }

          acc[cssKey] = cssVal;

          return acc;
        } catch (error) {
          //   console.log("Failed to transform value" + val);
          return acc;
        }
      }, {});

      acc[key] = cssStyles;

      return acc;
    }, {});
  };

  onmessage = function(e) {
    const deltas = e.data;
    const styles = self.convertToStyles(deltas);

    postMessage(styles);
  };
};

let code = stringworker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
