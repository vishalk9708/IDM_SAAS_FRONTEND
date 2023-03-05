import React, { useState, useEffect } from "react";
import "../../css/modal.css";
import { Row, TextInput } from "react-materialize";
import ReactSelect from "../../components/ReactSelect";
import ReactSelectSingle from "../../components/ReactSelectSingle";
import mapValuesToOption from "../../utils/mapper";
import swal from "sweetalert";
import sendRequest from "../../utils/sendRequest";

function NpsAdmin({
  appName,
  user,
  handleSubmit,
  setOpenModal,
  cardType,
}) {
  let { email } = user;
  const domain = email.split("@")[1];
  const [data, setData] = useState({ fund: [], usertype: "" });
  const [LoaderStat, setLoaderState] = useState(true);
  let userTypes = [
    { label: "User", value: "User" },
    { label: "Checker", value: "Checker" },
    { label: "Auditor", value: "Auditor" },
  ];
  function sendDecisionFunction(decision) {
    console.log("DATA ============", data);
    var form = {
      email: user.email,
      decision: decision.toLowerCase(),
      appName: appName,
      userType: data.usertype,
      // funds: data.fund,
      userType: data.usertype,
    };
    handleSubmit(user.index, decision, form);
  }

  function revokeUserAccess() {
    try {
      (async () => {
        const result = await sendRequest("/api/admin/revokeAccess", {
          email: email,
          appName: appName,
        });

        swal("Access revoked", "", "success");
      })();
    } catch (err) {
      console.log(err);
      swal("Error", "Sorry, Something went wrong", "error");
      setLoaderState(false);
    }
  }

  const [userType, setuserType] = useState([]);

  useEffect(async () => {
    data.usertype = { label: user.userType, value: user.userType };
    console.log("DATA here === ", user);

    if (domain !== "kfintech.com") {
      sendRequest(`/api/getMetaData/getFundNames`).then((res) => {
        const fundData = res.data["result"];

        fundData.forEach((element) => {
          if (domain === element.domain) {
            data.fund = [{ label: element.fundName, value: element.fundCode }];
          }
        });
        setData({ ...data });
      });
    } else {
      setData({ ...data });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="modalForm">
        <div className="titleContainerAdminModal">
          <h5 className="modalTitle">Nps</h5>
        </div>

        <div>
          <Row className="accessRequest-input__half">
            <TextInput
              id="fullName"
              className="inner-padding"
              name="fullName"
              value={user.firstName + " " + user.lastName}
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
              value={user.email}
              disabled="true"
              label="Email"
              validate
              s="6"
              l="6"
            />
          </Row>
        </div>

        <div className="card-select-dropdown-neu ">
          <Row id="selectrow" className="accessRequest-input__half">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ width: "205px" }} />
              <div style={{ width: "410px", marginLeft: "10px" }}>
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
              <span style={{ width: "205px" }} />
            </div>
          </Row>
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

export default NpsAdmin;
