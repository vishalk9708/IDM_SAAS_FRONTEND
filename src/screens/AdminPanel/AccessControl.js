import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  TextInput,
  Card,
  Select,
  Table,
  Icon,
  Switch,
  Dropdown,
} from "react-materialize";
import swal from "sweetalert";
import getSessionData from "../../utils/getSessionData";
import Loader from "../../components/Loader";
import isMobile from "../../utils/mobile";
import { DROPDOWN_OPTIONS } from "../../metadata";
import Modal from "./Modal";
import DigixAdmin from "./DigixAdmin";
import QuestAdmin from "./QuestAdmin";
import NpsAdmin from "./NpsAdmin";
import DataEngineeringAdmin from "./DataEngineeringAdmin";
import DataUtilityAdmin from "./DataUtilityAdmin";
import { loadData } from "./handleData";
import { useStateValue } from "../../StateProvider";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { getFunds } from "../../utils/getFundNames";
import { x64 } from "crypto-js";
import sendRequest from "../../utils/sendRequest";

function AccessControl() {
  // --------- state declarations and session data get -------------------
  const [state, dispatch] = useStateValue();
  let userData = getSessionData();
  let activeApp = localStorage.getItem("appName");
  let history = useHistory();
  const [LoaderStat, setLoaderState] = useState(true);
  let [userState, setUserState] = useState("Pending");
  let [activePage, setActivePage] = useState(1); // currently active page
  const [total, setTotal] = useState(0); // total pages
  const [pageLimit, setPageLimit] = useState(3); // items per page
  const [appName, setAppName] = useState(activeApp);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserData, setModalUserData] = useState({});
  const [fundData, setFundData] = useState([]);
  const [reload, setReload] = useState(false);

  const [searchUser, setSearchUser] = useState("");

  const domain = userData.domain;

  const cardStyleAdmin = {
    margin: "10px",
    overflow: isMobile() ? "scroll" : "visible",
  };

  const appNames = {
    dataUtility: "Data Utility",
    dataEngineering: "Data Engineering",
    digix: "Digix",
    quest: "Quest",
    nps: "Nps",
  };

  let subUserType = userData?.app?.[appName]?.subUserType;
  console.log("Sub usetype from /AccessControl.js", subUserType)
  let userType = userData?.app?.[appName]?.userType;
  // if(appName === 'quest' && subUserType === 'Unit'){
  //   data.filter((unitData)=>{
  //     console.log(unitData)
  //   })
  // }


  //---- useEffect -------------------------------------------------------

  useEffect(() => {
    if (!userData.isAdmin) history.push({ pathname: "/error404" });
    console.log("ACTIVE PAGE = ", activePage);
    loadData({ userState, activePage, pageLimit, domain, appName, subUserType }).then(
      ({ count, userData }) => {
        console.log(count, userData);
        setTotal(count);
        setData(userData);
        setLoaderState(false);
      }
    );

    getFunds(userData.domain).then((funds) => {
      setFundData(funds);
    });
  }, [userState, pageLimit, activePage, reload]);

  //-------- functions ----------------------------------------------------

  // handler pending, approved, rejected state

  function handleStateChange(myState) {
    setLoaderState(true);
    setActivePage(1);
    setUserState(myState);
  }

  const handleSubmit = (index, decision, form) => {
    (async function () {
      try {
        var response = await sendRequest("/api/admin/updateMfData", form);
        if (response.data.resp.toLowerCase() !== "done")
          swal("Something went wrong", "", "warning");
        else {
          swal("Decision send succesfully", "", "success");

          const lastPage = Math.ceil(total / pageLimit);
          console.log("ACTIVE = ", activePage, " LAST =", lastPage);
          // if (activePage === lastPage) setActivePage(activePage - 1);
          // else setReload(!reload);
          //setData([...data]);
          if (data.length === 0) {
            activePage = activePage - 1;
            setActivePage(activePage);
          } else {
            setReload(!reload);
          }
        }
        setModalOpen(false);
      } catch (error) {
        console.log("ERROR in sending decision to backend");
        swal(
          "Something went wrong",
          "Oh Father, My lord! I failed you.",
          "warning"
        );
        setModalOpen(false);
      }
    })();
  };

  const handleViewDetails = (userData, index, cardType) => {
    userData.index = index;
    console.log("UserData = ", userData);
    setModalUserData({ ...userData });
    setModalOpen(true);
  };

  const handlePageLimitChange = (limit) => setPageLimit(limit);
  const getKey = (i) => (activePage - 1) * pageLimit + i;

  const getFullName = (firstName, lastName) => {
    let fullName = firstName + " " + lastName;
    if (fullName.length > 15) fullName = fullName.slice(0, 15) + "...";
    return fullName;
  };

  const handleModalSubmit = (status, finalData) => {
    console.log("Status = ", status);
    console.log("data = ", finalData);
  };
  /**
   *
   * @param {*} index
   * @param string decision
   */
  function sendDecision(index, decision) {
    console.log("data = ", data, " and index = ", index);
    var form = {
      email: data[index].email,
      appName: appName,
      decision: decision,
      userType: data[index].userType,
    };
    switch (appName) {
      case "digix":
        form = {
          funds: data[index].funds,
          distributors: data[index].distributors,
          investors: data[index].investors,
          branches: data[index].branches,
          reports: data[index].reports,
          ...form,
        };
        break;
      case "dataUtility":
        form = {
          funds: data[index].funds.map((f) => ({ value: f })),
          permissions: data[index].permissions,
          ...form,
        };
        break;
      case "dataEngineering":
        form = {
          funds: data[index].funds.map((f) => ({ value: f })),
          permissions: data[index].permissions,
          ...form,
        };
        break;
      case "quest":
        form = {
          funds: data[index].funds.map((f) => ({ value: f })),
          ...form,
          userType: {
            label: data[index].userType,
            value: data[index].userType,
          },
        };
        break;
      case "nps":
        form = {
          ...form,  // endpoint - 3
          userType: {
            label: data[index].userType,
            value: data[index].userType,
          },
        };
        break;
    }
    handleSubmit(index, decision, form);
  }
  
  const getCard = () => {
    const params = {
      user: modalUserData,
      funds: fundData,
      handleSubmit: handleModalSubmit,
      setOpenModal: setModalOpen,
      appName: appName,
      handleSubmit: handleSubmit,
    };
    switch (appName) {
      case "digix":
        return <DigixAdmin {...params} />;
        break;

      case "dataUtility":
        return <DataUtilityAdmin {...params} />;
        break;

      case "dataEngineering":
        return <DataEngineeringAdmin {...params} />;
        break;
      case "nps":
        return <NpsAdmin {...params} />;
        break;
      case "quest":
        return <QuestAdmin {...params} />;
        break;
    }
  };

  const searchParticularUser = (email) => {
    const userDataQuery = {
      email: email,
      appName: appName,
    };

    sendRequest(`/api/userData/getParticularUserData`, userDataQuery)
      .then((result) => {
        const searched = result.data["data"];
        console.log(searched);
        if (searched) {
          handleViewDetails(searched, 0);
        } else {
          swal("User not found", "", "error");
        }
      })
      .catch((err) => {
        console.log("search failed", err);
        swal("Search failed", "", "warning");
      });
  };

  //----------------------------------------------------------------------
  return (
    <div>
      {modalOpen && (
        <Modal
          setOpenModal={setModalOpen}
          Card={() => getCard()}
          appName={appName}
        />
      )}
      <Loader value={LoaderStat} />
      <Card
        className="z-depth-5 admin-container"
        style={cardStyleAdmin}
        id="adminCard"
      >
        <div className="admin-topbar">
          <div className="admin-topbar__left">
            <Icon medium className="kfintech-purple-text lighten-4 HeadIcon">
              account_circle
            </Icon>
            <h4>{appName === 'quest' ? appNames[appName] + " " + subUserType + " Admin": appNames[appName]}</h4>
          </div>{" "}
          <div className="admin-topbar__right">
            <SearchBar
              searchUser={searchUser}
              setSearchUser={setSearchUser}
              fundData={fundData}
              domain={domain}
              search={searchParticularUser}
            />
          </div>
        </div>

        <div style={{ minHeight: "350px" }}>
          {/* <button onClick={() => setModalOpen(true)}>Open</button> */
            console.log("data is:", data)
          }

          {data.length > 0 &&
            data?.map((userData, i) => (
              <Card className="admin-card" key={i}>
                <div className="admin-card__top">
                  <div className="admin-card__top-name-mail">
                    <div className="adminNumber">
                      <label>No.</label>
                      <TextInput
                        id={"Number" + getKey(i)}
                        className="admin-card__top-name-mail-input"
                        name="No."
                        key={"number" + getKey(i)}
                        disabled
                        value={String(getKey(i) + 1)}
                      />
                    </div>
                    <div>
                      <label>FullName</label>
                      <TextInput
                        id={"fullName" + getKey(i)}
                        className="admin-card__top-name-mail-input"
                        name="Full Name"
                        key={"fullname" + getKey(i)}
                        disabled
                        value={getFullName(
                          userData.firstName,
                          userData.lastName
                        )}
                      />
                    </div>
                    <div>
                      <label>Email</label>
                      <TextInput
                        id={"email" + getKey(i)}
                        style={{ width: "350px" }}
                        className="admin-card__top-name-mail-input"
                        name="Email"
                        key={"Email" + getKey(i)}
                        disabled
                        value={userData.email.toLowerCase()}
                      />
                    </div>

                    <div>
                      <label>UserType</label>
                      <TextInput
                        id={"usertype" + getKey(i)}
                        className="admin-card__top-name-mail-input"
                        name="UserType"
                        key={"usertype" + getKey(i)}
                        disabled
                        value={userData.userType}
                      />
                    </div>
                  </div>

                  <div className="admin-card__top-actions">
                    {userState === "Pending" && (
                      <div>
                        <Button
                          onClick={() => handleViewDetails(userData, i)}
                          className="Kfin-btn-green"
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => sendDecision(i, "approve")}
                          className="Kfin-btn-blue"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => sendDecision(i, "reject")}
                          className="Kfin-btn-red"
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {userState === "Approved" && (
                      <div>
                        <Button
                          onClick={() => handleViewDetails(userData, i)}
                          className="Kfin-btn-blue"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

          {data.length == 0 && (
            <div style={{ position: "absolute", top: "40%", left: "40%" }}>
              <h5 style={{ color: "grey" }}>
                {"No " + userState + " requests ⏳"}
              </h5>
            </div>
          )}
        </div>

        <div className="admin-bottom__conatiner">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              id="UserStatus001"
              options={DROPDOWN_OPTIONS}
              trigger={
                <Button className="admin-bottom__btn" node="button">
                  {userState}
                  <Icon right>arrow_drop_down</Icon>
                </Button>
              }
            >
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => handleStateChange("Pending")}>
                Pending
              </a>
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => handleStateChange("Approved")}>
                Approved
              </a>
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => handleStateChange("Rejected")}>
                Rejected
              </a>
            </Dropdown>

            <div style={{ marginLeft: "20px" }}>
              <p style={{ color: "grey" }}>TOTAL : {total}</p>
            </div>
          </div>

          <Pagination
            itemsPerPage={pageLimit}
            total={total}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          <div>
            <Dropdown
              id="total01"
              options={DROPDOWN_OPTIONS}
              trigger={
                <Button className="admin-bottom__btn" node="button">
                  Cards : {pageLimit}
                  <Icon right>arrow_drop_down</Icon>
                </Button>
              }
            >
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => handlePageLimitChange(3)}>
                3
              </a>
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => handlePageLimitChange(5)}>
                5
              </a>
            </Dropdown>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AccessControl;
