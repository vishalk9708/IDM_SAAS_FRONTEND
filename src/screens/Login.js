import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Row, Col, TextInput, Card, Icon } from "react-materialize";
import swal from "sweetalert";
import setSessionData from "../utils/setSessionData";
import Loader from "../components/Loader";
import validators from "../utils/validate";
import isMobile from "../utils/mobile";
import { encrypt } from "../utils/ciphers";
import parseUrl from "../utils/parseUrl";
import { isEmpty } from "../utils/ObjFunctions";
import { isSafari } from "react-device-detect";
import { useStateValue } from "../StateProvider";
import { restructureUserData } from "../utils/restructureUserData";
import sendRequest from "../utils/sendRequest";
import SecureLS from "secure-ls";

/**
 * Description
 * Login page for IDM
 */
function Login() {
  const history = useHistory();
  const [input, setInput] = useState({ password: "", email: "" });
  const [LoaderStat, setLoaderState] = useState(true);
  const [textemails, setEmails] = useState([]);
  const queryParams = React.useRef(null);
  const [state, dispatch] = useStateValue();

  var ls = new SecureLS();

  useEffect(() => {
    setLoaderState(false);
    localStorage.clear();
    // query param is when the user click via any application, by default it will be digix.
    queryParams.current = parseUrl(window.location.href);

    if (isEmpty(queryParams.current)) {
      queryParams.current.appName = "digix";
    }

    dispatch({
      type: "CHANGE_APP",
      appName: queryParams.current.appName,
    });

    localStorage.setItem("appName", queryParams.current.appName);

    // to validate emails, we need fund email domain
    sendRequest("/api/getMetaData/getFundDomains")
      .then((res) => {
        const emails = res.data["result"];
        setEmails(emails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  function handleEmailChange(event) {
    const { name, value } = event.target;
    validators.validateEmail(value, textemails);
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  function validateFields({ email, password }) {
    var correctEmail = validators.validateEmail(email, textemails);
    var correctPass = password ? true : validators.validatePassword(password);
    return correctEmail && correctPass;
  }

  function handleSubmit(event) {
    setLoaderState(true);
    event.preventDefault();
    const newLogin = {
      email: input.email,
      password: input.password,
      appName: queryParams.current.appName,
    };

    if (validateFields(newLogin)) {
      sendRequest("/api/auth/login", { data: newLogin })
        .then((res = {}) => {
          console.log(res);
          if (!res.data["userExists"]) {
            setLoaderState(false);
            swal("No user found", "Please register", "warning");
          } else if (!res.data["rightPassword"]) {
            setLoaderState(false);
            swal("Wrong Password", "Please check & re-enter ", "warning");
          } else {
            const userData = restructureUserData(res.data);

            setSessionData(userData);
            ls.set("jdata", { token: userData.jwt_token });

            if (userData.isAdmin)
              localStorage.setItem("appName", userData.adminForApp);
            else localStorage.setItem("appName", "digix");

            history.push({ pathname: "/Home" });
          }
        })
        .catch((error) => {
          setLoaderState(false);
          swal("Oops!", "Something went wrong", "warning");
        });
    } else {
      setLoaderState(false);
      swal(
        "Please fill correct details",
        "Make sure all the fields are properly filled",
        "warning"
      );
    }
  }

  if (!isMobile()) {
    //------------------------------------------------------

    return (
      <div>
        <Loader value={LoaderStat} />
        <div className="card-container">
          <Card className="z-depth-5 login-card neumorphCard">
            <Row>
              <Col>
                <Icon
                  medium
                  className="kfintech-purple-text lighten-4 HeadIcon"
                >
                  account_circle
                </Icon>
              </Col>
              <Col>
                <h4
                  className="center kfintech-purple-text HeadTitle"
                  style={{ marginBottom: "20px" }}
                >
                  Login
                </h4>
              </Col>
            </Row>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <Row className="login-input__inputs">
                <TextInput
                  className="login-input__email"
                  onChange={handleEmailChange}
                  email
                  name="email"
                  value={input.email}
                  key="emailLofin01"
                  id="emailLofin01"
                  required
                  label="Enter the email"
                  validate
                  s={10}
                  l={10}
                />
              </Row>
              <Row>
                <span
                  id="Error_email"
                  className="login-input__error-mail"
                ></span>
              </Row>
              <Row className="login-input__inputs login-input__inputPass">
                <TextInput
                  className="login-input__password"
                  onChange={handleChange}
                  name="password"
                  value={input.password}
                  type="password"
                  key="passLogin01"
                  id="passLogin01"
                  required
                  label="Enter the password"
                  s={10}
                  l={10}
                />
                <span id="Error_password" style={{ color: "red" }}></span>
              </Row>

              <center>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  <span> Login </span>
                  <Icon tiny right>
                    login
                  </Icon>
                </Button>
              </center>

              <br />
              <center>
                <Row>
                  <span>
                    Don't Have Account?{" "}
                    <a href="/Register" className="link-style-a">
                      Register Here
                    </a>
                  </span>
                  <Row />
                  <span>
                    Forgot Password?{" "}
                    <a href="/ForgotPassword" className="link-style-a">
                      Reset Here
                    </a>{" "}
                  </span>
                </Row>
              </center>
            </form>
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Loader value={LoaderStat} />
        <div className="login-mobile__container">
          <Card className="z-depth-5 neumorphCard">
            <Row className="login-mobile__top">
              <Icon small className="kfintech-purple-text lighten-4 HeadIcon">
                account_circle
              </Icon>

              <h5
                class="center kfintech-purple-text "
                style={{ marginLeft: "30px" }}
              >
                Login
              </h5>
            </Row>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <Row>
                <center>
                  <TextInput
                    onChange={handleEmailChange}
                    className={isSafari ? "safariBorder" : "inner-padding"}
                    name="email"
                    value={input.email}
                    key="emailLofin01"
                    id="emailLofin01"
                    required
                    label="Enter the email"
                    s={12}
                    l={12}
                  />
                </center>

                <span
                  id="Error_email"
                  className="login-input__error-mail"
                ></span>
              </Row>

              <Row>
                <center>
                  <TextInput
                    onChange={handleChange}
                    className={isSafari ? "safariBorder" : "inner-padding"}
                    name="password"
                    value={input.password}
                    type="password"
                    key="passLogin01"
                    id="passLogin01"
                    required
                    label="Enter the password"
                    s={12}
                    l={12}
                  />
                </center>

                <span
                  id="Error_password"
                  className="register-input__mobile-error-password"
                ></span>
              </Row>
              <center>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  <span> Login </span>
                  <Icon tiny right>
                    login
                  </Icon>
                </Button>
              </center>
              <center>
                <Row></Row>
                <Row>
                  <span>
                    Don't Have Account?{" "}
                    <a
                      href="/Register"
                      className="kfintech-purple-text lighten-4 link-style-a"
                    >
                      Register Here
                    </a>
                  </span>
                </Row>

                <Row>
                  <span>
                    Forgot Password?{" "}
                    <a
                      href="/ForgotPassword"
                      className="kfintech-purple-text lighten-4 link-style-a"
                    >
                      Reset Here
                    </a>{" "}
                  </span>
                </Row>
              </center>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}
export default Login;
