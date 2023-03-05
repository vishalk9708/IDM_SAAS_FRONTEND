import sendRequest from "./sendRequest";

const getFunds = (domain) =>
  new Promise((resolve, reject) => {
    let funds = [];
    console.log("sending Request for domain", domain);
    sendRequest(`/api/getMetaData/getFundNames`)
      .then((res) => {
        const fundData = res.data["result"];
        fundData.forEach((element) => {
          if (domain === "kfintech.com")
            funds.push({ label: element.fundName, value: element.fundCode });
          else if (domain === element.domain) {
            funds.push({ label: element.fundName, value: element.fundCode });
          }
        });
        resolve(funds);
      })
      .catch((err) => {
        reject();
        console.log(err);
      });
  });

export { getFunds };
