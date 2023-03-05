import React, { useState, useEffect } from "react";
import { Button, Row, TextInput, Card, Icon } from "react-materialize";
import swal from "sweetalert";
import Loader from "../components/Loader";
import validators from "../utils/validate";
import isMobile from "../utils/mobile";
import { useHistory } from "react-router-dom";
import { isSafari } from "react-device-detect";
import sendRequest from "../utils/sendRequest";

function ForgotPassword() {
  const [LoaderStat, setLoaderState] = useState(true);
  const [sent, setSent] = useState(false);

  let history = useHistory();

  const [textemails, setEmails] = useState([]);
  const [input, setInput] = useState({
    email: "",
  });

  useEffect(() => {
    setLoaderState(true);

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

  function handleEmailChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    validators.validateEmail(value, textemails);
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  function handleClick(event) {
    setLoaderState(true);
    event.preventDefault();

    const data = { email: input.email };

    if (validators.validateEmail(data.email, textemails)) {
      checkAndSend(data);
    } else {
      setLoaderState(false);
      swal("Invalid Email", "Please enter a valid email address", "warning");
    }
  }

  const checkAndSend = async (data) => {
    const predicates = { email: data.email };

    await sendRequest(`/api/auth/query/`, predicates).then((res = {}) => {
      let userFlag = res.data["count"] > 0;
      if (userFlag) {
        sendRequest(
          `/api/activationToken/getPasswordResetLink`,
          predicates
        ).then((res = {}) => {
          var result = res.data["status"];
          setLoaderState(false);
          if (result) {
            setSent(true);
            swal(
              "Sent",
              "Password reset link along with OTP is sent to your email",
              "success"
            ).then(() => {
              history.push({ pathname: "/Login" });
            });
          } else swal("Something went wrong", "Please try again", "warning");
        });
      } else {
        setLoaderState(false);
        swal(
          "User not found",
          "Make sure you have entered correct email address",
          "warning"
        );
      }
    });
  };

  const resendPasswordLink = () => {
    setLoaderState(true);
    const data = { email: input.email, option: "passwordresend" };
    sendRequest(`/api/activationToken/resendlink`, data).then((res = {}) => {
      const stat = res.data["stat"];
      setLoaderState(false);
      if (stat)
        swal("OTP sent Successfully", "please check your email", "success");
      else swal("something went wrong", "sorry! please re-try it", "warning");
    });
  };

  if (!isMobile()) {
    return (
      <div>
        <Loader value={LoaderStat} />
        <div className="card-container">
          <Card className="z-depth-5 forgot-card neumorphCard">
            <Row>
              <span style={{ display: "flex", alignItems: "center" }}>
                <Icon
                  className="kfintech-purple-text lighten-4 HeadIcon"
                  left
                  medium
                >
                  lock
                </Icon>
                <div>
                  <h4
                    class="center kfintech-purple-text "
                    style={{ textAlign: "left" }}
                  >
                    Forgot Password
                  </h4>
                  <p>
                    Enter your registered email address to change your password
                  </p>
                </div>
              </span>
            </Row>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <center>
                <Row className="forgot-input">
                  <TextInput
                    onChange={handleEmailChange}
                    className="inner-padding"
                    type="text"
                    name="email"
                    value={input.email}
                    label="Enter the email"
                    s={11}
                    l={11}
                  />
                </Row>
                <span
                  id="Error_email"
                  className="forgot-input__error-mail"
                ></span>
              </center>

              <center>
                <Button
                  onClick={handleClick}
                  type="submit"
                  disabled={sent}
                  className="kfin-neu-btn__blue"
                  color="primary"
                  size="lg"
                >
                  <span>Send</span>
                  <Icon tiny right>
                    send
                  </Icon>
                </Button>
                <br />
                <br />
                {sent && (
                  <span>
                    Not Received mail?{" "}
                    <a
                      href="#"
                      onClick={resendPasswordLink}
                      class="link-style-a"
                    >
                      Resend OTP
                    </a>
                  </span>
                )}
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
        <div className="forgot-mobile__container">
          <Card className="z-depth-5 neumorphCard" style={{ width: "90%" }}>
            <Row className="forgot-mobile__top">
              <span>
                <Icon
                  className="kfintech-purple-text lighten-4 HeadIcon"
                  left
                  small
                >
                  lock
                </Icon>
                <div>
                  <h5
                    class="kfintech-purple-text "
                    style={{ marginTop: "8px", marginBottom: "20px" }}
                  >
                    Forgot Password
                  </h5>
                  <p style={{ marginBottom: "10px" }}>
                    Enter your registered email address to change your password
                  </p>
                </div>
              </span>
            </Row>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <Row>
                <TextInput
                  onChange={handleEmailChange}
                  className={isSafari ? "safariBorder" : "inner-padding"}
                  type="text"
                  name="email"
                  value={input.email}
                  label="Enter the email"
                  s={12}
                  l={12}
                />

                <span
                  id="Error_email"
                  className="register-input__mobile-error-mail"
                ></span>
              </Row>

              <center>
                <Button
                  onClick={handleClick}
                  type="submit"
                  disabled={sent}
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  <span>Send</span>
                  <Icon tiny right>
                    send
                  </Icon>
                </Button>
              </center>

              <br />
              {sent && (
                <center>
                  <span>
                    Not Received mail?{" "}
                    <a
                      href="#"
                      onClick={resendPasswordLink}
                      class="link-style-a"
                    >
                      Resend OTP
                    </a>
                  </span>
                </center>
              )}
            </form>
          </Card>
        </div>
      </div>
    );
  }
}
export default ForgotPassword;
