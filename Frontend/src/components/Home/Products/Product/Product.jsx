import "./Product.scss";
import { FaCartPlus } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../../utils/context";
import usePost from "../../../../hooks/usePost";
import swal from "sweetalert";
const Product = (data) => {
  const [count, setCount] = useState(1);
  const { cartItems, setCartItems, cartCount, setCartCount } =
    useContext(Context);

  const handleIncrement = () => {
    setCount(count + 1);
  };
  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const productData = {
    cart: [
      {
        _id: data.data._id,
        count: count,
      },
    ],
  };
  const addToCartEndPoint = "user/cart";

  const {
    data: addproductData,
    error: addproductError,
    loading: addproductLoading,
    makeApiCall: addToCart,
  } = usePost(addToCartEndPoint, productData);

  useEffect(() => {
    if (addproductData) {
      swal({
        title: "Success",
        text: "Product added to cart",
        icon: "success",
      }).then(() => {
        setCount(1);
      });
      setCartItems(addproductData);
      console.log(addproductError);
      console.log(addproductLoading);
      setCartCount(cartCount + 1);
    }
  }, [addproductData]);
  const handleAddToCart = () => {
    addToCart();
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={data.data.images[0].url} alt="" />
      </div>
      <div className="product-info">
        <div className="product-name">{data.data.title}</div>
        <div className="product-price">&#8377; {data.data.price}</div>
      </div>
      <div className="buttons">
        <div className="counter">
          <span onClick={handleDecrement}>-</span>
          <span className="quantity">{count}</span>
          <span onClick={handleIncrement}>+</span>
        </div>
        <button
          className="add-to-cart-btn"
          data-id={data.data._id}
          onClick={handleAddToCart}
        >
          Add to Cart <FaCartPlus />
        </button>
      </div>
    </div>
  );
};

export default Product;
