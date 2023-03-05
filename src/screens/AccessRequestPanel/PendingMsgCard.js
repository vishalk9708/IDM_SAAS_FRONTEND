import React from "react";
import { Card, Icon } from "react-materialize";

function PendingMsgCard({ status = "Pending" }) {
  return (
    <div className="bannerWrapper">
      <Card className="Home-status__card neumorphCard">
        <center>
          <Icon medium className="center kfintech-purple-text HeadIcon">
            pending_actions
          </Icon>
          <h4 style={{ color: "#ff9800" }}>Your Application is {status}</h4>
          <h6>
            You will be notified via email after your application gets approval
          </h6>
          <h6>Please login again to refresh the status.</h6>
        </center>
      </Card>

      {/* <div className='banner'>

                <a href='https://apps.apple.com/app/digix/id1581729142' className='bannerLink'>
                    <div className='leftBanner'></div>
                </a>

                <a href='https://play.google.com/store/apps/details?id=com.digix' className='bannerLink'>
                    <div className='rightBanner'></div>
                </a>
            </div> */}
    </div>
  );
}

export default PendingMsgCard;
