import ReactDOM from 'react-dom';


// password validator
function validatePassword(password) {

  var res;
  var str = password;

  if (str.length == 0) {
    ReactDOM.render(
      <><p>Password field cannot be empty</p><br /></>,
      document.getElementById("Error_password")
    );
    return false;
  }
  else {
    ReactDOM.render(
      <></>,
      document.getElementById("Error_password")
    );
  }

  if (str.match(/[a-z]/g) && str.match(
    /[A-Z]/g) && str.match(
      /[0-9]/g) && str.match(
        /[^a-zA-Z\d]/g) && str.length >= 8)
    res = true;
  else
    res = false;


  //---------------------------------------
  if (res) {
    ReactDOM.render(
      <div class="green-text" dangerouslySetInnerHTML={{ __html: "" }} />,
      document.getElementById("Error_password")
    );
    return true;
  }

  else {
    ReactDOM.render(
      // <div class="red-text" dangerouslySetInnerHTML={{ __html: "Please enter a password having at least one uppercase, lowercase, number,alphanumeric and minimum length of 8" }} />,
      <>
        <p>Please enter a password having at least one uppercase, lowercase, number,special character and minimum length of 8.</p><br /></>,

      document.getElementById("Error_password")
    );
    return false;
  }
}

//phone number validator

function validatePhone(phone) {
  const regexPhone = /(\+)?(91)?( )?[789]\d{9}$/;

  if (phone.length === 0) {
    ReactDOM.render(
      // <div class="green-text" dangerouslySetInnerHTML={{ __html: "" }} />,
      <><p>Phone Number field cannot be empty</p><br /></>,
      document.getElementById("Error_phone")
    );
    return false;
  } else {
    ReactDOM.render(
      <></>,
      document.getElementById("Error_phone")
    );
  }



  if (regexPhone.test(phone) && phone.length === 10) {
    ReactDOM.render(
      // <div class="green-text" dangerouslySetInnerHTML={{ __html: "" }} />,
      <></>,
      document.getElementById("Error_phone")
    );
    return true;
  }

  else {
    ReactDOM.render(
      // <div class="red-text" dangerouslySetInnerHTML={{ __html: "Not a valid phone number!" }} />,
      <><p>Not a valid phone number!</p><br /></>,
      document.getElementById("Error_phone")
    );
    return false;
  }
}


// email validator
function validateEmail(email, textemails = []) {

  textemails.push('kfintech.com')


  if (email.length === 0) {
    ReactDOM.render(
      // <div class="red-text" dangerouslySetInnerHTML={{ __html: "Not a valid Email!" }} />,
      <><p>Email field cannot be empty</p><br /></>,
      document.getElementById("Error_email")
    );
    return false;
  } else {
    ReactDOM.render(
      <></>,
      document.getElementById("Error_email")
    );
  }

  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const userDomain = email.split('@')[1];

  //console.log(amcCheck[1]);
  //console.log(textemails)

  let validDomain = textemails.find((allowedDomain) => allowedDomain === userDomain);
  let validEmail = regexEmail.test(email);

  if (validEmail && validDomain) {
    // if (regexEmail.test(email) ) {
    ReactDOM.render(
      <div class="green-text" dangerouslySetInnerHTML={{ __html: "" }} />,
      document.getElementById("Error_email")
    );
    return true;
  }

  else {
    ReactDOM.render(
      // <div class="red-text" dangerouslySetInnerHTML={{ __html: "Not a valid Email!" }} />,
      <><p>Not a valid Email!</p> <br /></>,
      document.getElementById("Error_email")
    );
    return false;
  }

  //}
  // else{
  //   return false
  // }
}


// otp non zero length

function validateOtp(otp) {
  if (otp.length > 0) {
    ReactDOM.render(
      <div class="green-text" dangerouslySetInnerHTML={{ __html: "" }} />,
      document.getElementById("Error_otp")
    );
    return true;
  }

  else {
    ReactDOM.render(
      <div class="red-text" dangerouslySetInnerHTML={{ __html: "OTP field cannot be empty!" }} />,
      document.getElementById("Error_otp")
    );
    return false;
  }
}



const validators = { validatePassword, validatePhone, validateEmail, validateOtp };

export default validators;