import React from "react";

const Admin = props => (
  <tr>
    <td>{props.data.username}</td>
    <td>{props.data.password}</td>
    <td>{props.data.role}</td>
    <td>actions</td>
  </tr>
);

export default Admin;
