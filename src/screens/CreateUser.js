import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  TextInput,
  Card,
  Icon,
  RadioGroup,
  Dropdown,
} from "react-materialize";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import validators from "../utils/validate";
import getSessionData from "../utils/getSessionData";
import isMobile from "../utils/mobile";
import {
  DIGIX_ADMIN_USERS,
  DATAENGINEERING_ADMIN_USERS,
  DATAUTILITY_ADMIN_USERS,
  QUEST_ADMIN_USERS,
  NPS_ADMIN_USERS
} from "../metadata";
import sendRequest from "../utils/sendRequest";

function CreateUser() {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phNumber: "",
    funds: "",
    subUserType: ""
  });
  let userData = getSessionData();
  const [userRadio, setUserRadio] = useState("Admin");
  const [textemails, setEmails] = useState([]);
  const [appName, setAppName] = useState(userData.adminForApp);
  let subUserType = userData?.app?.[appName]?.subUserType;

  const radioOptionsMap = {
    digix: DIGIX_ADMIN_USERS,
    dataUtility: DATAUTILITY_ADMIN_USERS,
    dataEngineering: DATAENGINEERING_ADMIN_USERS,
    quest: subUserType === 'Unit' ? QUEST_ADMIN_USERS[0] : subUserType === 'Audit' ? QUEST_ADMIN_USERS[1]: subUserType === 'AMC' ? QUEST_ADMIN_USERS[2]: QUEST_ADMIN_USERS[3],
    nps: NPS_ADMIN_USERS
  };
  const [radioOptions, setRadioOptions] = useState(
    radioOptionsMap[appName] || []
  );

  // eslint-disable-next-line
  useEffect(() => {
    // to validate emails, we need fund email domain
    let userAllowed = userData.isAdmin && userData.isKfinUser;
    let statusAllowed = userData.accountStatus === "Active";

    if (!(userAllowed && statusAllowed)) window.location.href = "/error404";
    sendRequest(`/api/getMetaData/getFundDomains`).then((res) => {
      const emails = res.data["result"];
      setEmails(emails);
    });
    // eslint-disable-next-line
  }, []);

  //--- check and register user --
  async function checkUser(newLogin) {
    const predicates = { email: newLogin.email };
    await sendRequest(`/api/auth/query/`, predicates).then((res = {}) => {
      let userFlag = res.data["count"] > 0;
      if (userFlag) {
        swal(
          "User already exists!",
          "Please check your mail if not activated",
          "warning"
        );
      } else {
        sendRequest(`/api/admin/createUser`, { payload: newLogin }).then(
          (res = {}) => {
            var msg = res.data["data"];

            if (msg === "done") {
              swal(
                "Account created!",
                "Please check your mail for further instructions",
                "success"
              ).then((value) => window.location.reload());
            } else {
              swal("something went wrong", "warning");
            }
          }
        );
      }
    });
  }

  //--- Handle change for each input values ---

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
    validators.validatePhone(value);
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

  // ---- validate everything at submit ----

  function validateFields(login) {
    return (
      validators.validateEmail(login.email, textemails) &&
      validators.validatePhone(login.phNumber) &&
      validators.validatePassword(login.password)
    );
  }

  // ----- handling of final register -----
  function handleClick(event) {
    event.preventDefault();
    // console.log(input);

    const newLogin = {
      firstName: input.firstName,
      lastName: input.lastName,
      phNumber: input.phNumber,
      password: input.password,
      email: input.email,
      userType: userRadio,
      status: "Approved",
      appName: appName,
      subUserType: subUserType
    };

    if (validateFields(newLogin)) {
      checkUser(newLogin);
    } else {
      swal(
        "Account not created!",
        "Make sure all the fields are properly filled",
        "warning"
      );
    }
  }

  function handleRadio(event) {
    const { value } = event.target;
    setUserRadio(value);
  }

  //----------------------------------------------------------------------
  if (!isMobile()) {
    return (
      <div className="card-container create-card-container">
        <Card className="z-depth-5 createuser-card neumorphCard">
          <Row>
            <Col>
              <Icon medium className="kfintech-purple-text lighten-4 HeadIcon">
                account_circle
              </Icon>
            </Col>
            <Col>
              <h4 class="center kfintech-purple-text ">Create an account</h4>
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
                  label="Type in your mobile number"
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

            <div id="radiorow">
              {/* <Row><label ><h6 className="createuser-radiotitle"> Select User Type</h6></label></Row> */}
              <RadioGroup
                label="User Type"
                name="UserType"
                id="radiogrp01"
                options={radioOptions}
                value={userRadio}
                onChange={handleRadio}
                withGap
              />
            </div>

            <center>
              <Button
                onClick={handleClick}
                type="submit"
                color="primary"
                size="lg"
                className="kfin-neu-btn__blue"
              >
                <span>Create Account</span>
                <Icon tiny right>
                  person_add
                </Icon>
              </Button>
            </center>
          </form>
        </Card>
      </div>
    );
  }
}
export default CreateUser;
