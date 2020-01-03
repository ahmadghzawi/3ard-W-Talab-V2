import React, { Component } from "react";
import Add from "../components/Add";
import Container from "../components/Container";
import Admin from "../components/Admin";
import axios from "axios";
import User from "../components/User";
import Product from "../components/Product";

export default class DashboardPage extends Component {
  state = {
    admins: [],
    users: [],
    products: [],
    selectedCategory: "All Categories",
    categories: [],
    username: "",
    password: "",
    role: "",
    edit: null,
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

  componentDidMount = () => {
    this.getUsers();
    this.getProductsAndCategories();
  };

  getUsers = () => {
    axios
      .get("https://ard-w-talab-version-2.herokuapp.com/users/API/data")
      .then(res => {
        let admins = [];
        let users = [];
        res.data.forEach(user => {
          if (!user.username) users.push(user);
          else admins.push(user);
        });
        this.setState({ admins, users });
      })
      .catch(err => console.log(err));
  };

  getProductsAndCategories = () => {
    axios
      .get("https://ard-w-talab-version-2.herokuapp.com/posts/API/data")
      .then(res => {
        this.setState({ products: res.data.products, categories: res.data.categories });
      })
      .catch(err => console.log(err));
    console.log("pro");
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
            if (res.data !== "User already exists") {
              let admins = [
                ...this.state.admins,
                { _id: res.data._id, username, password, role }
              ];
              this.setState({ admins });
            } else alert(res.data);
          })
          .catch(err => console.log(err.message));
      else alert(this.state.msg);
    } else alert("Kindly, select a role!");
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

  editAdmin = async (_id, usernameInput, passwordInput, roleInput) => {
    this.state.username = usernameInput;
    this.state.password = passwordInput;
    this.state.role = roleInput;
    await this.removeSpace();
    const { username, password, role } = this.state;

    if (this.checkForm())
      axios
        .post(
          "https://ard-w-talab-version-2.herokuapp.com/users/API/editAdmin",
          { _id, username, password, role }
        )
        .then(() => {
          let allUsers = this.state.allUsers.filter(user => user._id !== _id);
          this.setState({
            allUsers: [...allUsers, { _id, username, password, role }]
          });
        })
        .catch(err => console.log(err.message));
    else alert(this.state.msg);
  };

  deleteUser = _id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteUserPosts/${_id}`
      )
      .then()
      .catch(err => console.log(err))
      .then(
        axios
          .delete(
            `https://ard-w-talab-version-2.herokuapp.com/users/API/delete/${_id}`
          )
          .then(() => {
            let admins = this.state.admins.filter(user => user._id !== _id);
            let users = this.state.users.filter(user => user._id !== _id);
            this.setState({ admins, users });
          })
          .catch(err => console.log(err.message))
      );
  };

  deleteProduct = _id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deletePost/${_id}`
      )
      .then(() => {
        let products = this.state.products.filter(
          product => product._id !== _id
        );
        this.setState({ products });
      })
      .catch(err => console.log(err.message));
  };

  redirectToProductPage = () => this.props.history.push("/product");

  render() {
    const { role } = this.props.cookies.cookies;
    const { admins, users, products, msg } = this.state;

    const adminsToShow = admins.map(admin => (
      <Admin
        key={admin._id}
        data={admin}
        editAdmin={this.editAdmin}
        deleteUser={this.deleteUser}
        msg={msg}
      />
    ));
    const usersToShow = users.map(user => (
      <User key={user._id} data={user} deleteUser={this.deleteUser} />
    ));
    const productsToShow = products.map(product => (
      <Product
        key={product._id}
        data={product}
        deleteProduct={this.deleteProduct}
        redirectToProductPage={this.redirectToProductPage}
      />
    ));

    return (
      <div className="container-fluid">
        <div className="row  mt-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            {role === "owner" && <Add add={this.add} />}
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info float-right w-50"
              onClick={() => this.props.history.push("/logout")}
            >
              LogOut
            </button>
          </div>
        </div>
        {role === "owner" && (
          <div className="row">
            <Container
              className="col-md-12 mt-4"
              title="All Admins & Owners"
              height="400px"
            >
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Password</th>
                    <th scope="col">Role</th>
                    <th scope="col" className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>{adminsToShow}</tbody>
              </table>
            </Container>
          </div>
        )}

        <hr />
        <div className="row">
          <Container className="col-md-6 mt-4" title="All Users">
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

          <Container className="col-md-6 mt-4" title="All Products">
            <select
              className="custom-select"
              name="role"
              ref={role => (this.roleInput = role)}
            >
              <option defaultValue="All Categories">All Categories</option>
              <option value={role === "owner" ? "admin" : "owner"}>
                {role === "owner" ? "admin" : "owner"}
              </option>
            </select>
            {productsToShow}
          </Container>
        </div>
      </div>
    );
  }
}
