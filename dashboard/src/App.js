import React, { Component } from "react";
// import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default class App extends Component {
  state = {};

  render() {
    return (
      <>
        <Router>
        <Route
            exact
            path="/"
            component={routerProps => (
              <LoginPage
                {...routerProps}
              />
            )}
          ></Route>
        </Router>
      </>
    );
  }
}
