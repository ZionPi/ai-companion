import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import MainFrame from "./MainFrame";
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <MainFrame></MainFrame>
    </React.StrictMode>
</Provider>,
);
