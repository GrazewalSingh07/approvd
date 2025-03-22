import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster />
    <BrowserRouter
      future={{
        v7_startTransition: true,
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
