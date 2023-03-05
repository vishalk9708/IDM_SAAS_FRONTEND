import CryptoJS from "crypto-js";

const encrypt = (myData) =>
  CryptoJS.AES.encrypt(myData, "randomkey").toString();

function setSessionData(data, option = 0) {
  var dataString = JSON.stringify(data);

  var endata = dataString;

  localStorage.setItem("data", endata);

  return true;
  //----------------------------------------------------------
}

export default setSessionData;
