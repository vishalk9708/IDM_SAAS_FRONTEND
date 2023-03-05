// function to restructure, add some fields in user document to aid in routing.

export const restructureUserData = (userData) => {
  let appData = userData.app;
  let apps = [];
  let isAdmin = false;
  let domain = userData.email.split("@")[1];
  let isKfinUser = domain === "kfintech.com";
  let adminForApp = "";

  for (let appName in appData) {
    apps.push(appName);
    // first app for which user is admin, we will redirect there
    if (appData[appName].userType === "Admin" && !isAdmin) {
      isAdmin = true;
      adminForApp = appName;
    }
  }

  let userFinalData = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    app: userData.app,
    isAdmin: isAdmin,
    adminForApp: adminForApp,
    apps: apps,
    domain: domain,
    isKfinUser: isKfinUser,
    isLoggedIn: true,
    accountStatus: userData.accountStatus,
    token: userData.token,
    jwt_token: userData?.jwt_token || null,
  };

  console.log("Restructured Data = ", userFinalData);
  return userFinalData;
};
