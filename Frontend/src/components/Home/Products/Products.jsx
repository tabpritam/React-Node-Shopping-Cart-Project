import Product from "./Product/Product";
import "./Products.scss";

const Products = (products) => {
  console.log(products);
  // if (!products || !products.length) return null;
  return (
    <div className="products-container">
      <div className="products-header">
        <div className="title">Trending Products</div>
      </div>
      <div className="products">
        {/* {products.map((product) => (
          <Product key={product._id} />
        ))} */}
        {/* <Product /> */}
        
        {products.products.map((item) => (
          <Product data={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export default Products;
