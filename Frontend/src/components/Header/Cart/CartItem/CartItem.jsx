import "./CartItem.scss";
import { CiCircleRemove } from "react-icons/ci";
import useDelete from "../../../../hooks/useDelete";
import { Context } from "../../../../utils/context";
import { useContext } from "react";
import { useEffect, useState } from "react";

const CartItem = ({ cartItem }) => {
  const { setCartItems, setCartCount } = useContext(Context);
  const [removeProductId, setRemoveProductId] = useState(null);

  const removeFromCartEndPoint = `user/delete-cart/${removeProductId}`;

  const {
    data: cartProductData,
    error: cartProductError,
    loading: cartProductLoading,
    makeApiCall: removeFromCart,
  } = useDelete(removeFromCartEndPoint);
  useEffect(() => {
    if (cartProductData) {
      setCartItems(cartProductData);
      setCartCount(cartProductData.products.length);
    }
  }, [cartProductData]);

  const handleRemoveFromCart = (productId) => {
    setRemoveProductId(productId);
    removeFromCart();
    console.log(cartProductError);
    console.log(cartProductLoading);
  };

  console.log(cartItem);
  return (
    <div className="cart-products">
      {cartItem.map((item) => (
        <div key={item.product._id} className="cart-product">
          <div className="img-container">
            <img src={item.product.images[0].url} alt="" />
          </div>
          <div className="prod-details">
            <div>
              <span className="name">{item.product.title}</span>

              <div className="text">
                <span>{item.count}</span>
                <span>x</span>
                <span className="highlight">&#8377;{item.product.price}</span>
              </div>
            </div>
            <CiCircleRemove
              className="close-btn"
              data-id={item.product._id}
              onClick={() => handleRemoveFromCart(item.product._id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
