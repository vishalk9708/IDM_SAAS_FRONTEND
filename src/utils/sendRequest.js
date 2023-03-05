import axios from "axios";
import SecureLS from "secure-ls";
import swal from "sweetalert";

const errorMap = {
  "jwt expired": "Your session is timed out, please login to continue",
};

const sendRequest = (endpoint, payload) =>
  new Promise((resolve, reject) => {
    console.log("sending request");
    const ls = new SecureLS();
    const data = ls.get("jdata");
    const access_token = data ? data.token : "";
    console.log("token = ", access_token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    axios
      .post(endpoint, payload)
      .then((res) => {
        console.log("res.data = ", res.data);
        resolve(res);
      })
      .catch((err) => {
        console.log("error: ", err.response);
        const msg =
          errorMap[err.response.data.message] || err.response.data.message;

        if (err.response.data.flag === true) {
          console.log("Expiring the session");
          swal(
            "",
            "Your session is expired, Please login again to continue",
            "warning"
          ).then(() => {
            localStorage.clear();
            window.location.href = "/";
          });

          // setTimeout(() => {
          //   window.location.href = "/";
          // }, 2000);
        }
        // reject(msg);
      });
  });

export default sendRequest;
