import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Row, Col, TextInput, Card, Icon } from "react-materialize";
import swal from "sweetalert";
import Loader from "../components/Loader";
import getSessionData from "../utils/getSessionData";
import setSessionData from "../utils/setSessionData";
import validators from "../utils/validate";
import isMobile from "../utils/mobile";
//import Address from '../utils/Address'
//import { isSafari } from "react-device-detect";
import sendRequest from "../utils/sendRequest";

function Activate() {
  let history = useHistory();
  const session = getSessionData();
  const [LoaderStat, setLoaderState] = useState(false);

  const token = window.location.href.split("==")[1];

  //eslint-disable-next-line
  useEffect(() => {
    (async () => {
      await checkStatusAndRedirect();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkStatusAndRedirect() {
    await sendRequest(`/api/activationToken/checkStatus`, {
      token: token,
    }).then((res) => {
      let status = res.data["status"];
      if (status === false || token === undefined) {
        history.push({ pathname: "/error404" });
      }
    });
  }

  const [input, setInput] = useState({
    otp: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  async function verifyOtp() {
    const Verify = {
      otp: input.otp,
      token: token,
    };
    await sendRequest(`/api/activationToken/activateUser`, Verify).then(
      (res = {}) => {
        if (res.data["otpVerified"] === true) {
          setLoaderState(false);
          swal(
            "Account is Activated",
            "Please Login to raise fund access request",
            "success"
          ).then((value) => {
            if (session.isLoggedIn) {
              session.status = "Pending";

              setSessionData(session);

              history.push({
                pathname: "/AccessRequest",
              });
            } else {
              history.push({
                pathname: "/Login",
              });
            }
          });
        } else {
          setLoaderState(false);
          swal("Wrong OTP!", "Please check & re-enter the otp ", "error");
        }
      }
    );
    //--------------------------------------------------------------
  }

  function handleClick(event) {
    setLoaderState(true);
    event.preventDefault();
    if (validators.validateOtp(input.otp)) {
      verifyOtp();
    } else {
      setLoaderState(false);
      swal("Please enter an OTP", "You have not entered any otp", "warning");
    }
  }

  function resend(event) {
    setLoaderState(true);
    event.preventDefault();

    const data = {
      token: token,
      option: "otpresend",
    };

    sendRequest(`/api/activationToken/resendlink`, data).then((res = {}) => {
      const stat = res.data["stat"];
      if (stat) {
        setLoaderState(false);
        swal("OTP sent Successfully", "please check your email", "success");
      } else {
        setLoaderState(false);
        swal("something went wrong", "sorry! please re-try it", "warning");
      }
    });
  }

  const CardStyle = {
    width: "40%",
    margin: "50px",
  };

  if (!isMobile()) {
    return (
      <div>
        <Loader value={LoaderStat} />

        <div className="card-container">
          <Card className="z-depth-5 neumorphCard" style={CardStyle}>
            <Row>
              <Col>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <Icon
                    className="kfintech-purple-text lighten-4 HeadIcon"
                    left
                    medium
                  >
                    password
                  </Icon>
                  <h4 class="center kfintech-purple-text ">Enter the OTP</h4>
                </span>
              </Col>
            </Row>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <center>
                <Row>
                  <Col s={4} l={4}></Col>
                  <TextInput
                    onChange={handleChange}
                    className="inner-padding activate-input"
                    name="otp"
                    value={input.otp}
                    label="Enter the OTP"
                    s={5}
                    l={5}
                  />
                  <span id="Error_otp"></span>
                  <Col s={4} l={4}></Col>
                </Row>
              </center>

              <center>
                <Button
                  onClick={handleClick}
                  type="submit"
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  <span>Activate</span>
                  <Icon tiny right>
                    task_alt
                  </Icon>
                </Button>
              </center>
              <br />
              <center>
                Didn't recieve a mail?{" "}
                <a href="#" onClick={resend} className="link-style-a">
                  Resend It
                </a>
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

        <div className="card-container">
          <Card className="z-depth-5 neumorphCard" style={{ width: "90%" }}>
            <Row className="activate-mobile__top">
              <Icon
                className="kfintech-purple-text lighten-4 HeadIcon"
                left
                small
              >
                password
              </Icon>
              <h5
                class="center kfintech-purple-text "
                style={{ marginLeft: "-50px" }}
              >
                Enter the OTP
              </h5>
            </Row>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              <Row>
                <Col s={2} l={2}></Col>

                <center>
                  <TextInput
                    onChange={handleChange}
                    className="inner-padding"
                    name="otp"
                    value={input.otp}
                    label="Enter the OTP"
                    s={8}
                    l={8}
                  />
                </center>
                <span id="Error_otp"></span>
              </Row>

              <center>
                <Button
                  onClick={handleClick}
                  type="submit"
                  color="primary"
                  size="lg"
                  className="kfin-neu-btn__blue"
                >
                  <span>Activate</span>
                  <Icon tiny right>
                    task_alt
                  </Icon>
                </Button>
              </center>
              <br />
              <center>
                Not Received mail?{" "}
                <a href="#" onClick={resend} className="link-style-a">
                  Resend It
                </a>
              </center>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}
export default Activate;
