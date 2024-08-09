import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import Brand from "./Brands/Brands";
import Products from "./Products/Products";
import { Context } from "../../utils/context";

import { useEffect, useContext } from "react";
// import { useFetch } from "../../hooks/useFetch";
import { fetchData } from "../../utils/api";
import { useState } from "react";

const Home = () => {
  const {
    categories,
    setCategories,
    products,
    setProducts,
    setCartItems,
    setCartCount,
  } = useContext(Context);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const categories = await fetchData("category");
        setCategories(categories);
        const products = await fetchData("product");
        setProducts(products);
        const cartItems = await fetchData("user/cart");
        setCartItems(cartItems);
        setCartCount(cartItems.products.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [setCategories, setProducts, setCartItems]);

  if (loading) return <p>Fetching Data...</p>;
  return (
    <div className="home">
      <Banner />
      <Category categories={categories} />
      {/* <Brand /> */}
      <Products products={products} />
    </div>
  );
};

export default Home;
