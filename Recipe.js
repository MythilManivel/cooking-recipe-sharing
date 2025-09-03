import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    imageUrl: { type: String },
    imagePublicId: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional now
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
