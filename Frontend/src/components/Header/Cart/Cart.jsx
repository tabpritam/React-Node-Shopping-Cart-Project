import "./Cart.scss";
import { FaShoppingCart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import CartItem from "./CartItem/CartItem";
import { Context } from "../../../utils/context";
import { useContext } from "react";
// import { useState, useEffect } from "react";
// import { useFetch } from "../../../hooks/useFetch";

const Cart = ({ setShowCart }) => {
  const { cartItems } = useContext(Context);
  const inCartproducts = cartItems.products;
  return (
    <div className="cart-panel">
      <div className="opac-layer" onClick={() => setShowCart(false)}></div>
      <div className="cart-content">
        <div className="cart-header">
          <span className="heading">My Cart</span>
          <span className="close-btn" onClick={() => setShowCart(false)}>
            <MdClose />
            <span className="text">Close</span>
          </span>
        </div>
        {inCartproducts.length > 0 ? (
          <CartItem cartItem={inCartproducts} />
        ) : (
          <div className="empty-cart">
            <FaShoppingCart />
            <span>No products in the cart.</span>
            <button className="return-cta">RETURN TO SHOP</button>
          </div>
        )}

        <div className="cart-footer">
          <div className="subtotal">
            <span className="text">Subtotal:</span>
            <span className="text total">
              &#8377;{cartItems.cartTotal.toFixed(2)}
            </span>
          </div>
          <div className="button">
            <button className="checkout-cta">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
