import "./Banner.scss";
import SliderImg from "../../../assets/slider.png";
import Banner1 from "../../../assets/banner-1.png";
import Banner2 from "../../../assets/banner-2.png";
const Banner = () => {
  return (
    <div className="banner-section">
      <div className="slider">
        <img src={SliderImg} alt="" />
      </div>
      <div className="banner">
        <img src={Banner1} alt="" className="banner-img" />
        <img src={Banner2} alt="" className="banner-img" />
      </div>
    </div>
  );
};

export default Banner;
