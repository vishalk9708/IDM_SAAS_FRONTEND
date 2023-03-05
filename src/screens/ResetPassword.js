import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Button, Row, TextInput, Card, Icon } from "react-materialize";
import swal from "sweetalert";
import ReactDOM from "react-dom";
import Loader from "../components/Loader";
import validators from "../utils/validate";
import isMobile from "../utils/mobile";
import Address from "../utils/Address";
import getSessionData from "../utils/getSessionData";
import { isSafari } from "react-device-detect";
import sendRequest from "../utils/sendRequest";

function ResetPassword() {
  let history = useHistory();

  const [LoaderStat, setLoaderState] = useState(true);
  const [input, setInput] = useState({
    otp: "",
    password: "",
    repassword: "",
  });

  //let { isLoggedIn } = useMemo(() => getSessionData(), []);

  useEffect(() => {
    // if (!isLoggedIn) history.push({ pathname: "/Login" });
    setLoaderState(false);
  }, []);

  const currentUrl = window.location.href;
  const myToken = currentUrl.split("==");
  const myAccessToken = myToken[1];

  //--------- handle change functions -----------------
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

  function handleChange(event) {
    const { name, value } = event.target;

    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  function handleRepasswordChange(event) {
    const { name, value } = event.target;
    checkPasswordMatch(value);
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  // ------------ for matched password check -----------------------
  function checkPasswordMatch(value) {
    if (input.password === value) {
      ReactDOM.render(
        <div class="green-text" dangerouslySetInnerHTML={{ __html: "" }} />,
        document.getElementById("Error_repassword")
      );
      return true;
    } else {
      ReactDOM.render(
        <div
          class="red-text"
          dangerouslySetInnerHTML={{ __html: "Password Don't Match" }}
        />,
        document.getElementById("Error_repassword")
      );
      return false;
    }
  }

  //-------- handle submit button ----------------------

  function handleClick(event) {
    setLoaderState(true);
    event.preventDefault();

    console.log("token extracted is", myAccessToken);

    if (
      validators.validatePassword(input.password) &&
      validators.validateOtp(input.otp) &&
      checkPasswordMatch(input.repassword)
    ) {
      const data = {
        otp: input.otp,
        password: input.password,
        token: myAccessToken,
      };
      checkAndUpdate(data);
    } else swal("Incorrect details", "Please verify the details", "warning");
    setLoaderState(false);
  }

  //------------A function to check otp and update password----------------------------

  const checkAndUpdate = async (data) => {
    sendRequest(`/api/activationToken/resetPassword`, data).then((res = {}) => {
      var result = res.data["result"];
      setLoaderState(false);
      if (result) {
        swal("Password Updated!", "Login to continue", "success").then(
          (value) => {
            history.push({ pathname: "/Login" });
          }
        );
      } else swal("something went wrong", "please try again", "warning");
    });
  };

  //-------------------------------------------------------------------------------------

  if (!isMobile()) {
    return (
      <div>
        <Loader value={LoaderStat} />
        <div className="card-container">
          <Card className="z-depth-5 reset-card neumorphCard">
            <Row>
              <Icon
                medium
                left
                className="kfintech-purple-text lighten-4 HeadIcon"
              >
                lock_open
              </Icon>
              <h4
                class="center kfintech-purple-text "
                style={{ textAlign: "left" }}
              >
                Reset Password
              </h4>
              <p style={{ marginTop: "-10px", marginBottom: "20px" }}>
                Enter the OTP sent to your Email
              </p>
            </Row>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <center className="reset-row">
                <Row>
                  <TextInput
                    onChange={handleChange}
                    className="inner-padding reset-input"
                    type="text"
                    name="otp"
                    key="otp01Forgot"
                    id="otp01Forgot"
                    value={input.otp}
                    label="Enter the OTP"
                    s="12"
                    l="12"
                  />
                  <span id="Error_otp"></span>
                </Row>

                <Row>
                  <TextInput
                    onChange={handlePasswordChange}
                    className="inner-padding reset-input"
                    type="password"
                    name="password"
                    value={input.password}
                    key="pass01Forgot"
                    id="pass01Forgot"
                    label="Enter New Password"
                    s="12"
                    l="12"
                  />

                  <span
                    id="Error_password"
                    className="reset-error__password"
                  ></span>
                </Row>

                <Row>
                  <TextInput
                    onChange={handleRepasswordChange}
                    className="reset-input inner-padding"
                    type="password"
                    name="repassword"
                    key="pass02Forgot"
                    id="pass02Forgot"
                    required
                    value={input.repassword}
                    label="Confirm Password"
                    s="12"
                    l="12"
                  />

                  <span
                    id="Error_repassword"
                    className="reset-error__password"
                  ></span>
                </Row>

                <center>
                  <Button
                    onClick={handleClick}
                    type="submit"
                    color="primary"
                    size="lg"
                    className="kfin-neu-btn__blue"
                  >
                    <span>Reset</span>
                    <Icon tiny right>
                      change_circle
                    </Icon>
                  </Button>
                </center>
                <br />
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
        <div className="reset-mobile__container">
          <Card className="z-depth-5 neumorphCard" style={{ width: "90%" }}>
            <Row>
              <Icon
                small
                left
                className="kfintech-purple-text lighten-4 HeadIcon"
              >
                lock_open
              </Icon>
              <h5
                class="center kfintech-purple-text "
                style={{ textAlign: "left" }}
              >
                Reset Password
              </h5>
              <p style={{ marginLeft: "55px" }}>
                Enter the OTP sent to your Email
              </p>
            </Row>
            <br />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <center>
                <TextInput
                  onChange={handleChange}
                  className={isSafari ? "safariBorder" : "inner-padding"}
                  type="text"
                  name="otp"
                  key="otp01Forgot"
                  id="otp01Forgot"
                  value={input.otp}
                  label="Enter the OTP"
                  s="8"
                  l="8"
                />
                <span id="Error_otp"></span>

                <br />

                <TextInput
                  onChange={handlePasswordChange}
                  className={isSafari ? "safariBorder" : "inner-padding"}
                  type="password"
                  name="password"
                  value={input.password}
                  key="pass01Forgot"
                  id="pass01Forgot"
                  label="Enter New Password"
                  s="8"
                  l="8"
                />

                <span
                  id="Error_password"
                  className="reset-error__password"
                ></span>

                <br />
                <TextInput
                  onChange={handleRepasswordChange}
                  className="inner-padding"
                  type="password"
                  name="repassword"
                  key="pass02Forgot"
                  id="pass02Forgot"
                  required
                  value={input.repassword}
                  label="Confirm Password"
                  s="8"
                  l="8"
                />

                <span id="Error_repassword"></span>

                <br />

                <Button
                  onClick={handleClick}
                  type="submit"
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  Reset
                </Button>
                <br />
              </center>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}
export default ResetPassword;
