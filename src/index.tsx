import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <GoogleOAuthProvider clientId="1010945517373-e5pv7ajq1l59fm4ppu3vpn3fefnklqbm.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
