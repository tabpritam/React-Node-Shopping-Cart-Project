import "./SingleProduct.scss";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaCartPlus,
} from "react-icons/fa";

import { useState } from "react";

const SingleProduct = () => {
  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="single-product-main-content">
      <div className="layout">
        <div className="single-product-page">
          <div className="left">
            <img src="https://placehold.co/600x400" alt="prod" />
          </div>
          <div className="right">
            <span className="name">title</span>
            <span className="price">&#8377; 2000</span>
            <span className="desc">description</span>
            <div className="cart-buttons">
              <div className="quantity-buttons">
                <span onClick={handleDecrement}>--</span>
                <span>{count}</span>
                <span onClick={handleIncrement}>+</span>
              </div>
              <button className="add-to-cart-button">
                <FaCartPlus size={20} />
                ADD TO CART
              </button>
            </div>
            <span className="divider"></span>
            <div className="info-item">
              <span className="text-bold">
                Category: <span>Category name</span>
              </span>
              <span className="text-bold">
                Share
                <FaFacebookF size={16} />
                <FaTwitter size={16} />
                <FaInstagram size={16} />
                <FaLinkedinIn size={16} />
                <FaPinterest size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
