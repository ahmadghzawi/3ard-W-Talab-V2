import React, { Component } from "react";
import { BrowserRouter as Redirect } from "react-router-dom";
import axios from "axios";

export default class LoginPage extends Component {
  state = {
    username: "",
    password: "",
    usernameMsg: null,
    passwordMsg: null,
    invalid: null
  };

  submitForm = async event => {
    event.preventDefault();
    let username = event.target["username"].value;
    let password = event.target["password"].value;
    this.state.username = username;
    this.state.password = password;
    if (!this.checkForm()) {
      axios
        .post(
          "https://ard-w-talab-version-2.herokuapp.com/users/API/dashboardLogin",
          { username, password }
        )
        .then(res => {
          console.log(res.data)
          if (res.data !== null) {
            return <Redirect to="/dashboard" />;
          } else {
            this.setState({
              usernameMsg: null,
              passwordMsg: null,
              invalid: (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Invalid Email or Password
                </p>
              )
            });
          }
        })
        .catch(err => console.log(err.message));
    }
  };

  checkForm = () => {
    const { username, password } = this.state;

    const regUsername = /^[a-zA-Z][^\s#&<>"~;.=+*!@%^&()[\]/,$^%{}?123456789]{2,29}$/;
    const regPassword = /^[0-9a-zA-Z]{8,}$/;
    const usernameTest = regUsername.test(username);
    const passwordTest = regPassword.test(password);

    if (usernameTest && passwordTest) return true;

    if (!usernameTest)
      this.setState({
        usernameMsg: (
          <ul style={{ color: "red", textAlign: "left" }}>
            Username is Invalid!
            <li>must be at least 3 characters long without spaces</li>
          </ul>
        )
      });
    else this.setState({ usernameMsg: null });

    if (!passwordTest)
      this.setState({
        passwordMsg: (
          <ul style={{ color: "red", textAlign: "left" }}>
            Password is Invalid! <li>must be at least 8 characters long</li>
            <li>must contain at least one digit</li>
            <li>must contain at least one lower case</li>
            <li>must contain at least one upper case</li>
          </ul>
        )
      });
    else this.setState({ passwordMsg: null });

    return false;
  };

  render() {
    return (
      <div className="login-form">
        <form onSubmit={this.submitForm} method="post">
          <h2 className="text-center font-weight-bold">3ard w Talab</h2>
          <h4 className="text-center">Log in</h4>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              required
              name="username"
            />
            {this.state.usernameMsg}
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
              name="password"
            />
            {this.state.passwordMsg}
          </div>
          <div className="form-group">
            {this.state.invalid}
            <button type="submit" className="btn btn-dark btn-block">
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
}
