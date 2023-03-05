import React, { useState, useEffect } from "react";
import { Navbar, Icon, Dropdown, Button } from "react-materialize";
import { useHistory } from "react-router-dom";
import logo from "../img/logo.png";
import { Link, withRouter } from "react-router-dom";
import getSessionData from "../utils/getSessionData";
import { useMemo } from "react";
import { DROPDOWN_OPTIONS, NAVBAR_OPTIONS } from "../metadata";
import setSessionData from "../utils/setSessionData";

const linkStyle = { marginTop: "10px", color: "gray" };
const loginStyle = { marginRight: "20px", fontSize: "16px", color: "gray" };

const Header = () => {
  let history = useHistory();
  let userData = useMemo(() => getSessionData());
  let app = localStorage.getItem("appName");
  console.log("APP VARIABLE", app);
  let [appName, setAppName] = useState(app);

  useEffect(() => {
    if (userData.isAdmin) {
      console.log("useEffect running");
      appName = userData.adminForApp;
      // setAppName(appName);
    }
    // console.log("APP VARIABLE",app)
    appName = localStorage.getItem("appName");
    setAppName(appName);
  });

  console.log("---- userData -------------", userData, "app is = ", appName);
  let isLoggedIn = userData?.isLoggedIn;
  let name = isLoggedIn ? userData.firstName + " " + userData.lastName : " ";
  let userType = isLoggedIn ? userData?.app?.[appName]?.userType : " ";
  let subUserType = isLoggedIn ? userData?.app?.[appName]?.subUserType : " ";
  //---------------------------------------

  const handleAppChange = (app) => {
    setAppName(app);
    localStorage.setItem("appName", app);

    // if (userData?.app?.[app].userType === "admin") {
    //         userData.adminForApp = app;
    //         userData.isAdmin = true;
    // }
    // else userData.isAdmin = false;

    setSessionData(userData);

    history.push({ pathname: "/Home" });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = `/Login`;
  };

  return (
    <Navbar
      alignLinks="right"
      className="topnavbar"
      brand={
        <a className="brand-logo" href="/">
          <img
            src={logo}
            alt="KFinTech Logo"
            style={{ margin: "10px 20px" }}
            width="180px"
          />
        </a>
      }
      id="mobile-nav"
      menuIcon={<Icon>menu</Icon>}
      options={NAVBAR_OPTIONS}
    >
      {
        console.log("User data from header", userData.isAdmin, userData.adminForApp)
      }
      {isLoggedIn &&
        userData.isAdmin &&
        userData.adminForApp === "quest" &&
        (subUserType === "Unit" || subUserType === 'Audit' || subUserType === 'AMC' || subUserType === 'SuperUser') && (
          <Link to="/AccessControl" style={{ color: "gray" }}>
            IAM &nbsp;
          </Link>
        )}

      {isLoggedIn &&
        userData.isAdmin &&
        userData.adminForApp === "quest" &&
        (subUserType === "Unit" || subUserType === 'Audit' || subUserType === 'AMC' || subUserType === 'SuperUser') &&
        userData.isKfinUser && (
          <Link to="/CreateUser" style={{ color: "gray" }}>
            <Icon tiny left>
              person_add
            </Icon>
            Create user &nbsp;
          </Link>
        )}

      {isLoggedIn && userData.isAdmin && userData.adminForApp !== 'quest' && (
        <Link to="/AccessControl" style={{ color: "gray" }}>
          IAM &nbsp;
        </Link>
      )}

      {isLoggedIn && userData.isAdmin && userData.adminForApp !== 'quest' && userData.isKfinUser && (
        <Link to="/CreateUser" style={{ color: "gray" }}>
          <Icon tiny left>
            person_add
          </Icon>
          Create user &nbsp;
        </Link>
      )}

      {!isLoggedIn && (
        <Link to="/Login" style={loginStyle}>
          Login{" "}
          <Icon tiny right>
            login
          </Icon>
        </Link>
      )}

      {isLoggedIn &&
        !userData.isAdmin &&
        userData.accountStatus !== "PreActivation" &&
        userData.isKfinUser && (
          <Dropdown
            id="app01"
            options={DROPDOWN_OPTIONS}
            trigger={
              <Button
                node="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "15px",
                  marginRight: "15px",
                  backgroundColor: "#ecf0f3",
                  color: "grey",
                  minWidth: "150px",
                  width: "auto",
                  borderRadius: "7px",
                }}
              >
                {appName}
                <Icon right>arrow_drop_down</Icon>
              </Button>
            }
          >
            {/* eslint-disable-next-line */}
            <a href="#" onClick={() => handleAppChange("digix")}>
              Digix
            </a>

            {/* eslint-disable-next-line */}
            <a href="#" onClick={() => handleAppChange("dataEngineering")}>
              Data Engineering
            </a>

            {/* eslint-disable-next-line */}
            <a href="#" onClick={() => handleAppChange("dataUtility")}>
              Data Utility
            </a>

            <a href="#" onClick={() => handleAppChange("quest")}>
              Quest
            </a>

            <a href="#" onClick={() => handleAppChange("nps")}>
              NPS
            </a>
          </Dropdown>
        )}

      {isLoggedIn &&
        !userData.isAdmin &&
        userData.accountStatus !== "PreActivation" &&
        !userData.isKfinUser && (
          <Dropdown
            id="app01"
            options={DROPDOWN_OPTIONS}
            trigger={
              <Button
                node="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "15px",
                  marginRight: "15px",
                  backgroundColor: "#ecf0f3",
                  color: "grey",
                  minWidth: "150px",
                  width: "auto",
                  borderRadius: "7px",
                }}
              >
                {appName}
                <Icon right>arrow_drop_down</Icon>
              </Button>
            }
          >
            {/* eslint-disable-next-line */}
            <a href="#" onClick={() => handleAppChange("digix")}>
              Digix
            </a>

            <a href="#" onClick={() => handleAppChange("quest")}>
              Quest
            </a>

            <a href="#" onClick={() => handleAppChange("nps")}>
              NPS
            </a>
          </Dropdown>
        )}

      {isLoggedIn && (
        <Dropdown
          id="Dropdown_8"
          trigger={
            <a href="/LogOut" className="name-user" style={{ color: "gray" }}>
              <Icon tiny left style={{ color: "gray" }}>
                person
              </Icon>
              {name}
              <Icon tiny right style={{ color: "gray" }}>
                arrow_drop_down
              </Icon>
            </a>
          }
        >
          <a
            href="/Login"
            className="header-logout"
            onClick={handleLogout}
            style={linkStyle}
          >
            LogOut{" "}
            <Icon tiny right>
              logout
            </Icon>
          </a>
        </Dropdown>
      )}
    </Navbar>
  );
};

export default withRouter(Header);
