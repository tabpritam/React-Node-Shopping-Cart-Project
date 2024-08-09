import "./Header.scss";
import Logo from "../../assets/logo.svg";
import { FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useState, useContext, useEffect } from "react";
import AuthModal from "../AuthModal/AuthModal";
import Cart from "./Cart/Cart";
import { Context } from "../../utils/context";
import { fetchData } from "../../utils/api";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [userName, setUserName] = useState(null);

  const { cartCount } = useContext(Context);
  console.log(cartCount);

  const hanldeSuccessLogin = (userData) => {
    setUserName(userData);
    setShowAuthModal(false);
  };

  return (
    <>
      <div className="header-container">
        <div className="header">
          <div className="left">
            <img src={Logo} alt="logo" className="logo" />
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search for products"
                autoFocus
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
          <div className="right">
            {userName ? (
              <div>Hello, {userName}</div>
            ) : (
              <button
                className="auth-modal-btn"
                onClick={() => setShowAuthModal(true)}
              >
                Login
              </button>
            )}
            <div className="contact-number">+91 123-456-7890</div>
            <div className="info">
              <ul>
                <li>
                  <FaHeart />
                  <div className="count">
                    <span></span>
                  </div>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={() => {
                      setShowCart(true);
                    }}
                  >
                    <FaShoppingCart />
                    <div className="count">
                      <span>{cartCount}</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          showModalStatus={setShowAuthModal}
          onLogin={hanldeSuccessLogin}
        />
      )}
      {showCart && <Cart setShowCart={setShowCart} />}
    </>
  );
};

export default Header;
