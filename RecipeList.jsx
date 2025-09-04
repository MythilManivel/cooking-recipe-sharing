import api from "../api";

const RecipeList = ({ recipes, refresh, onEdit }) => {
  const handleDelete = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    await api.delete(`/recipes/${id}`);
    refresh();
  };

  return (
    <div>
      <h3>Recipes</h3>
      {recipes.map((r) => (
        <div
          key={r._id}
          style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}
        >
          <h4>{r.title}</h4>
          <p>{r.description}</p>
          {r.imageUrl && <img src={r.imageUrl} alt="" width="150" />}
          <p>
            <b>Ingredients:</b> {r.ingredients.join(", ")}
          </p>
          <p>
            <b>Steps:</b> {r.steps.join(", ")}
          </p>
          <button onClick={() => onEdit(r)}>Edit</button>
          <button onClick={() => handleDelete(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
