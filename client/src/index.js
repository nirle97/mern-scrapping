import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider } from "./AppContext";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
