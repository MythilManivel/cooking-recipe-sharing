import { useState, useEffect } from "react";
import api from "../api";

const RecipeForm = ({ onRecipeAdded, initialData, onUpdateComplete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState(null);
  const [recipeId, setRecipeId] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setIngredients(initialData.ingredients.join(", "));
      setSteps(initialData.steps.join("\n"));
      setRecipeId(initialData._id);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);
    if (image) formData.append("image", image);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const apiCall = recipeId
      ? api.put(`/recipes/${recipeId}`, formData, config)
      : api.post("/recipes", formData, config);

    const res = await apiCall;

    recipeId ? onUpdateComplete(res.data) : onRecipeAdded(res.data);

    // Reset form
    setTitle("");
    setDescription("");
    setIngredients("");
    setSteps("");
    setImage(null);
    setRecipeId(null);
    e.target.querySelector('input[type="file"]').value = null;
  };

  return (
    <div className="recipe-form fade-in">
      <h3>{recipeId ? "✏️ Edit Recipe" : "➕ Add New Recipe"}</h3>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Recipe Title</label>
          <input
            className="form-input"
            placeholder="Enter a delicious recipe title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Tell us about this amazing recipe..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ingredients</label>
          <textarea
            className="form-textarea"
            placeholder="List ingredients separated by commas"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={{ minHeight: "80px" }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cooking Steps</label>
          <textarea
            className="form-textarea"
            placeholder="Enter each step on a new line..."
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            style={{ minHeight: "120px" }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Recipe Image</label>
          <input
            type="file"
            className="form-file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          {recipeId ? "🔄 Update Recipe" : "🍳 Add Recipe"}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
