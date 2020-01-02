import React from "react";

const User = props => (
  <tr>
    <td>{props.data.name}</td>
    <td>{props.data.email}</td>
    <td>{props.data.password}</td>
    <td>{props.data.phone_number}</td>
    <td>actions</td>
  </tr>
);

export default User;
