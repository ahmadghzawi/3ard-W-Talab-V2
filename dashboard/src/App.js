import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CookiesProvider, withCookies } from "react-cookie";
import LoginPage from "./routes/LoginPage";
import LogoutPage from "./routes/LogoutPage";
import DashboardPage from "./routes/DashboardPage";

class App extends Component {
  render = () => (
    <CookiesProvider>
      <Router>
        <Route
          exact
          path="/"
          component={routerProps => (
            <LoginPage {...routerProps} cookies={this.props.cookies} />
          )}
        ></Route>
        <Route
          exact
          path="/dashboard"
          render={routerProps => (
            <DashboardPage {...routerProps} cookies={this.props.cookies} />
          )}
        ></Route>
        <Route
          exact
          path="/logout"
          render={routerProps => (
            <LogoutPage {...routerProps} cookies={this.props.cookies} />
          )}
        ></Route>
      </Router>
    </CookiesProvider>
  );
}

export default withCookies(App);
