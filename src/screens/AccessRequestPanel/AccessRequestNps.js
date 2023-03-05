import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Button, Icon } from "react-materialize";
import swal from "sweetalert";
import getSessionData from "../../utils/getSessionData";
import setSessionData from "../../utils/setSessionData";
import Loader from "../../components/Loader";
import ReactSelect from "../../components/ReactSelect";
import ReactSelectSingle from "../../components/ReactSelectSingle";
import mapValuesToOption from "../../utils/mapper";
import "../../css/accessRequestDigix.css";
import sendRequest from "../../utils/sendRequest";

const AccessRequestNps = ({ userDetails }) => {
  let { email, isLoggedIn, app, isKfinUser } = userDetails;

  const domain = email.split("@")[1];
  // Status controls what data to be shown as selected in dropdowns. (pending/approved)
  var status = app?.["nps"]?.["userStatus"];
  var status = "Pending";

  let history = useHistory();
  // Used to show the options in the dropdown
  const [userType, setUserType] = useState(app?.["nps"]?.["userType"]);
  const [LoaderStat, setLoaderState] = useState(true);
  // Data is used to record users request to send to backend;
  const [data, setData] = useState({
    usertype: "",
  });

  let userTypes = [];
  userTypes = isKfinUser
    ? [
        { label: "User", value: "User" },
        { label: "Checker", value: "Checker" },
        { label: "Auditor", value: "Auditor" },
      ]
    : [{ label: "AMC", value: "AMC" }];

  useEffect(() => {
    const usersAllowed = userType !== "Admin";
    const condition = isLoggedIn && usersAllowed;

    if (!condition) {
      history.push({ pathname: "/Error404" });
      return;
    }

    let funds = [];

    sendRequest(`/api/getMetaData/getFundNames`).then((res) => {
      const fundData = res.data["result"];

      fundData.forEach((element) => {
        if (domain === "kfintech.com") {
          funds.push({ label: element.fundName, value: element.fundCode });
        } else if (domain === element.domain) {
          funds.push({ label: element.fundName, value: element.fundCode });
        }
      });

      if (!isKfinUser) {
        data.fund = funds;
        data.usertype = { label: "AMC", value: "AMC" };
        setData({ ...data });
      } else {
        let getParticularUserDataQuery = {
          email: email,
          status: status,
          appName: "nps",
        };
        sendRequest(
          `/api/userData/getParticularUserData`,
          getParticularUserDataQuery
        ).then((res) => {
          const udata = res["data"].data;
          console.log("DATA ====", udata);
          if (udata?.userStatus !== "noAccess") {
            // data.fund = mapValuesToOption(funds, udata.funds);
            data.usertype = { label: udata.userType, value: udata.userType };

            setData({ ...data });
          }
        });
      }
      // setfundnames(funds);
    });
    setLoaderState(false);
  }, []);

  // Send the data object to backend to record request
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoaderState(true);
    // console.log("selections = ", data);

    const mfData = {
      email: email,
      userType: data.usertype,
      status: "Pending",
      appName: "nps",
    };
    console.log("MFDATA = ", mfData);
    saveAccessData(mfData);
  };

  /**
   * Sends the current response data to the user
   * @param {} data
   */
  function saveAccessData(data) {
    sendRequest(`/api/userData/mfAccessData`, data)
      .then((res = {}) => {
        let msg = res.data["result"];
        setLoaderState(false);
        if (msg === "done") {
          let sdata = getSessionData();
          if (!sdata?.nps) {
            sdata = {
              ...sdata,
              app: {
                ...sdata.app,
                nps: {
                  userType: data.userType,
                  userStatus: "Pending",
                },
              },
            };
          } else {
            sdata.app["nps"].userStatus = "Pending";
          }
          setSessionData(sdata);
          status = "Pending";
          swal(
            "Sent For Approval",
            "You will be notified once approved",
            "success"
          ).then(() => {
            history.push({ pathname: "/Home" });
          });
        } else {
          swal("Something went wrong", "warning");
        }
      })
      .catch((err) => {
        setLoaderState(false);
        console.log(err);
        swal(
          "Something Went wrong",
          "your account might be not activated or you have already sent a request :::",
          "warning"
        );
      });
  }

  return (
    <div>
      <Loader value={LoaderStat} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ width: "232px" }}></span>
        <div style={{ width: "465px", marginLeft: "10px" }}>
          <ReactSelectSingle
            allOptions={userTypes}
            options={data}
            setOptions={setData}
            placeholder="Select Usertype"
            Name="usertype"
            label="Usertype"
            disabled={domain !== "kfintech.com" ? true : false}
          />
        </div>
        <span style={{ width: "232px" }}></span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          marginBottom: "30px",
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
};

export default AccessRequestNps;
