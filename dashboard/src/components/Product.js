import React, { Component } from "react";

class Product extends Component {
  render() {
    const {
      _id,
      seller_id,
      title,
      location,
      product_category,
      info,
      image_path,
      bid
    } = this.props.data;
    return (
      <>
        <div
          className="card m-3 overflow-hidden product"
          style={{ height: "250px" }}
          onClick={this.props.redirectToProductPage}
        >
          <div className="row no-gutters">
            <div className="col-md-4">
              <img src={image_path} className="card-img" alt={title} />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">
                  <b>{title}</b>
                </h5>
                <p className="card-text">
                  <b>Category:</b> {product_category}
                </p>
                <p className="card-text">
                  <b>Location:</b> {location}
                </p>
                <p className="card-text">
                  <b>Info:</b> {info}
                </p>
                <p className="card-text float-left">
                  <b>Bid:</b> {bid}JOD
                </p>

                <p className="card-text" style={{ clear: "left" }}>
                  <small className="text-muted">{seller_id}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="btn btn-danger position-absolute"
          style={{ zIndex: 1, bottom: "25px", right: "25px" }}
          onClick={() => this.props.deleteProduct(_id)}
        >
          DELETE
        </button>
      </>
    );
  }
}

export default Product;
