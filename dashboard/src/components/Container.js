import React from "react";

const Container = props => (
  <div className={props.columns}>
    <div className="card">
      <div className="card-header">{props.title}</div>
        {props.children}
    </div>
  </div>
);

export default Container;
