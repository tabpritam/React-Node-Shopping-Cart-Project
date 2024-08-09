import "./BrandCard.scss";
import BrandImg from "../../../../assets/brand-img.png";
const BrandCard = () => {
  return (
    <div className="brand-card">
      <div className="brand-img">
        <img src={BrandImg} alt="" />
      </div>
      <div className="brand-details">
        <div className="light-text">Amber Jar</div>
        <div className="title">Honey best nectar you wish to get</div>
      </div>
    </div>
  );
};

export default BrandCard;
