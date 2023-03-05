import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  TextInput,
  Card,
  Icon,
  Select,
} from "react-materialize";
import swal from "sweetalert";
import getSessionData from "../../utils/getSessionData";
import setSessionData from "../../utils/setSessionData";
import Loader from "../../components/Loader";
import isMobile from "../../utils/mobile";
import ReactSelect from "../../components/ReactSelect";
import AccessRequestDigix from "./AccessRequestDigix";
import AccessRequestDataEngineering from "./AccessRequestDataEngineering";
import AccessRequestDataUtilityTool from "./AccessRequestDataUtilityTool.js";
import PendingMsgCard from "./PendingMsgCard";
import AccessRequestQuest from "./AccessRequestQuest";
import AccessRequestNps from "./AccessRequestNps";

function AccessRequest() {
  // --------- state declarations and session data get -------------------

  let sessionData = useMemo(() => getSessionData(), []);

  const appNames = {
    dataUtility: "Data Utility",
    dataEngineering: "Data Engineering",
    digix: "Digix",
    quest: "Quest",
    nps: "Nps"
  };

  useEffect(() => {
    const statusAllowed = sessionData.accountStatus === "Active";

    if (!statusAllowed) window.location.href = "/error404";
  }, []);

  let { firstName, lastName, email } = sessionData || {};

  let appName = localStorage.getItem("appName");

  //console.log("executed");
  //console.log("STATUS === ", sessionData.app[appName]?.userStatus);
  //------------------------------------------------------------------

  return (
    <div>
      {sessionData?.app?.[appName]?.userStatus === "Pending" && (
        <PendingMsgCard />
      )}

      <div class="card-container card-container-accesReuqest">
        <Card className="z-depth-5 accessRequest neumorphCard">
          <Row>
            <Col>
              <Icon medium className="kfintech-purple-text lighten-4 HeadIcon">
                assignment_ind
              </Icon>
            </Col>
            <Col>
              <h4
                class="center kfintech-purple-text "
                className="accessRequestTitle"
              >
                {`${appNames[appName]} Access Request`}
              </h4>
            </Col>
          </Row>

          <Row className="accessRequest-input__half">
            <TextInput
              id="fullName"
              className="inner-padding"
              name="fullName"
              value={firstName + " " + lastName}
              disabled="true"
              label="Full name"
              s="6"
              l="6"
            />
            <span style={{ width: "25px" }}></span>
            <TextInput
              id="email"
              className="inner-padding"
              email
              name="email"
              value={email}
              disabled="true"
              label="Email"
              validate
              s="6"
              l="6"
            />
          </Row>

          {appName == "digix" && (
            <AccessRequestDigix userDetails={sessionData} />
          )}
          {appName == "dataEngineering" && (
            <AccessRequestDataEngineering userDetails={sessionData} />
          )}
          {appName == "dataUtility" && (
            <AccessRequestDataUtilityTool userDetails={sessionData} />
          )}

          {appName == "quest" && (
            <AccessRequestQuest userDetails={sessionData} />
          )}

          {appName == "nps" && (
            <AccessRequestNps userDetails={sessionData} />
          )}
        </Card>
      </div>
    </div>
  );
}
export default AccessRequest;
