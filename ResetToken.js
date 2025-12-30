import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto-delete after expiry
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResetToken", resetTokenSchema);
