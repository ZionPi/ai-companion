import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import MainFrame from "./MainFrame";
import { Provider } from 'react-redux';

import store  from "./redux/config/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MainFrame></MainFrame>
    </Provider>
  </React.StrictMode>,
);
