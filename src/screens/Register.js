import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Row, Col, TextInput, Card, Icon } from "react-materialize";
import swal from "sweetalert";
import Loader from "../components/Loader";
import validators from "../utils/validate";
import isMobile from "../utils/mobile";
import { encrypt } from "../utils/ciphers";
import parseUrl from "../utils/parseUrl";
import { isSafari } from "react-device-detect";
import sendRequest from "../utils/sendRequest";

function Register() {
  const history = useHistory();
  const [LoaderStat, setLoaderState] = useState(true);
  const [textemails, setEmails] = useState([]);
  const queryParams = React.useRef(null);

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    phNumber: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    setLoaderState(true);

    queryParams.current = parseUrl(window.location.href);

    if (isEmpty(queryParams.current)) {
      queryParams.current.appName = "digix";
    } else {
      console.log("query params exists and they are == ", queryParams.current);
    }

    let emails = [];

    sendRequest(`/api/getMetaData/getFundNames`)
      .then((res) => {
        const fundData = res.data["result"];

        if (fundData) {
          fundData.forEach((element) => {
            emails.push(element.domain);
            setEmails(emails);
            setLoaderState(false);
          });
        }
      })
      .catch((err) => {
        setLoaderState(false);
      });
  }, []);

  const isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
  };
  /**
   * Verifies if user is present. If not registers the user in database
   * @param {*} newLogin All Details from form
   */
  async function VerifyAndRegisterUser(newLogin) {
    const predicates = {
      email: newLogin.email,
    };

    const registerDataProtected = newLogin;

    sendRequest(`/api/auth/query/`, registerDataProtected)
      .then((res = {}) => {
        let userFlag = res.data["count"] > 0;
        if (userFlag) {
          console.log("I'm in if");
          swal(
            "User already exists!",
            "Please proceed to log-in",
            "warning"
          ).then(() => {
            history.push({ pathname: "/login" });
          });
          setLoaderState(false);
        } else {
          sendRequest(`/api/auth/register`, { payload: registerDataProtected })
            .then((res = {}) => {
              var activationToken = res.data["token"];
              var status = res.data["data"];
              setLoaderState(false);
              if (status === "Done") {
                swal(
                  "Account created!",
                  "Click ok to continue",
                  "success"
                ).then((value) => {
                  history.push({ pathname: `/Activate/==${activationToken}` });
                });
              } else {
                console.log(status);
                swal(
                  "Account not created!",
                  "something went wrong, please try again",
                  "warning"
                );
              }
            })
            .catch((err) => {
              setLoaderState(false);
            });
        }
      })
      .catch((err) => {
        setLoaderState(false);
        swal(
          "Account not created!",
          "something went wrong, please try again",
          "warning"
        );
      });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  function handlePhoneChange(event) {
    const { name, value } = event.target;
    if (!(value.length < 10)) validators.validatePhone(value);
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    validators.validatePassword(value);
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

  function validateFields(login) {
    var validPassword = validators.validateEmail(login.email, textemails);
    var validEmail = validators.validatePhone(login.phNumber);
    var validPhone = validators.validatePassword(login.password);

    return (
      validPassword &&
      validPhone &&
      validEmail &&
      validPhone &&
      input.firstName &&
      input.lastName
    );
  }

  function handleClick(event) {
    event.preventDefault();
    const newLogin = {
      firstName: input.firstName,
      lastName: input.lastName,
      phNumber: input.phNumber,
      password: input.password,
      email: input.email,
      userType: "User",
      appName: queryParams.current.appName,
    };

    if (validateFields(newLogin)) {
      setLoaderState(true);
      VerifyAndRegisterUser(newLogin);
    } else {
      swal(
        "Account not created!",
        "Make sure all the fields are properly filled",
        "warning"
      );
    }
  }

  if (!isMobile()) {
    return (
      <div>
        <Loader value={LoaderStat} />
        <div className="Register-container">
          <Card className="z-depth-5 Register-card neumorphCard">
            <div>
              <Row>
                <Col>
                  <div>
                    <Icon
                      medium
                      className="kfintech-purple-text lighten-4 HeadIcon"
                    >
                      account_circle
                    </Icon>
                  </div>
                </Col>

                <Col>
                  <h4 className="center kfintech-purple-text HeadTitle">
                    Create an account
                  </h4>
                </Col>
              </Row>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleClick(e);
                }}
              >
                <div className="registration-wrapper">
                  <Row className="Register-input__half">
                    <TextInput
                      id="firstName"
                      onChange={handleChange}
                      className="inner-padding"
                      name="firstName"
                      value={input.firstName}
                      key="firstReg01"
                      label="Enter the first name"
                      s="6"
                      l="6"
                    />
                    <span style={{ width: "30px" }}></span>

                    <TextInput
                      id="lastName"
                      onChange={handleChange}
                      className="inner-padding"
                      name="lastName"
                      value={input.lastName}
                      key="lastReg01"
                      label="Enter the last name"
                      s="6"
                      l="6"
                    />
                  </Row>

                  <Row className="register-row__email">
                    <TextInput
                      id="email"
                      className="inner-padding"
                      onChange={handleEmailChange}
                      email
                      name="email"
                      value={input.email}
                      key="emailReg01"
                      label="Enter the email"
                      s="12"
                      l="12"
                    />
                  </Row>
                  <span
                    id="Error_email"
                    className="register-input__error-mail"
                    style={{ marginLeft: "0px" }}
                  ></span>

                  <Row className="Register-input__half">
                    <TextInput
                      id="phNumber"
                      className="inner-padding"
                      onChange={handlePhoneChange}
                      name="phNumber"
                      value={input.phNumber}
                      key="phoneReg01"
                      label="Enter your mobile number"
                      s="6"
                      l="6"
                    />
                    <span style={{ width: "30px" }}></span>
                    <TextInput
                      id="password"
                      onChange={handlePasswordChange}
                      className="inner-padding"
                      name="password"
                      value={input.password}
                      key="passReg01"
                      Type="password"
                      label="Enter the password"
                      s="6"
                      l="6"
                    />
                  </Row>
                  <span
                    id="Error_phone"
                    className="register-input__error-phone"
                    s="6"
                    l="6"
                  ></span>
                  <span
                    id="Error_password"
                    className="register-input__error-password"
                    s="6"
                    l="6"
                  ></span>
                </div>

                <center>
                  <Button
                    onClick={handleClick}
                    type="submit"
                    color="primary"
                    size="lg"
                    className="kfin-neu-btn__blue"
                  >
                    <span> Register </span>
                    <Icon tiny right>
                      how_to_reg
                    </Icon>
                  </Button>
                </center>
              </form>
            </div>
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Loader value={LoaderStat} />
        <div className="register-mobile__container">
          <Card className="z-depth-5 neumorphCard">
            <Row
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Icon small className="kfintech-purple-text lighten-4 HeadIcon">
                account_circle
              </Icon>
              <h5 className="center kfintech-purple-text ">
                Create an account
              </h5>
            </Row>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <Row>
                <TextInput
                  id="firstName"
                  onChange={handleChange}
                  className={
                    isSafari
                      ? "safariBorder mobile-registration__input"
                      : "inner-padding mobile-registration__input"
                  }
                  name="firstName"
                  value={input.firstName}
                  key="firstReg01"
                  label="Enter the first name"
                  s="12"
                  l="12"
                />
              </Row>
              <Row>
                <TextInput
                  id="lastName"
                  onChange={handleChange}
                  className={
                    isSafari
                      ? "safariBorder mobile-registration__input"
                      : "inner-padding mobile-registration__input"
                  }
                  name="lastName"
                  value={input.lastName}
                  key="lastReg01"
                  label="Enter the last name"
                  s="12"
                  l="12"
                />
              </Row>
              <Row>
                <TextInput
                  id="email"
                  className={
                    isSafari
                      ? "safariBorder mobile-registration__input"
                      : "inner-padding mobile-registration__input"
                  }
                  onChange={handleEmailChange}
                  email
                  name="email"
                  value={input.email}
                  key="emailReg01"
                  label="Enter the email"
                  s="12"
                  l="12"
                />
                <span
                  id="Error_email"
                  className="register-input__mobile-error-mail"
                ></span>
              </Row>
              <Row>
                <TextInput
                  id="phNumber"
                  className={
                    isSafari
                      ? "safariBorder mobile-registration__input"
                      : "inner-padding mobile-registration__input"
                  }
                  onChange={handlePhoneChange}
                  name="phNumber"
                  value={input.phNumber}
                  key="phoneReg01"
                  label="Enter your mobile number"
                  s="12"
                  l="12"
                />
              </Row>
              <span
                id="Error_phone"
                className="register-input__mobile-error-phone"
              ></span>
              <Row>
                <TextInput
                  id="password"
                  onChange={handlePasswordChange}
                  className={
                    isSafari
                      ? "safariBorder mobile-registration__input"
                      : "inner-padding mobile-registration__input"
                  }
                  name="password"
                  value={input.password}
                  key="passReg01"
                  Type="password"
                  label="Enter the password"
                  s="12"
                  l="12"
                />
              </Row>

              <span
                id="Error_password"
                s="6"
                l="6"
                className="register-input__mobile-error-password"
              ></span>

              <center>
                <Button
                  onClick={handleClick}
                  type="submit"
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  <span> Register </span>
                  <Icon tiny right>
                    how_to_reg
                  </Icon>
                </Button>
              </center>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}
export default Register;
