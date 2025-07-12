import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { StyledEngineProvider } from '@mui/material/styles';
import "./index.css";
import App from "./App";
import { WindowProvider } from "./math/WindowContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <WindowProvider>
        <App />
      </WindowProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
