import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./index.css";

window.addEventListener("touchstart", function () {
  window.hasTouched = true;
});

const root = createRoot(document.getElementById("root"));
root.render(<App />);
