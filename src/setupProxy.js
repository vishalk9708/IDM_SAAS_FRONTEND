const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://dataorg1.kfintech.com",
      //target: "localhost:5101",
      //target: "http://13.235.45.8:5203",
      //13.233.45.8 -- devgraviton issue
      //   changeOrigin: true,
    })
  );
};
