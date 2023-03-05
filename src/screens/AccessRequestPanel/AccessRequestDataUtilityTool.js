import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Button, Row, Card, Icon } from "react-materialize";
import swal from "sweetalert";
import getSessionData from "../../utils/getSessionData";
import setSessionData from "../../utils/setSessionData";
import Loader from "../../components/Loader";
import ReactSelect from "../../components/ReactSelect";
import mapValuesToOption from "../../utils/mapper";
import PendingMsgCard from "./PendingMsgCard";
import sendRequest from "../../utils/sendRequest";

function AccessRequestDataUtilityTool({ userDetails }) {
  // --------- state declarations and session data get -------------------
  let history = useHistory();
  const [LoaderStat, setLoaderState] = useState(false);
  const [fundNames, setFundNames] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [data, setData] = useState({
    fund: [],
    permissions: [],
  });
  let { firstName, lastName, email, isLoggedIn, app } = userDetails;
  console.log("USER DETAILS-- ", userDetails);

  let status = app.dataUtility ? app.dataUtility.userStatus : "";
  const [pendingCardStatus, setPendingCardStatus] = useState(
    status === "Pending" ? true : false
  );
  const domain = email.split("@")[1];

  // const permissions = [
  //   { label: "global_agent_master", value: "global_agent_master" },
  //   { label: "global_asset_master", value: "global_asset_master" },
  //   { label: "global_city_mapping", value: "global_city_mapping" },
  //   { label: "global_country_mapping", value: "global_country_mapping" },
  //   { label: "global_intra_scheme", value: "global_intra_scheme" },
  //   { label: "global_state_mapping", value: "global_state_mapping" },
  //   { label: "global_mcr_master", value: "global_mcr_master" },
  // ];

  useEffect(async () => {
    console.log("Use Effect");
    if (!isLoggedIn) history.push({ pathname: "/Login" });
    if (status === "PreActivation" || domain != "kfintech.com")
      history.push({ pathname: "/AccessDenied" });

    await sendRequest("api/appMetaData/getappdata", { appName: "dataUtility" })
      .then(({ data }) => {
        let formattedPermissions = data?.appData?.permissions.map((p) => ({
          label: p,
          value: p,
        }));
        console.log("------permissions--------", formattedPermissions);
        setPermissions(formattedPermissions);
      })
      .catch((err) => {
        console.log(err);
      });

    await getFunds().then((fundArr) => {
      switch (status) {
        case "Pending":
          var dataUtilityPendingFunds = app?.dataUtility?.pendingControl.funds;

          if (dataUtilityPendingFunds?.length) {
            data.fund = mapValuesToOption(
              fundArr,
              app?.dataUtility?.pendingControl.funds
            );
          }
          var dataUtilityPendingControl =
            app?.dataUtility?.pendingControl.permissions;
          if (dataUtilityPendingControl?.length) {
            data.permissions = mapValuesToOption(
              fundArr,
              app?.dataUtility?.pendingControl.permissions
            );
          }
          break;
        case "Approved" || "Rejected":
          var dataUtilityApprovedFunds =
            app?.dataUtility?.approvedControl.funds;

          if (dataUtilityApprovedFunds?.length) {
            data.fund = mapValuesToOption(
              fundArr,
              app?.dataUtility?.approvedControl.funds
            );
          }
          var dataUtilityapprovedControl =
            app?.dataUtility?.approvedControl.permissions;
          if (dataUtilityapprovedControl?.length) {
            data.permissions = mapValuesToOption(
              fundArr,
              app?.dataUtility?.approvedControl.permissions
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
        appName: "dataUtility",
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
      console.log("Metadata set executed fund");
      sendRequest(`/api/getMetaData/getFundNames`)
        .then((res) => {
          const fundData = res.data["result"];
          fundData.forEach((element) => {
            if (domain === "kfintech.com")
              funds.push({ label: element.fundName, value: element.fundCode });
            else if (domain === element.domain) {
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

  //   //-------------This function sends data to db ------------------
  function saveAccessData(data) {
    sendRequest(`/api/userData/mfAccessData`, data).then((res = {}) => {
      let msg = res.data["result"];
      if (msg === "done") {
        setLoaderState(false);

        let sdata = getSessionData();
        console.log("Session Data", sdata);
        console.log("data.fund", data.funds);

        sdata.app.dataUtility === undefined
          ? (sdata.app["dataUtility"] = {
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
          : (sdata.app.dataUtility.userStatus = "Pending");
        console.log("NEW SESSION DATA", sdata);

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
      appName: "dataUtility",
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
                placeholder="Select Global"
                Name="permissions"
                updater={() => console.log("Permission Selected")}
                label="Global Tables"
              />
            </div>
          </div>
        </Row>
      </div>

      <div
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      ></div>

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

export default AccessRequestDataUtilityTool;
