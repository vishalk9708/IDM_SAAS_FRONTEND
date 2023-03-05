import React from 'react';
import { Card, Icon, Button } from 'react-materialize';

function AccessDeniedPage() {
  return (
    <div className='error-container'>
      <Card className='error-card'>
        <center>
          <Icon large center
            className="kfintech-purple-text lighten-4 HeadIcon">
            report
          </Icon>
          <h2 className='error-card__h2'>Access Denied</h2>
          <p className='error-card__p'>Sorry! You don't have access to this page.</p>
          <p className='error-card__p'>Or</p>
          <p className='error-card__p'>If you haven't activated your account, kindly activate via link sent to you.</p>
          <br />
          <br />
          <Button className='kfin-neu-btn__blue  error-card__bt' onClick={() => { window.location.href = '/home' }}>
            Get back to Home
            <Icon right>home</Icon>
          </Button>
        </center>
      </Card>

    </div>
  );

}
export default AccessDeniedPage;