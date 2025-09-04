import { useState, useEffect } from "react";
import api from "../api";

const RecipeForm = ({ onRecipeAdded, initialData, onUpdateComplete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState(null);
  const [recipeId, setRecipeId] = useState(null); // track editing

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

    if (recipeId) {
      // Editing existing recipe
      const res = await api.put(`/recipes/${recipeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdateComplete(res.data); // callback to dashboard
    } else {
      // Adding new recipe
      const res = await api.post("/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onRecipeAdded(res.data);
    }

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
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>{recipeId ? "Edit Recipe" : "Add Recipe"}</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <textarea
        placeholder="Steps (newline separated)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">{recipeId ? "Update" : "Add"}</button>
    </form>
  );
};

export default RecipeForm;
