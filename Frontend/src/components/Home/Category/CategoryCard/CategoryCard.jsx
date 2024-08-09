import "./CategoryCard.scss";

const CategoryCard = (data) => {
  return (
    <div className="category-card">
      <div className="category-img">
        <img src={data.data.image} alt="" />
      </div>
      <div className="category-name">{data.data.title}</div>
    </div>
  );
};

export default CategoryCard;
