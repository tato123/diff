window.addEventListener("load", function(event) {
  window.addEventListener("message", evt => {
    console.log("[Child] received a message", evt.data);
    const data = evt.data;
    const id = data.id;

    if (data.type === "apply") {
      const domElements = document.querySelectorAll(data.css);
      domElements.forEach(element => {
        const html = data.html.replace("{{value}}", element.innerText);
        element.insertAdjacentHTML("afterend", html);

        element.setAttribute(
          "data-df-di",
          window.getComputedStyle(element).display || "initial"
        );
        element.style.display = "none";
        element.setAttribute("data-df-og", id);
      });
    } else if (data.type === "remove") {
      // remove old ids
      document
        .querySelectorAll(`[data-df="${id}"]`)
        .forEach(e => e.parentNode.removeChild(e));

      // re-enable
      document
        .querySelectorAll(`[data-df-og="${id}"]`)
        .forEach(e => (e.style.display = e.getAttribute("data-df-di")));
    }
  });

  const button = document.createElement("input");
  button.type = "button";
  button.value = "im a button";
  button.onclick = () => {
    window.parent.postMessage("hi im sending something", "*");
  };
  document.body.appendChild(button);

  console.log("I loaded a script!!!");
  console.log("All resources finished loading!");
});
