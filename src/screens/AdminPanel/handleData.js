import sendRequest from "../../utils/sendRequest";

/**
 * Descriptions
 * Loads array of user for given input params
 * @returns
 */
const loadData = ({ userState, activePage, pageLimit, domain, appName, subUserType }) =>
  new Promise((resolve, reject) => {
    console.log(userState, activePage, pageLimit, domain, appName, subUserType);
    sendRequest(`/api/admin/getPaginated`, {
      statusinfo: userState,
      pageNo: activePage,
      size: pageLimit,
      domain: domain,
      app: appName,
      subUser: subUserType
    })
      .then((res = {}) => {
        const userData = res.data["data"];
        const count = res.data["count"];

        resolve({ userData, count });
      })
      .catch((err) => {
        reject(false);
        console.log("error", err);
        alert("Something went wrong");
      });
  });

export { loadData };
