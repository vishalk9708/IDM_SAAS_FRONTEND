import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./screens/Register";
import Activate from "./screens/Activate";
import Header from "./components/Header";
import Login from "./screens/Login";
import AccessRequest from "../src/screens/AccessRequestPanel/AccessRequest";
import Error404 from "./screens/ErrorPages/Error404";
import Home from "./components/Home";
import CreateUser from "./screens/CreateUser";
import AccessControl from "./screens/AdminPanel/AccessControl";
import getSessionData from "./utils/getSessionData";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import "./App.css";
import "./css/MobileApp.css";
import "./css/dropdownNeu.css";
import "../src/css/cards.css";
import "../src/css/SearchBar.css";
import AccessDeniedPage from "./screens/ErrorPages/AccessDenied";

function App() {
  let userData = getSessionData();

  return (
    <Router>
      {/* <ParticleContainer /> */}
      <Header />
      <Switch>
        <Route path="/" exact component={() => <Home />} />
        <Route path="/Activate" component={() => <Activate />}></Route>
        <Route path="/Register" component={() => <Register />}></Route>
        <Route
          path="/Login"
          exact
          component={() => {
            return userData.isLoggedIn ? <Home /> : <Login />;
          }}
        ></Route>
        <Route
          path="/AccessRequest"
          component={() => <AccessRequest />}
        ></Route>
        <Route path="/Error404" exact component={() => <Error404 />}></Route>
        <Route
          path="/AccessDenied"
          exact
          component={() => <AccessDeniedPage />}
        ></Route>
        <Route
          path="/CreateUser"
          exact
          component={() => <CreateUser />}
        ></Route>
        <Route
          path="/AccessControl"
          exact
          component={() => <AccessControl />}
        ></Route>
        <Route
          path="/ForgotPassword"
          exact
          component={() => <ForgotPassword />}
        ></Route>
        <Route
          path="/ResetPassword"
          component={() => <ResetPassword />}
        ></Route>
        <Route path="/home" exact component={() => <Home />}></Route>
        <Route path="/*" component={() => <Error404 />}></Route>
      </Switch>
    </Router>
  );
}

export default App;
