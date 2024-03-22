import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import ChatRoom from './ChatRoom'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatRoom />
  </React.StrictMode>,
);
