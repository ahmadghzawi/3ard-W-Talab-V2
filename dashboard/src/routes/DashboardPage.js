import React, { Component } from "react";
import Add from "../components/Add";
import Container from "../components/Container";
import Admin from "../components/Admin";

export default class DashboardPage extends Component {
  state = {};

  UNSAFE_componentWillMount() {
    if (!this.props.cookies.get("user")) this.props.history.push("/");
  }

  add = event => {
    event.preventDefault();
    console.log(event.target["role"].value);
  };

  render() {
    let { role } = this.props.cookies.cookies;
    return (
      <div className="container-fluid">
        {role === "owner" && (
          <>
            <Add add={this.add} />
            <Container columns="col-md-12" title="All Admins & Owners">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Password</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <Admin admin={{username: 'Ahmad', password:'Aa123456', role: 'owner'}}/>
                  
                </tbody>
              </table>
            </Container>
          </>
        )}
        <div>admin</div>
        <hr />
      </div>
    );
  }
}
