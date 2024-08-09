import "./Category.scss";
import CategoryCard from "./CategoryCard/CategoryCard";

const Category = ({ categories }) => {
  if (!categories) return;

  return (
    <div className="category-section">
      <div className="category-header">
        <h2 className="title">Categories</h2>
        <p className="view-all-btn">View All Categories</p>
      </div>
      <div className="category-body">
        {categories.getallCategory.map((item) => (
          <CategoryCard data={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export default Category;
