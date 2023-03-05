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
import ReactSelectGroup from "../../components/ReactSelectGroup";
import mapValuesToOption from "../../utils/mapper";
import sendRequest from "../../utils/sendRequest";

function AccessRequestDataEngineering() {
  // --------- state declarations and session data get -------------------
  let history = useHistory();

  const [LoaderStat, setLoaderState] = useState(false);
  const [fundNames, setFundNames] = useState([]);
  const [optionState, setOptionState] = useState(true);
  const [data, setData] = useState({
    fund: [],
    permissions: [],
  });

  let { firstName, lastName, email, isLoggedIn, app } = useMemo(
    () => getSessionData(),
    []
  );

  let status = app.dataEngineering ? app.dataEngineering.userStatus : "";

  const [pendingCardStatus, setPendingCardStatus] = useState(
    status === "Pending" ? true : false
  );

  const domain = email.split("@")[1];

  const permissions = [
    { label: "Read", value: "Read" },
    { label: "Write", value: "Write" },
    { label: "Modify", value: "Modify" },
  ];

  useEffect(async () => {
    if (!isLoggedIn) history.push({ pathname: "/Login" });
    if (status === "PreActivation" || domain != "kfintech.com")
      history.push({ pathname: "/AccessDenied" });

    await getFunds().then((fundArr) => {
      switch (status) {
        case "Pending":
          var dataEngineeringPendingFunds =
            app?.dataEngineering?.pendingControl.funds;
          if (dataEngineeringPendingFunds?.length) {
            data.fund = mapValuesToOption(
              fundArr,
              app?.dataEngineering?.pendingControl.funds
            );
          }
          var dataEngineeringPendingControl =
            app?.dataEngineering?.pendingControl.permissions;
          if (dataEngineeringPendingControl?.length) {
            data.permissions = mapValuesToOption(
              fundArr,
              app?.dataEngineering?.pendingControl.permissions
            );
          }
          break;
        case "Approved" || "Rejected":
          var dataEngineeringApprovedFunds =
            app?.dataEngineering?.approvedControl.funds;

          if (dataEngineeringApprovedFunds?.length) {
            data.fund = mapValuesToOption(
              fundArr,
              app?.dataEngineering?.approvedControl.funds
            );
          }
          var dataEngineeringapprovedControl =
            app?.dataEngineering?.approvedControl.permissions;
          if (dataEngineeringapprovedControl?.length) {
            data.permissions = mapValuesToOption(
              fundArr,
              app?.dataEngineering?.approvedControl.permissions
            );
          }
      }
      console.log("Funds loaded");
      console.log("Data.fund", data.fund);
      prefillToUpdate();
      setData({ ...data });
      setLoaderState(false);
    });
    console.log("Data.fund", data.fund);
    setData({ ...data });
    setLoaderState(false);
  }, []);

  const prefillToUpdate = () => {
    (async function () {
      var fundData = await sendRequest("/api/getMetaData/getFundNames");
      fundData = fundData.data["result"];
      var funds = [];
      var userDataQuery = {
        email: email,
        appName: "dataEngineering",
        status: status,
      };
      var userData = await sendRequest(
        `/api/userData/getParticularUserData`,
        userDataQuery
      );
      fundData.forEach((element) => {
        if (domain == "kfintech.com") {
          funds.push({ label: element.fundName, value: element.fundCode });
        } else if (domain === element.domain) {
          funds.push({ label: element.fundName, value: element.fundCode });
        }
      });
      console.log("update");
      userData = userData.data["data"];
      data.fund =
        userData.funds[0] == "*"
          ? funds
          : mapValuesToOption(funds, userData.funds);
      data.permissions = userData.permissions;
      setData({ ...data });
    })();
  };

  const getFunds = () =>
    new Promise((resolve, reject) => {
      let funds = [];
      // setLoaderState(true);

      sendRequest(`/api/getMetaData/getFundNames`)
        .then((res) => {
          const fundData = res.data["result"];
          fundData.forEach((element) => {
            if (domain === "kfintech.com") {
              funds.push({ label: element.fundName, value: element.fundCode });
            } else if (domain === element.domain) {
              funds.push({ label: element.fundName, value: element.fundCode });
            }
          });

          setFundNames(funds);

          resolve(funds);
        })
        .catch((err) => {
          setLoaderState(false);
          reject();
          console.log(err);
        });
    });

  // //-------------This function sends data to db ------------------
  function saveAccessData(data) {
    sendRequest(`/api/userData/mfAccessData`, data).then((res = {}) => {
      let msg = res.data["result"];
      if (msg === "done") {
        setLoaderState(false);

        let sdata = getSessionData();
        console.log(sdata);
        console.log("data.fund", data.funds);

        sdata.app.dataEngineering === undefined
          ? (sdata.app["dataEngineering"] = {
              userStatus: "Pending",
              pendingControl: {
                funds: data.funds.map((fund) => {
                  return fund.value;
                }),
                permissions: data.permissions.map((permission) => {
                  return permission.value;
                }),
              },
            })
          : (sdata.app.dataEngineering.userStatus = "Pending");
        console.log("NEW SDATA", sdata);

        setSessionData(sdata);
        swal(
          "Sent For Approval",
          "You will be notified once approved",
          "success"
        ).then(() => {
          history.push({ pathname: "/Home" });
        });
      } else {
        setLoaderState(false);
        swal("Something went wrong", "warning");
      }
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoaderState(true);

    const allFundCodes = fundNames.map((fund) => fund.code);
    const mfData = {
      funds: data.fund[0] === "*" ? allFundCodes : data.fund,
      permissions: data.permissions,
      email: email,
      status: "Pending",
      appName: "dataEngineering",
      userType: "User",
    };
    setPendingCardStatus(true);
    saveAccessData(mfData);

    console.log(getSessionData());
  };

  return (
    <div>
      <Loader value={LoaderStat} />

      <div className="card-select-dropdown-neu ">
        <Row id="selectrow" className="accessRequest-input__half">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "465px", marginLeft: "10px" }}>
              <ReactSelect
                allOptions={fundNames}
                options={data}
                setOptions={setData}
                placeholder="Select Funds"
                Name="fund"
                Updater={() => console.log("Fund Selected")}
                label="Funds"
              />
            </div>

            <span style={{ width: "25px" }} />

            <div style={{ width: "465px", marginLeft: "10px" }}>
              <ReactSelect
                allOptions={permissions}
                options={data}
                setOptions={setData}
                placeholder="Select Permissions"
                Name="permissions"
                updater={() => console.log("Permission Selected")}
                label="Permissions"
              />
            </div>
          </div>
        </Row>
      </div>

      <center>
        <Button
          onClick={handleSubmit}
          type="submit"
          color="primary"
          size="lg"
          className="kfin-neu-btn__blue"
        >
          <span>Submit</span>
          <Icon tiny right>
            send
          </Icon>
        </Button>
      </center>
    </div>
  );
}

export default AccessRequestDataEngineering;
