import React from "react";
import { Card, Icon, Row, Col, TextInput, Button } from "react-materialize";
import swal from "sweetalert";
import validators from "../utils/validate";

function SearchBar({ searchUser, setSearchUser, fundData, domain, search }) {

  const handleChangeFund = (event) => {
    console.log(event);
    setSearchUser(event)
  };

  const handleSearch = () => {

    if (searchUser === "") {
      swal("Email can't be empty", "", "warning");
      return;
    }

    if (checkEmail(searchUser)) {
      search(searchUser);
      //swal("This is fine!", "", "success");
    }
    else {
      swal("Invalid Email", "", "warning");
      return;
    }


  }


  const checkEmail = (email) => {
    const validDomain = email.split("@")[1] === domain;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const result = regex.test(email);
    return validDomain;
  }

  //--------------------------------------
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "500px",
          maxHeight: "80px",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(e);
          }}
        >
          <Card className="CardA">
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "500px",
                maxHeight: "40px",
              }}
            >
              <Col
                style={{
                  maxWidth: "390px",
                  minWidth: "380px",
                  maxHeight: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  center
                  className="TextA"
                  placeholder="Enter email to search"
                  onChange={(event) => handleChangeFund(event.target.value)}
                />
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: "30px",
                  maxWidth: "50px",
                  height: "40px",
                  paddingRight: "35px",
                  paddingBottom: "5px",
                }}
              >
                <Button className="ButtonA" onClick={handleSearch}>
                  <Icon center small style={{ cursor: "pointer", color: "grey" }}>
                    search
                  </Icon>
                </Button>
              </Col>
            </Row>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
