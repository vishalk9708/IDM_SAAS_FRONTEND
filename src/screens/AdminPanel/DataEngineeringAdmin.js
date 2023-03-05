import React, { useState, useEffect } from "react";
import "../../css/modal.css";
import { Row, TextInput } from "react-materialize";
import ReactSelect from "../../components/ReactSelect";
import mapValuesToOption from "../../utils/mapper";
import swal from "sweetalert";
import sendRequest from "../../utils/sendRequest";

function DataEngineeringAdmin({
  appName,
  user,
  funds,
  handleSubmit,
  setOpenModal,
}) {
  let { email } = user;
  const [data, setData] = useState({ fund: [], permissions: [] });
  const [LoaderStat, setLoaderState] = useState(true);
  function sendDecisionFunction(decision) {
    console.log(data);
    var form = {
      email: user.email,
      decision: decision.toLowerCase(),
      appName: appName,
      userType: "User",
      funds: data.fund,
      permissions: data.permissions,
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

  const permissions = [
    { label: "Read", value: "Read" },
    { label: "Write", value: "Write" },
    { label: "Modify", value: "Modify" },
  ];

  useEffect(() => {
    data.fund = mapValuesToOption(funds, user.funds);
    data.permissions = user.permissions;
    setData({ ...data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="modalForm">
        <div className="titleContainerAdminModal">
          <h5 className="modalTitle">Data Engineering</h5>
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
              disabled="true"
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
                  Updater={() => console.log("Fund Selected")}
                  label="Funds"
                />
              </div>

              <span style={{ width: "25px" }} />

              <div style={{ width: "410px", marginLeft: "10px" }}>
                <ReactSelect
                  allOptions={permissions}
                  options={data}
                  setOptions={setData}
                  placeholder="Select Global"
                  Name="permissions"
                  updater={() => console.log("Permission Selected")}
                  label="Permissions"
                />
              </div>
            </div>
          </Row>
        </div>
      </div>
      <div className="modalFooter">
        <div className="adminSideButtons">
          {user.userStatus === "Pending" ? (
            <>
              {" "}
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

export default DataEngineeringAdmin;
