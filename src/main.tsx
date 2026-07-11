import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/config";
import "./index.css";
import App from "./App.tsx";
import { registerServiceWorker } from "./registerServiceWorker";
import { reportWebVitals } from "./lib/reportWebVitals";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("#root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerServiceWorker();
reportWebVitals();
