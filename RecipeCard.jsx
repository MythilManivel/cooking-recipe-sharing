import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaClock, FaUsers } from "react-icons/fa";

const RecipeCard = ({ recipe = {}, onLike, onFavorite }) => {
  const {
    _id,
    title = "Untitled Recipe",
    description = "No description available",
    images = [],
    averageRating = 0,
    totalRatings = 0,
    cookingTime = 0,
    servings = 1,
    tags = [],
    likes = [],
  } = recipe;

  const imageSrc = images?.length > 0 ? images[0] : "/default-recipe.jpg";

  return (
    <div className="recipe-card">
      {/* Image Section */}
      <div className="recipe-image">
        <img src={imageSrc} alt={title} loading="lazy" />

        <button
          className="favorite-btn"
          onClick={() => onFavorite?.(_id)}
          aria-label="Add to favorites"
        >
          <FaHeart />
        </button>
      </div>

      {/* Content Section */}
      <div className="recipe-content">
        <h3>{title}</h3>
        <p className="recipe-description">{description}</p>

        {/* Meta Info */}
        <div className="recipe-meta">
          <span className="rating">
            <FaStar /> {averageRating.toFixed(1)} ({totalRatings})
          </span>

          <span className="time">
            <FaClock /> {cookingTime} min
          </span>

          <span className="servings">
            <FaUsers /> {servings} servings
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="recipe-tags">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="recipe-actions">
          <Link to={`/recipe/${_id}`} className="view-btn">
            View Recipe
          </Link>

          <button
            className="like-btn"
            onClick={() => onLike?.(_id)}
            aria-label="Like recipe"
          >
            <FaHeart /> {likes.length}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
