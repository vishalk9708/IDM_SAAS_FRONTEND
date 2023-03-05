import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import "../../css/modal.css";
import {
  Button,
  Row,
  Col,
  TextInput,
  Card,
  Icon,
  Select,
} from "react-materialize";
import { getFunds } from "../../utils/getFundNames";
import ReactSelect from "../../components/ReactSelect";
import ReactSelectGroup from "../../components/ReactSelectGroup";
import mapValuesToOption from "../../utils/mapper";
import { RadioGroup } from "react-materialize";
import swal from "sweetalert";
import sendRequest from "../../utils/sendRequest";

function DigixAdmin({
  appName,
  user,
  funds,
  handleSubmit,
  setOpenModal,
  cardType,
}) {
  const commonOption = { label: "Please Select Funds", value: "" };
  // Basic details of the User.
  let { firstName, lastName, email, isLoggedIn, app, userType } = user;
  var domain = email.split("@")[1];
  // Data is used to record users request to send to backend;
  const [data, setData] = useState({
    fund: [],
    branch: [],
    investor: [],
    distributor: [],
    report: [],
    userType: userType,
  });
  const [digixUserType, setDigixUserType] = useState(userType);
  var [fundnames, setfundnames] = useState([]);
  // Used to show branch options in dropdown
  var [branchnames, setbranchnames] = useState([commonOption]);
  // Used to show investor names in dropdown
  var [investornames, setinvestornames] = useState([commonOption]);
  // Used to show distributor names in dropdown
  var [distributornames, setdistributornames] = useState([commonOption]);
  // Used to show the reports names in the dropdown
  var [reportnames, setReportnames] = useState({
    regulatoryReports: [],
    dailyReports: [],
    dynamicReports: [],
  });
  const [LoaderStat, setLoaderState] = useState(true);
  function sendDecisionFunction(decision) {
    try {
      let funds = data.fund.map((fund) => fund.value);
      let distributor = data.distributor.map((dist) => dist.value);
      let investornames = data.investor.map((inv) => inv.value);
      let branches = data.branch.map((branch) => branch.value);
      let reports = {
        regulatoryReports: [],
        dailyReports: [],
        dynamicReports: false,
      };
      data.report.map((report) => {
        if (report.value === "dynamic") {
          reports.dynamicReports = true;
        } else {
          var category = report.value.split("--")[0];
          var reportName = report.value.split("--")[1];
          if (category === "regulatory")
            reports.regulatoryReports.push(reportName);
          else if (category === "daily") reports.dailyReports.push(reportName);
        }
      });

      if (
        reports.regulatoryReports.length ===
        reportnames.regulatoryReports.length
      )
        reports.regulatoryReports = ["*"];

      if (reports.dailyReports.length === reportnames.dailyReports.length)
        reports.dailyReports = ["*"];

      var form = {
        email: user.email,
        decision: decision.toLowerCase(),
        appName: appName,
        userType: digixUserType,
        funds: funds,
        distributors: distributor,
        investors: investornames,
        branches: branches,
        reports: reports,
      };
      console.log(form);
      handleSubmit(user.index, decision, form);
    } catch (error) {
      console.log(error);
      swal("Error", "Sorry, Something went wrong");
    }
  }

  function revokeUserAccess() {
    try {
      (async () => {
        const result = await sendRequest("/api/admin/revokeAccess", {
          email: email,
          appName: appName,
        });

        swal("Access revoked", "", "success").then(() => {
          setOpenModal(false);
        });
      })();
    } catch (err) {
      console.log(err);
      swal("Error", "Sorry, Something went wrong", "error");
      setLoaderState(false);
    }
  }

  function initialiseForAmc() {
    (async function () {
      try {
        console.log(user);
        data.fund = mapValuesToOption(funds, user.funds);
        data.report = [];

        var accessRequestDataQuery = {
          fundCodes: user.funds,
          domain: domain,
        };
        var accessRequestData = await sendRequest(
          "/api/userData/getAccessRequestData",
          accessRequestDataQuery
        );
        accessRequestData = accessRequestData.data.result;
        data.branch = [{ label: "All Branches", value: "*" }];
        user.distributors.map((distributor) => {
          if (distributor === "*") {
            data.distributor = accessRequestData.distributors;
          } else {
            data.distributor.push({ label: distributor, value: distributor });
          }
        });
        user.investors.map((investor) => {
          if (investor === "*")
            data.investor = accessRequestData.investorCategories;
          else data.investor.push({ label: investor, value: investor });
        });
        distributornames = accessRequestData.distributors;
        investornames = accessRequestData.investorCategories;
        reportnames.regulatoryReports =
          accessRequestData.reportNames.regulatoryReports;
        reportnames.dailyReports = accessRequestData.reportNames.dailyReports;
        reportnames.dynamicReports =
          accessRequestData.reportNames.dynamicReports;
        console.log("Reports === ", reportnames);

        if (user.reports.regulatoryReports[0] === "*") {
          reportnames.regulatoryReports.forEach((r) => data.report.push(r));
        } else {
          user.reports.regulatoryReports.map((report) => {
            data.report.push({ label: report, value: "regulatory--" + report });
          });
        }

        if (user.reports.dailyReports[0] === "*") {
          reportnames.dailyReports.forEach((r) => data.report.push(r));
        }
        user.reports.dailyReports.map((report) => {
          data.report.push({ label: report, value: "daily--" + report });
        });

        if (user.reports.dynamicReports)
          data.report.push({
            label: "Dynamic Report Access",
            value: "dynamic",
          });
        setData({ ...data });
        setbranchnames(branchnames);
        setinvestornames(investornames);
        setdistributornames(distributornames);
        setReportnames({ ...reportnames });
        setLoaderState(false);
      } catch (error) {
        console.log(error);
        swal("Error", "Sorry, Something went wrong", "error");
        setLoaderState(false);
      }
    })();
  }

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

  function initialiseForKfintech() {
    try {
      (async function () {
        data.fund = mapValuesToOption(funds, user.funds);
        data.report = [];

        var accessRequestDataQuery = {
          fundCodes: data.fund.map((element) => element.value),
          domain: domain,
        };
        var accessRequestData = await sendRequest(
          "/api/userData/getAccessRequestData",
          accessRequestDataQuery
        );
        console.log("Data : ", accessRequestData);
        accessRequestData = accessRequestData.data.result;
        branchnames = [{ label: "All Branches", value: "*" }];
        investornames = [{ label: "All Investor Categories", value: "*" }];
        distributornames = [
          { label: "All Distributor Categories", value: "*" },
        ];
        data.branch = [{ label: "All Branches", value: "*" }];
        data.distributor = [
          { label: "All Distributor Categories", value: "*" },
        ];
        data.investor = [{ label: "All Investor Categories", value: "*" }];
        reportnames.regulatoryReports =
          accessRequestData.reportNames.regulatoryReports;
        reportnames.dailyReports = accessRequestData.reportNames.dailyReports;
        reportnames.dynamicReports =
          accessRequestData.reportNames.dynamicReports;
        console.log("Reports === ", reportnames);
        console.log("User.reports = ", user.reports);
        if (user.reports.regulatoryReports[0] === "*") {
          reportnames.regulatoryReports.forEach((r) => data.report.push(r));
        } else {
          user.reports.regulatoryReports.map((report) => {
            data.report.push({ label: report, value: "regulatory--" + report });
          });
        }

        if (user.reports.dailyReports[0] === "*") {
          reportnames.dailyReports.forEach((r) => data.report.push(r));
        }
        user.reports.dailyReports.map((report) => {
          data.report.push({ label: report, value: "daily--" + report });
        });

        if (user.reports.dynamicReports)
          data.report.push({
            label: "Dynamic Report Access",
            value: "dynamic",
          });

        console.log("data = ", data);
        setData({ ...data });
        setbranchnames(branchnames);
        setinvestornames(investornames);
        setdistributornames(distributornames);
        setReportnames({ ...reportnames });
        setLoaderState(false);
      })();
    } catch (error) {
      console.log("error in initialising", error);
    }
  }

  function updateOnFundChange(value) {
    (async function () {
      try {
        setLoaderState(true);
        if (value.length < 1) {
          setReportnames({
            regulatoryReports: [],
            dailyReports: [],
            dynamicReports: [],
          });
          setLoaderState(false);
        } else {
          let fundMetaDataQuery = {
            fundCodes: value,
            domain: domain,
          };
          var changeData = await sendRequest(
            "/api/userData/getAccessRequestData",
            fundMetaDataQuery
          );
          changeData = changeData.data.result;
          if (domain === "kfintech.com") {
            reportnames.regulatoryReports =
              changeData.reportNames.regulatoryReports;
            reportnames.dailyReports = changeData.reportNames.dailyReports;
            reportnames.dynamicReports = changeData.reportNames.dynamicReports;
            setReportnames({ ...reportnames });
            setLoaderState(false);
          } else {
            setLoaderState(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }

  useEffect(() => {
    try {
      if (domain === "kfintech.com") {
        initialiseForKfintech();
      } else {
        initialiseForAmc();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <Loader value={LoaderStat} />
      <div className="modalForm">
        <div className="titleContainerAdminModal">
          <h5 className="modalTitle">Digix</h5>
          <p style={{ color: "grey", marginRight: "20px" }}>
            Status : {user.userStatus}
          </p>
        </div>
        <div>
          <Row className="accessRequest-input__half">
            <TextInput
              id="fullName"
              className="inner-padding"
              name="fullName"
              value={user.firstName + " " + user.lastName}
              disabled={true}
              label="Full Name"
              s={6}
              l={6}
            />
            <span style={{ width: "25px" }}></span>
            <TextInput
              id="email"
              className="inner-padding"
              email
              name="email"
              value={user.email}
              disabled={true}
              label="Email"
              validate
              s={6}
              l={6}
            />
          </Row>
        </div>
        <div className="card-select-dropdown-neu ">
          <Row id="selectrow" className="accessRequest-input__half">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "410px", marginLeft: "10px" }}>
                <ReactSelect
                  allOptions={funds}
                  options={data}
                  setOptions={setData}
                  placeholder="Select Funds"
                  Name="fund"
                  Updater={(codes) => updateOnFundChange(codes)}
                  label="Funds"
                  disabled={domain === "kfintech.com" ? false : true}
                />
              </div>
              <span style={{ width: "25px" }} />
              <div style={{ width: "410px", marginLeft: "10px" }}>
                <ReactSelectGroup
                  allOptions={reportnames}
                  options={data}
                  setOptions={setData}
                  Name="report"
                  placeholder="Select Report Names"
                  label="Reports"
                />
              </div>
            </div>
          </Row>
          <Row id="selectrow" className="accessRequest-input__half">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "410px", marginLeft: "10px" }}>
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
              <span style={{ width: "25px" }} />
              <div style={{ width: "410px", marginLeft: "10px" }}>
                <ReactSelect
                  allOptions={investornames}
                  options={data}
                  setOptions={setData}
                  placeholder="Select Investor Categories"
                  Name="investor"
                  label="Investor Categories"
                  disabled={domain !== "kfintech.com" ? false : true}
                />
              </div>
            </div>
          </Row>
          <Row id="selectrow" className="accessRequest-input__half">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "410px", marginLeft: "10px" }}>
                <ReactSelect
                  allOptions={distributornames}
                  options={data}
                  setOptions={setData}
                  placeholder="Select Distributor Categories"
                  Name="distributor"
                  label="Distributor Categories"
                  disabled={domain !== "kfintech.com" ? false : true}
                />
              </div>
              <span style={{ width: "25px" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  width: "410px",
                  marginLeft: "10px",
                  marginTop: "10px",
                }}
              >
                <TextInput
                  id="userStatus"
                  className="inner-padding"
                  email
                  name="userStatus"
                  value={user?.userStatus}
                  disabled={true}
                  label="User Status"
                  validate
                  s={12}
                  l={12}
                />
              </div>
              <span style={{ width: "25px" }} />
            </div>
          </Row>
          {domain === "kfintech.com" && (
            <Row id="selectrow">
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
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
            </Row>
          )}
        </div>
      </div>
      <div className="modalFooter">
        <div className="adminSideButtons">
          {user.userStatus === "Pending" ? (
            <>
              <button
                onClick={() => {
                  sendDecisionFunction("Approve");
                }}
                className="modalAdminbtn modalBlueBtn"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  sendDecisionFunction("Reject");
                }}
                className="modalAdminbtn modalRedBtn"
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  sendDecisionFunction("Update");
                }}
                className="modalAdminbtn modalBlueBtn"
              >
                Update
              </button>
              <button
                onClick={() => {
                  revokeUserAccess();
                }}
                className="modalAdminbtn modalRedBtn"
              >
                Revoke Access
              </button>
            </>
          )}
        </div>
        <div className="CloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            className="modalAdminbtn"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigixAdmin;
