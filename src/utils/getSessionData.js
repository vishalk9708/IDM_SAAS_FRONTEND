import CryptoJS from "crypto-js";

// -------- function to encrypt the data stored in session ------------
const decrypt = (myData) => {
  try {
    var decryptedData = CryptoJS.AES.decrypt(myData, "randomkey");
    var decryptedDataParsed = JSON.parse(
      decryptedData.toString(CryptoJS.enc.Utf8)
    );
  } catch (err) {
    console.log(err);
  }

  return decryptedDataParsed;
};
//--------------------------------------------------------------------

function getSessionData(option = 0) {
  // console.log("get session Data", option)
  let sessionData = {
    isLoggedIn: false,
    firstName: " ",
    lastName: " ",
    email: " ",
    app: " ",
    isAdmin: false,
    adminForApp: " ",
    apps: [],
    domain: " ",
    isKfinUser: false,
    accountStatus: " ",
    token: " "
  };

  var endata = localStorage.getItem("data");

  if (endata) sessionData = JSON.parse(endata);

  return sessionData;
}

export default getSessionData;
