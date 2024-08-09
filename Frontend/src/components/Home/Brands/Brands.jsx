import "./Brands.scss";
import BrandCard from "./BrandCard/BrandCard";

const Brands = () => {
  return (
    <div className="brands-section">
      <div className="brand-header">
        <h2 className="title">Newly Arrived Brands</h2>
        <p className="view-all-btn">View All Brands</p>
      </div>
      <div className="brand-body">
        <BrandCard />
        <BrandCard />
        <BrandCard />
        <BrandCard />
      </div>
    </div>
  );
};

export default Brands;
