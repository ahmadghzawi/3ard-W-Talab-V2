import React from "react";

const Admin = props => (
  <tr>
    <td>{props.admin.username}</td>
    <td>{props.admin.password}</td>
    <td>{props.admin.role}</td>
    <td>actions</td>
  </tr>
);

export default Admin;
