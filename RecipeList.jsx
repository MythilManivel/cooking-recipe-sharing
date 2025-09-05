import api from "../api";

const RecipeList = ({ recipes, refresh, onEdit }) => {
  const handleDelete = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    await api.delete(`/recipes/${id}`);
    refresh();
  };

  if (recipes.length === 0) {
    return (
      <div className="recipe-list">
        <h3>Your Recipe Collection</h3>
        <div className="text-center" style={{ padding: '3rem', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
          <h4>No recipes yet!</h4>
          <p>Start building your recipe collection by adding your first recipe above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <h3>Your Recipe Collection ({recipes.length} recipe{recipes.length !== 1 ? 's' : ''})</h3>
      <div className="recipe-grid">
        {recipes.map((r) => (
          <div key={r._id} className="recipe-card fade-in">
            {r.imageUrl ? (
              <img 
                src={r.imageUrl} 
                alt={r.title}
                className="recipe-image"
              />
            ) : (
              <div 
                className="recipe-image"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white'
                }}
              >
                🍳
              </div>
            )}
            
            <div className="recipe-content">
              <h4 className="recipe-title">{r.title}</h4>
              {r.description && (
                <p className="recipe-description">{r.description}</p>
              )}
              
              <div className="recipe-meta">
                <h4>🥘 Ingredients</h4>
                <p>{r.ingredients.length > 0 ? r.ingredients.slice(0, 3).join(", ") + (r.ingredients.length > 3 ? "..." : "") : "No ingredients listed"}</p>
              </div>
              
              <div className="recipe-meta">
                <h4>👩‍🍳 Steps</h4>
                <p>{r.steps.length > 0 ? `${r.steps.length} step${r.steps.length !== 1 ? 's' : ''}` : "No steps listed"}</p>
              </div>
              
              <div className="recipe-actions">
                <button 
                  onClick={() => onEdit(r)}
                  className="btn btn-secondary"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(r._id)}
                  className="btn btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
