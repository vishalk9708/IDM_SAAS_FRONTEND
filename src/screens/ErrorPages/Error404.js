import React from "react";
import { Card, Icon, Button } from "react-materialize";
import Address from "../../utils/Address";
import Select from "react-select";
import ReactSelect from "../../components/ReactSelect";

function Error404() {
  return (
    <div className="error-container">
      <Card className="error-card">
        {/* <img src={error} alt='404' /> */}

        <center>
          <Icon
            large
            center
            className="kfintech-purple-text lighten-4 HeadIcon"
          >
            report
          </Icon>
          <h2 className="error-card__h2">Oops! 404</h2>
          <p className="error-card__p">
            The page you are looking for is not found or some error has occured.
          </p>
          <br />
          <br />
          <Button
            className="kfin-neu-btn__blue  error-card__bt"
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            Get back to Home
            <Icon right>home</Icon>
          </Button>
        </center>
      </Card>
    </div>
  );
}
export default Error404;
