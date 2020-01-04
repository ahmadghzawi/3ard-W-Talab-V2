import React, { Component } from "react";
import Container from "../components/Container";
import axios from "axios";
import Offer from "../components/Offer";

export default class ProductPage extends Component {
  state = {
    ...this.props.location.state
  };

  deleteProduct = _id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deletePost/${_id}`
      )
      .then(() => this.props.history.push("/dashboard"))
      .catch(err => console.log(err.message));
  };

  deleteOffer = (buyer, _id) => {
    axios
      .put(
        "https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteOffer",
        { buyer, _id }
      )
      .then(() => {
        let productInfo = this.props.location.state.productInfo
        delete productInfo[buyer]
        this.props.history.push({
          pathname: "/dashboard",
          state: { productInfo }
        });
        
      })
      .catch(err => console.log(err.message));
  };

  render() {
    console.log(this.props.location.state);
    const { product, offers, seller, users } = this.state;
    const offersToShow = offers.map((offer, index) => (
      <Offer
        key={index}
        data={offer}
        users={users}
        deleteOffer={this.deleteOffer}
        product_id={product._id}
      />
    ));
    return (
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-12">
            <button
              className="btn btn-success float-left"
              onClick={() => this.props.history.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="btn btn-info float-right"
              onClick={() => this.props.history.push("/logout")}
            >
              LogOut
            </button>
          </div>
        </div>
        <hr />

        <div className="row mt-3">
          <Container
            className="col-md-12"
            title={"Owner: " + seller.name + " " + seller._id}
          >
            <div className="container-fluid">
              <div className="row mt-3 mb-3" style={{ fontSize: 30 }}>
                <div className="col-md-3">
                  <img
                    src={product.image_path}
                    alt={product.title}
                    title={product.title}
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover"
                    }}
                  />
                </div>

                <div className="col-md-4">
                  <p className="mt-5">
                    <b>Title:</b> {product.title}
                  </p>
                  <p className="mt-5">
                    <b>Category:</b> {product.product_category}
                  </p>
                  <p className="mt-5">
                    <b>Location:</b> {product.location}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mt-5">
                    <b>Info:</b> {product.info}
                  </p>
                  <p className="mt-5">
                    <b>Bid:</b> {product.bid} JOD
                  </p>
                </div>
                <div className="col-md-1">
                  <button
                    className="btn btn-danger position-absolute"
                    style={{ fontSize: 30, bottom: "10px", right: "25px" }}
                    onClick={() => this.deleteProduct(product._id)}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className="row mt-3">
          <Container className="col-md-12" title="Offers">
            <div className="container-fluid">
              <div className="row mt-3 mb-3" style={{ fontSize: 20 }}>
                {offersToShow}
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
