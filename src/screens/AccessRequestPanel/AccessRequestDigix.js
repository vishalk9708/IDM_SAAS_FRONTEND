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
import { RadioGroup } from "react-materialize";
import "../../css/accessRequestDigix.css";
import PendingMsgCard from "./PendingMsgCard";
import sendRequest from "../../utils/sendRequest";

const AccessRequestDigix = ({ userDetails }) => {
  const commonOption = { label: "Please Select Funds", value: "" };
  // Basic details of the User.
  let { firstName, lastName, email, userId, isLoggedIn, app } = userDetails;
  const domain = email.split("@")[1];
  // Status controls what data to be shown as selected in dropdowns. (pending/approved)
  var status = app?.["digix"]?.["userStatus"];
  // Variable to know if the user is a User, Auditor or Checker
  const userType = app?.["digix"]?.["userType"];
  let history = useHistory();
  // Used to show the options in the dropdown
  const [fundnames, setfundnames] = useState([]);
  // Used to show branch options in dropdown
  const [branchnames, setbranchnames] = useState([commonOption]);
  // Used to show investor names in dropdown
  const [investornames, setinvestornames] = useState([commonOption]);
  // Used to show distributor names in dropdown
  const [distributornames, setdistributornames] = useState([commonOption]);
  // Used to show the reports names in the dropdown
  const [reportnames, setReportnames] = useState({
    regulatoryReports: [],
    dailyReports: [],
    dynamicReports: [],
  });
  const [digixUserType, setDigixUserType] = useState("");
  const [LoaderStat, setLoaderState] = useState(true);
  // Data is used to record users request to send to backend;
  const [data, setData] = useState({
    fund: [],
    branch: [],
    investor: [],
    distributor: [],
    report: [],
    userType: userType,
  });

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

      if (domain === "kfintech.com") {
        var getParticularUserDataQuery = {
          email: email,
          status: status,
          appName: "digix",
        };
        sendRequest(
          `/api/userData/getParticularUserData`,
          getParticularUserDataQuery
        )
          .then((res) => {
            var userData = res.data["data"];
            data.fund =
              userData.funds[0] == "*"
                ? funds
                : mapValuesToOption(funds, userData.funds);
            data.userType = userData.userType;
            setData({ ...data });
            setDigixUserType(userData.userType);
            updateElemets(data.fund.map((f) => f.value));
            prefillToUpdate();
          })
          .catch((err) => console.log("Error in getting predicate", err));
      } else {
        let getParticularUserDataQuery = {
          email: email,
          status: status,
          appName: "digix",
        };
        sendRequest(
          `/api/userData/getParticularUserData`,
          getParticularUserDataQuery
        ).then((res) => {
          data.fund = funds;
          setData({ ...data });
          updateElemets([funds[0].value]);
          prefillToUpdate();
        });
      }
      setfundnames(funds);
    });
    setLoaderState(false);
  }, []);

  /**
   * Function prefills the request form with the current user's state.
   * If the user is in Approved state: Approved controls are shown to the user
   * If the user is in Pending state: Pending controls are shown to the user
   * If the user's request was Rejected: Approved controls are shown to the user.
   * @param {} result
   */
  const prefillToUpdate = () => {
    var getParticularUserDataQuery = {
      email: email,
      status: status,
      appName: "digix",
    };
    var fundMetaData = {};
    var currentUserRequest = {};
    (async function () {
      try {
        let fundMetaDataQuery = {
          fundCodes: data.fund.map((element) => element.value),
          domain: domain,
        };
        fundMetaData = await sendRequest(
          `/api/userData/getAccessRequestData`,
          fundMetaDataQuery
        );
        fundMetaData = fundMetaData.data["result"];
        currentUserRequest = await sendRequest(
          `/api/userData/getParticularUserData`,
          getParticularUserDataQuery
        );
        currentUserRequest = currentUserRequest.data["data"];
        setDigixUserType(currentUserRequest.userType);
        if (domain !== "kfintech.com") {
          data.investor =
            currentUserRequest.investors[0] == "*"
              ? [{ label: "All Investor Categories", value: "*" }]
              : mapValuesToOption(
                  fundMetaData?.investorCategories,
                  currentUserRequest.investors
                );
          data.branch = [{ label: "All Branches", value: "*" }];
          data.distributor =
            currentUserRequest.distributors[0] == "*"
              ? [{ label: "All Distributor Categories", value: "*" }]
              : mapValuesToOption(
                  fundMetaData?.distributors,
                  currentUserRequest.distributors
                );
          setData({ ...data });
        } else {
          data.branch = [{ label: "All Branches", value: "*" }];
          data.distributor = [{ label: "All Distributors", value: "*" }];
          data.investor = [{ label: "All Investors", value: "*" }];
          setData({ ...data });
          setbranchnames([{ label: "All Branches", value: "*" }]);
          setinvestornames([{ label: "All Investors", value: "*" }]);
          setdistributornames([{ label: "All Distributors", value: "*" }]);
        }
        let allReg =
          currentUserRequest?.reports?.regulatoryReports[0] === "*"
            ? fundMetaData?.reportNames.regulatoryReports.map((r) => r.label)
            : currentUserRequest?.reports?.regulatoryReports;

        let alldaily =
          currentUserRequest?.reports?.dailyReports[0] === "*"
            ? fundMetaData?.reportNames.dailyReports.map((r) => r.label)
            : currentUserRequest?.reports?.dailyReports;

        var regReports = allReg?.map((report) => ({
          label: report,
          value: `regulatory--${report}`,
        }));

        var dailyReports = alldaily?.map((report) => ({
          label: report,
          value: `daily--${report}`,
        }));
        let reportsArr = [...regReports, ...dailyReports];

        if (currentUserRequest?.reports?.dynamicReports)
          reportsArr.push({
            label: "Dynamic Reports Access",
            value: "dynamic",
          });

        data.report = reportsArr;
        setData({ ...data });
      } catch (err) {
        console.log("Error in getting fund metadata", err);
      }
    })();
  };

  /**
   * Function to update the options to be shown to user based
   * on user type
   * @param {*} value
   */
  const updateElemets = async (value) => {
    setLoaderState(true);

    if (value.length < 1) {
      setbranchnames([commonOption]);
      setinvestornames([commonOption]);
      setdistributornames([commonOption]);
      setReportnames({
        regulatoryReports: [],
        dailyReports: [],
        dynamicReports: [],
      });
      setLoaderState(false);
    } else {
      try {
        let fundMetaDataQuery = {
          fundCodes: value,
          domain: domain,
        };
        sendRequest(
          `/api/userData/getAccessRequestData`,
          fundMetaDataQuery
        ).then((res = {}) => {
          const result = res.data["result"];

          if (domain !== "kfintech.com") {
            setbranchnames([{ label: "All Branches", value: "*" }]);
            setinvestornames(result?.investorCategories);
            setdistributornames(result?.distributors);
            setReportnames(result?.reportNames);
            data.branch = [{ label: "All Branches", value: "*" }];
          } else {
            setbranchnames([{ label: "All Branches", value: "*" }]);
            setinvestornames([{ label: "All Investors", value: "*" }]);
            setdistributornames([{ label: "All Distributors", value: "*" }]);
            data.branch = [{ label: "All Branches", value: "*" }];
            data.investor = [{ label: "All Investors", value: "*" }];
            data.distributor = [{ label: "All Distributors", value: "*" }];
            setReportnames(result?.reportNames);
            setData({ ...data });
          }

          setLoaderState(false);
        });
      } catch (err) {
        setLoaderState(false);
      }
    }
  };

  // Send the data object to backend to record request
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoaderState(true);
    const processedData = processData(data);

    if (processedData.funds.length === 0) {
      swal("Fields can't be empty", " ", "warning");
      setLoaderState(false);
      return;
    }

    const mfData = {
      ...processedData,
      email: email,

      status: "Pending",
      appName: "digix",
    };
    console.log(mfData);
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
          sdata.app["digix"].userStatus = "Pending";
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

  const processData = (unstructuredData) => {
    console.log(unstructuredData);
    const processed = {
      funds: unstructuredData?.fund.map((fund) => fund.value),
      branches: unstructuredData?.branch.map((branch) => branch.value),
      investors: unstructuredData?.investor.map((investor) => investor.value),
      distributors: unstructuredData?.distributor.map(
        (distributor) => distributor.value
      ),
      userType: digixUserType,
      reports: {
        regulatoryReports: [],
        dailyReports: [],
        dynamicReports: false,
      },
    };
    if (data?.branch.length === branchnames.length) processed.branches = ["*"];
    if (data?.investor.length === investornames.length)
      processed.investors = ["*"];
    if (data?.distributor.length === distributornames.length)
      processed.distributors = ["*"];

    unstructuredData?.report.forEach((report) => {
      console.log(report.value.split("--"));
      if (report.value == "dynamic") {
        processed.reports.dynamicReports = true;
      } else if (report.value.split("--")[0] === "regulatory") {
        processed.reports.regulatoryReports.push(report.label);
      } else if (report.value.split("--")[0] === "daily") {
        processed.reports.dailyReports.push(report.label);
      }
    });
    if (
      reportnames.regulatoryReports.length ===
      processed.reports.regulatoryReports.length
    ) {
      processed.reports.regulatoryReports = ["*"];
    }

    if (
      reportnames.dailyReports.length === processed.reports.dailyReports.length
    ) {
      processed.reports.dailyReports = ["*"];
    }
    console.log("Processed", processed);
    return processed;
  };

  const handleChangeInUserType = (event) => {
    try {
      var { value } = event.target;
      setDigixUserType(value);
      data.userType = value;
      setData({ ...data });
    } catch (error) {
      console.log("Error In handling user Type change");
    }
  };

  return (
    <div>
      <Loader value={LoaderStat} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "465px", marginLeft: "10px" }}>
          <ReactSelect
            allOptions={fundnames}
            options={data}
            setOptions={setData}
            placeholder="Select Funds"
            Name="fund"
            Updater={(codes) => updateElemets(codes)}
            label="Funds"
            disabled={domain !== "kfintech.com" ? true : false}
          />
        </div>
        <span style={{ width: "25px" }} />
        <div style={{ width: "465px", marginLeft: "10px" }}>
          <ReactSelectGroup
            allOptions={reportnames}
            options={data}
            setOptions={setData}
            Name="report"
            placeholder="Select Report Names"
            label="Reports"
            disabled={false}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <div style={{ flex: 1, marginLeft: "10px", maxWidth: "300px" }}>
          <ReactSelect
            allOptions={branchnames}
            options={data}
            setOptions={setData}
            Name="branch"
            placeholder="Select Branches"
            label="Branches"
            disabled={true}
          />
        </div>
        <span style={{ width: "25px" }}></span>
        <div style={{ flex: 1, marginLeft: "10px", maxWidth: "300px" }}>
          <ReactSelect
            allOptions={investornames}
            options={data}
            setOptions={setData}
            placeholder="Select Investor Categories"
            Name="investor"
            label="Investor Categories"
            disabled={domain === "kfintech.com" ? true : false}
          />
        </div>
        <span style={{ width: "25px" }}></span>
        <div style={{ flex: 1, marginLeft: "10px", maxWidth: "300px" }}>
          <ReactSelect
            allOptions={distributornames}
            options={data}
            setOptions={setData}
            placeholder="Select Distributor Categories"
            Name="distributor"
            label="Distributor Categories"
            disabled={domain === "kfintech.com" ? true : false}
          />
        </div>
      </div>
      {domain === "kfintech.com" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          <RadioGroup
            label="User Type"
            name="UserType"
            id="radiogrp01"
            options={[
              {
                label: "User",
                value: "User",
              },
              {
                label: "Auditor",
                value: "Auditor",
              },
              {
                label: "Checker",
                value: "Checker",
              },
            ]}
            value={digixUserType}
            onChange={handleChangeInUserType}
            withGap
            radioClassNames="userTypeRadioGroup"
          />
        </div>
      ) : (
        <></>
      )}

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

export default AccessRequestDigix;
