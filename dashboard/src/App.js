import React, { Component } from "react";
// import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from "./routes/LoginPage";
import DashboardPage from "./routes/DashboardPage"

export default class App extends Component {
  state = {};

  render() {
    return (
      <div>
        <Router>
        <Route
            exact
            path="/"
            component={routerProps => <LoginPage {...routerProps} />}
          ></Route>
          <Route
            exact
            path="/dashboard"
            component={routerProps => <DashboardPage {...routerProps} />}
          ></Route>
        </Router>
      </div>
    );
  }
}
