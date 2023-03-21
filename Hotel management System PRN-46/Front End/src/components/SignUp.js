import React, { Component } from "react";
import "./SignUp.css";

import AuthServices from "../services/AuthServices.js";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const authServices = new AuthServices();

const PasswordRegex = RegExp(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i
);

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      Radiovalue: "Customer",
      UserName: "",
      Password: "",
      ConfirmPassword: "",
      MasterPassword: "",

      UserNameFlag: false,
      PasswordFlag: false,
      ConfirmPasswordFlag: false,
      MasterPasswordFlag: false,

      open: false,
      Message: "",
    };
  }

  handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  CheckValidity() {
    console.log("Check Validity Calling");
    //Reset Flag
    this.setState({
      UserNameFlag: false,
      PasswordFlag: false,
      ConfirmPasswordFlag: false,
      MasterPasswordFlag: false,
    });

    if (this.state.UserName === "") {
      this.setState({ UserNameFlag: true });
    }
    if (this.state.Password === "") {
      this.setState({ PasswordFlag: true });
    }
    if (this.state.ConfirmPassword === "") {
      this.setState({ ConfirmPasswordFlag: true });
    }

    if (
      this.state.Radiovalue === "Manager" &&
      this.state.MasterPassword === ""
    ) {
      this.setState({ MasterPasswordFlag: true });
    }
  }

  handleSubmit = (e) => {
    if (!this.state.PasswordFlag) {
      this.CheckValidity();
      if (
        this.state.Radiovalue === "Manager" &&
        this.state.MasterPassword === ""
      ) {
        return;
      }
      if (
        this.state.UserName !== "" &&
        this.state.Password !== "" &&
        this.state.ConfirmPassword !== ""
      ) {
        const data = {
          userName: this.state.UserName,
          password: this.state.Password,
          configPassword: this.state.ConfirmPassword,
          masterPassword: this.state.MasterPassword,
          role: this.state.Radiovalue,
        };

        authServices
          .SignUp(data)
          .then((data) => {
            console.log("data : ", data);
            if (data.data.isSuccess) {
              this.props.history.push("/SignIn");
            } else {
              console.log("Sign Up Failed");
              this.setState({ open: true, Message: data.data.message });
            }
          })
          .catch((error) => {
            console.log("error : ", error);
            this.setState({ open: true, Message: "Something Went Wrong" });
          });
      } else {
        console.log("Not Acceptable");
        this.setState({ open: true, Message: "Please Fill Required Field" });
      }
    } else {
      this.setState({ open: true, Message: "Please Fill Valid Password" });
    }
  };

  handleRadioChange = (e) => {
    this.setState({ Radiovalue: e.target.value });
  };

  handleChangePassword = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", PasswordRegex.test(value));
    if (!PasswordRegex.test(value)) {
      this.setState({ PasswordFlag: true });
    } else {
      this.setState({ PasswordFlag: false });
    }
    this.setState(
      { [name]: value },
      console.log(
        "Name : ",
        name,
        "Value : ",
        value,
        " PasswordFlag : ",
        this.state.PasswordFlag
      )
    );
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState(
      { [name]: value },
      console.log("Name : ", name, "Value : ", value)
    );
  };

  handleSignIn = (e) => {
    this.props.history.push("/SignIn");
  };

  render() {
    console.log("state : ", this.state);
    return (
      <div className="SignUp-Container">
        <div className="SignUp-SubContainer">
          <div className="Title">Hotel Management System</div>
          <div className="Header_Container">Registration</div>
          <div className="Body">
            <form className="form">
              <TextField
                className="TextField"
                name="UserName"
                label="UserName"
                variant="outlined"
                size="small"
                style={{ margin: 12 }}
                error={this.state.UserNameFlag}
                value={this.state.UserName}
                onChange={this.handleChange}
              />
              <TextField
                className="TextField"
                type="password"
                name="Password"
                label="Password"
                variant="outlined"
                size="small"
                style={{ margin: 12 }}
                error={this.state.PasswordFlag}
                value={this.state.Password}
                onChange={this.handleChangePassword}
              />
              {this.state.PasswordFlag ? (
                <div className="PassError">
                  Password Must Contain Upper Letter, Lower Letter, Symbol &
                  Number.
                </div>
              ) : (
                <></>
              )}
              <TextField
                className="TextField"
                type="password"
                name="ConfirmPassword"
                label="Confirm Password"
                variant="outlined"
                size="small"
                style={{ margin: 12 }}
                error={this.state.ConfirmPasswordFlag}
                value={this.state.ConfirmPassword}
                onChange={this.handleChange}
              />
              {this.state.Radiovalue !== "Customer" ? (
                <TextField
                  className="TextField"
                  type="password"
                  name="MasterPassword"
                  label="Master Password"
                  variant="outlined"
                  size="small"
                  style={{ margin: 12 }}
                  error={this.state.MasterPasswordFlag}
                  value={this.state.MasterPassword}
                  onChange={this.handleChange}
                />
              ) : null}
              <RadioGroup
                className="Roles"
                name="Role"
                value={this.state.Radiovalue}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  className="RoleValue"
                  value="Manager"
                  control={<Radio />}
                  label="Manager"
                />
                <FormControlLabel
                  className="RoleValue"
                  value="Customer"
                  control={<Radio />}
                  label="Customer"
                />
              </RadioGroup>
            </form>
          </div>
          <div className="Buttons">
            <Button className="Btn" color="primary" onClick={this.handleSignIn}>
              Sign In
            </Button>
            <Button
              className="Btn"
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Sign Up
            </Button>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={this.state.Message}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={this.handleClose}>
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
