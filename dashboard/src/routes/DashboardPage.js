import React, { Component } from "react";
import Add from "../components/Add";
import Container from "../components/Container";
import Admin from "../components/Admin";
import axios from "axios";
import User from "../components/User";
import Product from "../components/Product";

export default class DashboardPage extends Component {
  state = {
    allUsers: [],
    products: [],
    username: "",
    password: "",
    role: "",
    msg:
      "Username:\n" +
      "\t\t\tmust be at least 3 characters long without spaces\n" +
      "\n" +
      "Password:\n" +
      "\t\t\tmust be at least 8 characters long\n" +
      "\t\t\tmust contain at least one digit\n" +
      "\t\t\tmust contain at least one lower case\n" +
      "\t\t\tmust contain at least one upper case\n"
  };

  UNSAFE_componentWillMount() {
    if (!this.props.cookies.get("user")) this.props.history.push("/");
  }

  componentDidMount() {
    this.getUsers();
    this.getProducts();
  }

  getUsers = () => {
    axios
      .get("https://ard-w-talab-version-2.herokuapp.com/users/API/data")
      .then(res => this.setState({ allUsers: res.data }))
      .catch(err => console.log(err));
  };

  getProducts = () => {
    axios
      .get("https://ard-w-talab-version-2.herokuapp.com/posts/API/data")
      .then(res => this.setState({ products: res.data }))
      .catch(err => console.log(err));
  };

  removeSpace = () => {
    for (let key in this.state) {
      if (typeof this.state[key] === "string") {
        let value = this.state[key];
        while (value[value.length - 1] === " ") {
          value = value.slice(0, -1);
        }
        this.setState({ [key]: value });
      }
    }
  };

  add = async event => {
    event.preventDefault();
    if (event.target["role"].value !== "role (admin/owner)") {
      this.state.username = event.target["username"].value;
      this.state.password = event.target["password"].value;
      this.state.role = event.target["role"].value;
      await this.removeSpace();
      const { username, password, role } = this.state;

      if (this.checkForm())
        axios
          .post(
            "https://ard-w-talab-version-2.herokuapp.com/users/API/dashboardAdd",
            { username, password, role }
          )
          .then(async res => {
            console.log(res.data);
            if (res.data === "ok") {
              let allUsers = [
                ...this.state.allUsers,
                { username, password, role }
              ];
              this.setState({ allUsers });
            } else {
              alert("User already exists");
            }
          })
          .catch(err => console.log(err.message));
      else {
        alert(this.state.msg);
      }
    } else {
      alert("Kindly, select a role!");
    }
  };

  checkForm = () => {
    const { username, password } = this.state;

    const regUsername = /^[a-zA-Z][^\s#&<>"~;.=+*!@%^&()[\]/,$^%{}?123456789]{2,29}$/;
    const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    const usernameTest = regUsername.test(username);
    const passwordTest = regPassword.test(password);

    if (usernameTest && passwordTest) return true;
    return false;
  };

  render() {
    const { role } = this.props.cookies.cookies;
    const { allUsers, products } = this.state;

    const admins = allUsers.filter(user => user.username !== undefined);
    const users = allUsers.filter(user => user.username === undefined);

    const adminsToShow = admins.map(admin => (
      <Admin key={admin._id} data={admin} />
    ));
    const usersToShow = users.map(user => <User key={user._id} data={user} />);
    const productsToShow = products.map(product => (
      <Product key={product._id} data={product} />
    ));

    return (
      <div className="container-fluid">
        {role === "owner" && (
          <>
            <Add add={this.add} />
            <div className="row">
              <Container
                className="col-md-12 mt-4"
                title="All Admins & Owners"
                height="500px"
              >
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Password</th>
                      <th scope="col">Role</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>{adminsToShow}</tbody>
                </table>
              </Container>
            </div>
          </>
        )}
        <hr />
        <div className="row  mt-4">
          <Container className="col-md-6" title="All Users">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Password</th>
                  <th scope="col">Phone No.</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>{usersToShow}</tbody>
            </table>
          </Container>

          <Container className="col-md-6" title="All Products">
            {productsToShow}
          </Container>
        </div>
      </div>
    );
  }
}
