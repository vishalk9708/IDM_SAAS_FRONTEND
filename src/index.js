import React from "react";
import ReactDOM from "react-dom";
//import 'materialize-css/dist/css/materialize.min.css';
import "materialize-css/dist/js/materialize.min.js";
import "sweetalert/dist/sweetalert.min.js";
import "./css/materialize_custom.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StateProvider } from "./StateProvider";
import { initialState, reducer } from "./reducer";

ReactDOM.render(
  <BrowserRouter>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
