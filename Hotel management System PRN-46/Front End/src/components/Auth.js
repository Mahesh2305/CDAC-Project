import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function Auth(props) {
  debugger;
  if (props.Role === "Manager") {
    console.log("Manager Token : ", localStorage.getItem("manager_token"));
    if (localStorage.getItem("manager_token") !== null) {
      //Token Found In Local Storage
      console.log("Routing On : ", props.path);
      return <Route exact path={props.path} component={props.component} />;
      //
    } else {
      // Token Not Found In Local Storage
      console.log("Redirect To Sign Up Page");
      return <Redirect exact path="/" />;
      //
    }
  } else {
    console.log("Customer Token : ", localStorage.getItem("customer_token"));
    if (localStorage.getItem("customer_token") !== null) {
      //Token Found In Local Storage
      console.log("Routing On : ", props.path);
      return <Route exact path={props.path} component={props.component} />;
      //
    } else {
      // Token Not Found In Local Storage
      console.log("Redirect To Sign Up Page");
      return <Redirect exact path="/" />;
      //
    }
  }
}
