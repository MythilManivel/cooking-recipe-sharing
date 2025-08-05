import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaClock, FaUsers } from 'react-icons/fa';

const RecipeCard = ({ recipe, onLike, onFavorite }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-image">
        <img src={recipe.images[0] || '/default-recipe.jpg'} alt={recipe.title} />
        <button className="favorite-btn" onClick={() => onFavorite(recipe._id)}>
          <FaHeart />
        </button>
      </div>
      
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        
        <div className="recipe-meta">
          <span className="rating">
            <FaStar /> {recipe.averageRating.toFixed(1)} ({recipe.totalRatings})
          </span>
          <span className="time">
            <FaClock /> {recipe.cookingTime} min
          </span>
          <span className="servings">
            <FaUsers /> {recipe.servings} servings
          </span>
        </div>
        
        <div className="recipe-tags">
          {recipe.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="recipe-actions">
          <Link to={`/recipe/${recipe._id}`} className="view-btn">
            View Recipe
          </Link>
          <button className="like-btn" onClick={() => onLike(recipe._id)}>
            <FaHeart /> {recipe.likes.length}
          </button>
        </div>
      </div>
    </div>
  );
};